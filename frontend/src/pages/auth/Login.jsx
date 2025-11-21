import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import MotionButton from "../../components/MotionButton.jsx";
import Input from "../../components/Inputs/Input.jsx";
import { validateEmail } from "../../utils/helper.js";
import LoginLayout from "../../components/Layouts/LoginLayout.jsx";
import axiosInstance from "../../utils/axiosinstance.js";
import { API_PATHS } from "../../utils/apiPaths.js";
import { UserContext } from "../../context/userContext.jsx";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!validateEmail(trimmedEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (trimmedPassword.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post(
        API_PATHS.AUTH.LOGIN,
        { email: trimmedEmail, password: trimmedPassword },
        { withCredentials: true } // crucial for refresh token cookie
      );

      // Save access token + user info
      const { token, role, name, email: userEmail, _id, profileImageUrl } = response.data;
      localStorage.setItem("accessToken", token);
      updateUser({ token, role, name, email: userEmail, _id, profileImageUrl });

      toast.success("Login successful!");

      // Redirect
      navigate(role === "admin" ? "/admin/dashboard" : "/user/dashboard");
    } catch (error) {
      const msg =
        error.response?.data?.message || "Login failed. Check credentials.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-slate-900">
          <p className="text-3xl text-slate-800 mt-[5px] mb-6 font-bold tracking-tight">Welcome Back</p>
        </h3>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email address
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              required
            />
          </div>

          <MotionButton
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 rounded-xl font-semibold shadow-lg shadow-indigo-500/20"
          >
            {loading ? "Logging in..." : "Login"}
          </MotionButton>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-primary hover:text-primary-hover font-medium cursor-pointer transition-colors"
            >
              Sign Up
            </span>
          </p>
        </form>
      </div>
    </LoginLayout>
  );
};

export default Login;
