import { useState } from "react";
import { useLoginMutation } from "../graphql/mutations/loginUser";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";

const Login = () => {
  let navigate = useNavigate();
  const { login } = useAuth();
  const [loginDetails, setLoginDetails] = useState({ email: "", password: "" });

  const { login: loginMutation, loading } = useLoginMutation(
    loginDetails,
    (data) => {
      if (data.login.errors) {
        data.login.errors.forEach((error) => console.error(error));
      }
      login(data.login.token, data.login.user);
      navigate("/");
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <h1 className="text-2xl font-bold mb-4">Login</h1>
          <p className="text-gray-600 mb-6">
            Please enter your credentials to login.
          </p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={loginDetails.email}
              onChange={(e) =>
                setLoginDetails({ ...loginDetails, email: e.target.value })
              }
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={loginDetails.password}
              onChange={(e) =>
                setLoginDetails({ ...loginDetails, password: e.target.value })
              }
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 text-sm"
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
    </div>
  );
};

export default Login;
