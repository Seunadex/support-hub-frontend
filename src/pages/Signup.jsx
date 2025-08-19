import { useState } from "react";
import { useSignupMutation } from "../graphql/mutations/signupUser";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";
import { useSnackbar } from 'notistack'

const Signup = () => {
  const { enqueueSnackbar } = useSnackbar();
  let navigate = useNavigate();
  const { login } = useAuth();
  const [signupDetails, setSignupDetails] = useState({ firstName: "", lastName: "", email: "", password: "" });

  const { signup: signupMutation, loading } = useSignupMutation(
    signupDetails,
    (data) => {
      if (data.signup.errors.length > 0) {
        return data.signup.errors.forEach((error) => enqueueSnackbar(error, { variant: 'error' }));
      }
      login(data.signup.token, data.signup.user);
      navigate("/");
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    signupMutation();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
          <p className="text-gray-600 mb-6">
            Please enter your credentials to sign up.
          </p>
          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5 flex flex-col"
          >
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                autoFocus
                required
                id="firstName"
                type="text"
                placeholder="First Name"
                value={signupDetails.firstName}
                onChange={(e) =>
                  setSignupDetails({ ...signupDetails, firstName: e.target.value })
                }
                className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                required
                id="lastName"
                type="text"
                placeholder="Last Name"
                value={signupDetails.lastName}
                onChange={(e) =>
                  setSignupDetails({ ...signupDetails, lastName: e.target.value })
                }
                className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                required
                id="email"
                type="email"
                placeholder="Email"
                value={signupDetails.email}
                onChange={(e) =>
                  setSignupDetails({ ...signupDetails, email: e.target.value })
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
                required
                id="password"
                type="password"
                placeholder="Password"
                value={signupDetails.password}
                onChange={(e) =>
                  setSignupDetails({ ...signupDetails, password: e.target.value })
                }
                className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-violet-600 text-white rounded-md px-4 py-1 hover:bg-violet-700 flex self-end cursor-pointer"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>
          <p className="text-sm text-gray-600 mt-4 text-center">
            Already have an account?{" "}
            <a href="/login" className="text-violet-600 hover:underline">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
