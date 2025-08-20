import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useLoginMutation } from "../graphql/mutations/loginUser";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router";
import { useSnackbar } from "notistack";

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loginDetails, setLoginDetails] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const isDisabled = !loginDetails.email || !loginDetails.password;

  const { login: loginMutation, loading } = useLoginMutation(loginDetails, data => {
    const errs = data?.login?.errors || [];
    if (errs.length > 0) {
      errs.forEach(err => enqueueSnackbar(err, { variant: "error" }));
      return;
    }
    const token = data?.login?.token;
    const user = data?.login?.user;
    if (!token || !user) {
      enqueueSnackbar("Unexpected login response", { variant: "error" });
      return;
    }
    login(token, user);
    navigate("/", { replace: true });
  });

  const handleSubmit = e => {
    e.preventDefault();
    if (loading || isDisabled) return;
    try {
      loginMutation();
    } catch (err) {
      enqueueSnackbar("Network error. Try again.", { variant: "error" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <h1 className="text-2xl font-bold mb-4">Login</h1>
          <p className="text-gray-600 mb-6">Enter your credentials to log in.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5 flex flex-col" noValidate>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                autoFocus
                required
                id="email"
                type="email"
                placeholder="you@example.com"
                value={loginDetails.email}
                onChange={e => setLoginDetails({ ...loginDetails, email: e.target.value })}
                autoComplete="email"
                className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  required
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={loginDetails.password}
                  onChange={e => setLoginDetails({ ...loginDetails, password: e.target.value })}
                  minLength={6}
                  autoComplete="current-password"
                  className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-20 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  aria-pressed={showPassword}
                  className="absolute inset-y-0 right-2 flex items-center px-2 cursor-pointer text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || isDisabled}
              className="bg-violet-600 text-white rounded-md px-4 py-2 hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed self-end focus:outline-none focus:ring-2 focus:ring-violet-400"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-sm text-gray-600 mt-4 text-center">
            Do you have an account?{" "}
            <Link to="/signup" className="text-violet-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
