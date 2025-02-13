"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Toggle for password visibility

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      ...formData,
      redirect: false,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/profile");
    }
  };

  // Eye icon for open/closed animation
  const EyeIcon = () => {
    return showPassword ? (
      // Eye Open
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
      // Eye Closed
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e]">
      {/* Outer Card Container */}
      <div className="relative w-[350px] h-[500px] bg-[url('https://doc-08-2c-docs.googleusercontent.com/docs/securesc/.../1Sx0jhdpEpnNIydS4rnN4kHSJtU1EyWka?e=view&authuser=0')] bg-cover bg-center rounded-[10px] shadow-[5px_20px_50px_#000] overflow-hidden">
        {/* Dark Overlay (optional) */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

        {/* Login Form Container */}
        <div className="relative w-full h-full flex flex-col items-center justify-center p-6 z-10">
          <h2 className="text-3xl font-bold text-white mb-6">Login</h2>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col items-center w-full">
            {/* Email Input */}
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="w-[80%] mb-4 p-3 rounded-md border-none outline-none bg-[#e0dede] text-gray-700"
            />

            {/* Password Input + Toggle */}
            <div className="w-[80%] mb-4 relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                onChange={handleChange}
                required
                className="w-full p-3 rounded-md border-none outline-none bg-[#e0dede] text-gray-700"
              />
              {/* Eye Toggle Icon */}
              <button
              title="Toggle Password Visibility"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-600"
              >
                <EyeIcon />
              </button>
            </div>

            <button
              type="submit"
              className="w-[60%] bg-[#573b8a] text-white py-3 rounded-md font-bold hover:bg-[#6d44b8] transition"
            >
              Login
            </button>
          </form>

          <p className="text-white mt-6">
            New User?{" "}
            <Link href="/register" className="text-yellow-300 hover:underline font-semibold">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
