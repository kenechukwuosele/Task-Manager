import React, { useState } from "react";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";
import AuthLayout from "../../components/Layouts/AuthLayout";
import Input from "../../components/Inputs/Input";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import MotionButton from "../../components/MotionButton";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
  e.preventDefault();

  if (!name) return toast.error("Please enter your full name");
  if (!email) return toast.error("Please enter a valid email address");
  if (password.length < 8)
    return toast.error("Password must be at least 8 characters long");

  setLoading(true);

  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    if (adminInviteToken) formData.append("adminInviteToken", adminInviteToken);
    if (profilePic) formData.append("profilePic", profilePic);

    const response = await axiosInstance.post(
      API_PATHS.AUTH.REGISTER,
      formData,
      { withCredentials: true }
    );

    console.log(response.data); // Check the returned profileImageUrl

    toast.success("Account created successfully!");
    navigate("/login");
  } catch (error) {
    toast.error(
      error.response?.data?.message || error.message || "Registration failed"
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <AuthLayout>
      <div className="flex justify-center items-center mt-10 md:mt-0 px-4">
        <div className="w-full max-w-md glass-card p-8 space-y-6">
          <h1 className="text-3xl font-bold text-center text-slate-800 tracking-tight">
            Create Your Account
          </h1>
          <p className="text-center text-sm text-slate-500">
            Join Task Manager today and manage your tasks efficiently
          </p>

          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Full Name
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email Address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="john@example.com"
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
                required
                placeholder="Minimum 8 characters"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Admin Invite Token
              </label>
              <Input
                type="text"
                value={adminInviteToken}
                onChange={(e) => setAdminInviteToken(e.target.value)}
              />
            </div>

            <MotionButton
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 rounded-xl font-semibold mt-2"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </MotionButton>

            <p className="mt-4 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-primary hover:text-primary-hover font-medium cursor-pointer transition-colors"
              >
                Login
              </span>
            </p>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
