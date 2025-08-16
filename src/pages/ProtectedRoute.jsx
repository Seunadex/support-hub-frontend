import { Navigate, useLocation } from "react-router";
import { loginPath } from "../path";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = Cookies.get("auth_token");
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={loginPath()} state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
