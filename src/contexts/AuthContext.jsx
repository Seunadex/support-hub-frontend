import { createContext, useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_CURRENT_USER } from "../graphql/queries/getCurrentUser";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Get token from cookies
  const token = Cookies.get("auth_token");
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });


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
        localStorage.setItem("currentUser", JSON.stringify(data.getCurrentUser));
        setIsAuthenticated(true);
      } else if (error) {
        // Token might be invalid, clear it
        console.error("Error fetching current user:", error);
        Cookies.remove("auth_token");
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem("currentUser");
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem("currentUser");
    }
  }, [token, data, error]);

  const login = (token, userData) => {
    Cookies.set("auth_token", token, { expires: 1, secure: true });
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem("currentUser", JSON.stringify(userData));
  };

  const logout = () => {
    Cookies.remove("auth_token");
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("currentUser");
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