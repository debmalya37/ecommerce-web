"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    state: "",
    pincode: "",
    address: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        router.push("/login");
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (error) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1a1a2e] via-[#302b63] to-[#24243e]">
      <div className="relative w-[350px] sm:w-[400px] bg-[#1e1e2f]/80 rounded-xl shadow-xl p-6 text-white backdrop-blur-md">
        {/* Cool background overlay (optional) */}
        <div className="absolute inset-0 bg-black bg-opacity-30 rounded-xl pointer-events-none" />
        <div className="relative flex items-center space-x-10 w-full mb-6 justify-center">
          <Link href={"/login"} className="flex text-center m-0 p-2 pr-5 pl-5 bg-[#573b8a] text-gray-200 rounded-md">Login</Link>
          <button className="flex text-center m-0 p-2 pr-4 pl-4 bg-white text-black rounded-md">Sign up</button>
          </div>

        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold text-center mb-6 text-[#f5f5f7] drop-shadow-lg">
            Create an Account
          </h2>

          {error && (
            <p className="text-red-400 text-center mb-4 font-semibold">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              onChange={handleChange}
              required
              className="w-full p-3 rounded-md border-none outline-none bg-[#e0dede] text-gray-800 placeholder-gray-500 shadow-inner focus:ring-2 focus:ring-[#6d44b8]"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="w-full p-3 rounded-md border-none outline-none bg-[#e0dede] text-gray-800 placeholder-gray-500 shadow-inner focus:ring-2 focus:ring-[#6d44b8]"
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              onChange={handleChange}
              required
              className="w-full p-3 rounded-md border-none outline-none bg-[#e0dede] text-gray-800 placeholder-gray-500 shadow-inner focus:ring-2 focus:ring-[#6d44b8]"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full p-3 rounded-md border-none outline-none bg-[#e0dede] text-gray-800 placeholder-gray-500 shadow-inner focus:ring-2 focus:ring-[#6d44b8]"
            />

            <input
              type="text"
              name="state"
              placeholder="State"
              onChange={handleChange}
              required
              className="w-full p-3 rounded-md border-none outline-none bg-[#e0dede] text-gray-800 placeholder-gray-500 shadow-inner focus:ring-2 focus:ring-[#6d44b8]"
            />

            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              onChange={handleChange}
              required
              className="w-full p-3 rounded-md border-none outline-none bg-[#e0dede] text-gray-800 placeholder-gray-500 shadow-inner focus:ring-2 focus:ring-[#6d44b8]"
            />

            <textarea
              name="address"
              placeholder="Address"
              onChange={handleChange}
              required
              className="w-full p-3 rounded-md border-none outline-none bg-[#e0dede] text-gray-800 placeholder-gray-500 shadow-inner focus:ring-2 focus:ring-[#6d44b8]"
            />

            <button
              type="submit"
              className="w-full py-3 mt-3 rounded-md bg-[#573b8a] text-white font-bold text-lg hover:bg-[#6d44b8] transition focus:ring-2 focus:ring-offset-2 focus:ring-[#6d44b8]"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
