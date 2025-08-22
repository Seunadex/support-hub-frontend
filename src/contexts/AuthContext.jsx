import {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import Cookies from "js-cookie";
import { useQuery } from "@apollo/client";
import { GET_CURRENT_USER } from "../graphql/queries/getCurrentUser";

// Cookie helpers
const COOKIE_NAME = "auth_token";
const readToken = () => Cookies.get(COOKIE_NAME) || null;
const setToken = (token) => {
  const isHttps =
    typeof window !== "undefined" && window.location.protocol === "https:";
  Cookies.set(COOKIE_NAME, token, {
    expires: 1,
    secure: isHttps,
    sameSite: "lax",
  });
};
const clearToken = () => Cookies.remove(COOKIE_NAME);

// Cross-tab sync key
const AUTH_EVENT_KEY = "auth_event";

// Detect true auth failures
const isAuthError = (err) => {
  if (!err) return false;
  const http = err.networkError;
  const status = http?.statusCode || http?.response?.status;
  if (status === 401 || status === 403) return true;
  return (err.graphQLErrors || []).some(
    (e) =>
      e?.extensions?.code === "UNAUTHENTICATED" ||
      e?.extensions?.code === "FORBIDDEN"
  );
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [hasToken, setHasToken] = useState(() => !!readToken());
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!readToken());

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("currentUser");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const { data, loading, error, refetch } = useQuery(GET_CURRENT_USER, {
    skip: !hasToken,
    errorPolicy: "all",
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

  // Apply query results to state
  useEffect(() => {
    if (!hasToken) {
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem("currentUser");
      return;
    }

    if (data?.getCurrentUser) {
      setUser(data.getCurrentUser);
      localStorage.setItem("currentUser", JSON.stringify(data.getCurrentUser));
      setIsAuthenticated(true);
      return;
    }

    // Only logout when there is an auth error
    if (error && isAuthError(error)) {
      clearToken();
      setHasToken(false);
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem("currentUser");
    }
  }, [hasToken, data, error]);

  // Refetch on focus or when tab becomes visible, ignore offline
  useEffect(() => {
    if (!isAuthenticated) return;

    const safeRefetch = async () => {
      if (!navigator.onLine) return;
      try {
        await refetch?.();
      } catch (err) {
        console.error(err);
      }
    };

    const onFocus = () => safeRefetch();
    const onVisibility = () => {
      if (document.visibilityState === "visible") safeRefetch();
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [isAuthenticated, refetch]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== AUTH_EVENT_KEY) return;
      setHasToken(!!readToken());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = useCallback((token, userData) => {
    setToken(token);
    setHasToken(true);
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem("currentUser", JSON.stringify(userData));
    localStorage.setItem(AUTH_EVENT_KEY, String(Date.now()));
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setHasToken(false);
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("currentUser");
    localStorage.setItem(AUTH_EVENT_KEY, String(Date.now()));
  }, []);

  const refresh = useCallback(() => {
    if (hasToken) return refetch?.();
    return Promise.resolve();
  }, [hasToken, refetch]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      loading,
      login,
      logout,
      refresh,
    }),
    [user, isAuthenticated, loading, login, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
