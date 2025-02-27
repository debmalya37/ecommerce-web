"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Forgot password modal states
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStage, setForgotStage] = useState<"request" | "reset">("request");
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      ...formData,
      redirect: false,
    });
    setLoading(false);

    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/profile");
    }
  };

  // Toggle password visibility with an eye icon animation.
  const EyeIcon = () => {
    return showPassword ? (
      // Open Eye Icon
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-6 h-6 transition-transform duration-300 hover:scale-125"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 12c1.5-4.5 4.73-7.5 9.75-7.5s8.25 3 9.75 7.5c-1.5 4.5-4.73 7.5-9.75 7.5s-8.25-3-9.75-7.5z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ) : (
      // Closed Eye Icon
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-6 h-6 transition-transform duration-300 hover:scale-125"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.98 8.223c2.69-3.826 5.854-5.723 8.77-5.723 2.918 0 6.08 1.898 8.77 5.723a.75.75 0 11-1.272.818C17.496 5.635 14.963 3.75 12.75 3.75c-2.213 0-4.745 1.885-7.498 5.291a.75.75 0 01-1.272-.818z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.013 13.213A3.002 3.002 0 0112 9.75c.62 0 1.209.188 1.687.51m1.301 1.315c.33.499.512 1.088.512 1.675a3 3 0 01-3 3c-.586 0-1.176-.182-1.675-.512m0 0l-3.75 3.75m3.75-3.75l-6-6"
        />
      </svg>
    );
  };

  // Handle Forgot Password Flow
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    if (forgotStage === "request") {
      // Request OTP
      setForgotLoading(true);
      try {
        const response = await fetch("/api/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: forgotEmail }),
        });
        const data = await response.json();
        if (data.success) {
          setForgotStage("reset");
        } else {
          setForgotError(data.error || "Failed to send OTP");
        }
      } catch (err: any) {
        setForgotError(err.message || "Error sending OTP");
      } finally {
        setForgotLoading(false);
      }
    } else {
      // Reset Password
      if (newPassword !== confirmNewPassword) {
        setForgotError("Passwords do not match");
        return;
      }
      setForgotLoading(true);
      try {
        const response = await fetch("/api/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: forgotEmail,
            otp,
            newPassword,
            confirmPassword: confirmNewPassword,
          }),
        });
        const data = await response.json();
        if (data.success) {
          setShowForgotModal(false);
          router.push("/login");
        } else {
          setForgotError(data.error || "Failed to reset password");
        }
      } catch (err: any) {
        setForgotError(err.message || "Error resetting password");
      } finally {
        setForgotLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e]">
      {/* Main Login Card */}
      <div className="relative w-[350px] h-[500px] bg-[url('https://doc-08-2c-docs.googleusercontent.com/docs/securesc/.../1Sx0jhdpEpnNIydS4rnN4kHSJtU1EyWka?e=view&authuser=0')] bg-cover bg-center rounded-[10px] shadow-[5px_20px_50px_#000] overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative w-full h-full flex flex-col items-center justify-center p-6 z-10">
          <div className="relative flex items-center space-x-10 w-full mb-6 justify-center">
          <button className="flex text-center m-2 p-2 pr-5 pl-5 bg-white text-black rounded-md">Login</button>
          <Link href={"/register"} className="flex text-center m-2 p-2 pr-4 pl-4 bg-[#573b8a] text-gray-200 rounded-md">Sign up</Link>
          </div>
          <h2 className="text-3xl font-bold text-white mb-6">Login</h2>
          
          {error && <p className="text-red-500 text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="flex flex-col items-center w-full">
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="w-[80%] mb-4 p-3 rounded-md border-none outline-none bg-[#e0dede] text-gray-700"
            />
            <div className="w-[80%] mb-4 relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                onChange={handleChange}
                required
                className="w-full p-3 rounded-md border-none outline-none bg-[#e0dede] text-gray-700"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-600"
                title="Toggle Password Visibility"
              >
                <EyeIcon />
              </button>
            </div>
            <button
              type="submit"
              className="w-[60%] bg-[#573b8a] text-white py-3 rounded-md font-bold hover:bg-[#6d44b8] transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="text-white mt-6 justify-center text-center">
            <span
              className="cursor-pointer text-yellow-300 hover:underline"
              onClick={() => setShowForgotModal(true)}
            >
              Forgot Password?
            </span>
            <br />
            <span>
            New User?{" "}
            <Link href="/register" className="text-yellow-300 hover:underline font-semibold">
              Create an account
            </Link>
            </span>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] sm:w-[400px]">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">
              {forgotStage === "request" ? "Reset Password" : "Enter OTP & New Password"}
            </h3>
            {forgotError && <p className="text-red-500 mb-4">{forgotError}</p>}
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              {forgotStage === "request" && (
                <>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-700 transition"
                  >
                    {forgotLoading ? "Sending OTP..." : "Send OTP"}
                  </button>
                </>
              )}

              {forgotStage === "reset" && (
                <>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white p-3 rounded-md font-semibold hover:bg-green-700 transition"
                  >
                    {forgotLoading ? "Updating Password..." : "Update Password"}
                  </button>
                </>
              )}
            </form>
            <button onClick={() => setShowForgotModal(false)} className="mt-4 w-full text-center text-blue-600 hover:underline">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
