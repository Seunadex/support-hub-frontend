import { createContext, useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_CURRENT_USER } from "../graphql/queries/getCurrentUser";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("current_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Get token from cookies
  const token = Cookies.get("auth_token");

  // Query current user if token exists
  const { data, loading, error } = useQuery(GET_CURRENT_USER, {
    skip: !token, // Skip query if no token
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network' // Ensures fresh data on refresh
  });

  // Handle authentication state based on token and user data
  useEffect(() => {
    if (token) {
      if (data?.getCurrentUser) {
        setUser(data.getCurrentUser);
        localStorage.setItem("current_user", JSON.stringify(data.getCurrentUser));
        setIsAuthenticated(true);
      } else if (error) {
        // Token might be invalid, clear it
        console.error("Error fetching current user:", error);
        Cookies.remove("auth_token");
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem("current_user");
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem("current_user");
    }
  }, [token, data, error]);

  const login = (token, userData) => {
    Cookies.set("auth_token", token, { expires: 1, secure: true });
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem("current_user", JSON.stringify(userData));
  };

  const logout = () => {
    Cookies.remove("auth_token");
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("current_user");
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};