"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700">Create an Account</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} required className="w-full p-3 border rounded" />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="w-full p-3 border rounded" />
          <input type="text" name="phone" placeholder="Phone Number" onChange={handleChange} required className="w-full p-3 border rounded" />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="w-full p-3 border rounded" />
          <input type="text" name="state" placeholder="State" onChange={handleChange} required className="w-full p-3 border rounded" />
          <input type="text" name="pincode" placeholder="Pincode" onChange={handleChange} required className="w-full p-3 border rounded" />
          <textarea name="address" placeholder="Address" onChange={handleChange} required className="w-full p-3 border rounded"></textarea>
          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700">{loading ? "Registering..." : "Register"}</button>
        </form>
      </div>
    </div>
  );
}
