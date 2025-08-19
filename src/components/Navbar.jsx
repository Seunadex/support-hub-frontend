import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { NavLink, useNavigate } from "react-router";

const Navbar = () => {
  let navigate = useNavigate();

  const { isAuthenticated, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center p-4 shadow-lg bg-violet-100">
      <div>
        <span className="text-violet-800 font-bold text-lg">Support Hub</span>
      </div>
      <div>
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="text-violet-800 border border-violet-800 rounded-md px-4 py-1 hover:cursor-pointer"
          >
            Logout
          </button>
        ) : (
          <div className="flex gap-4">
            <NavLink to="/login" className="text-violet-800 border border-violet-800 rounded-md px-4 py-1 hover:cursor-pointer">
              Login
            </NavLink>
            <NavLink to="/signup" className="text-violet-800 border border-violet-800 rounded-md px-4 py-1 hover:cursor-pointer">
              Register
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
