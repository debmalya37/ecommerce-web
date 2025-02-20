"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    state: "",
    pincode: "",
    country: "India",
  });
  const userEmail = session?.user?.email || "";
  if (!userEmail) {
    // If the user is not allowed, redirect to the homepage.
    router.push("/login");
  }
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/user");
        setUser(response.data);
        setFormData({
          phone: response.data.phone,
          address: response.data.address,
          state: response.data.state,
          pincode: response.data.pincode,
          country: response.data.country || "India",
        });
      } catch (err) {
        setError("Failed to fetch user data.");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post("/api/user", formData);
      setUser((prev: any) => ({ ...prev, ...formData }));
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update profile.");
    }
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">My Profile</h1>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold">Full Name</label>
          <p className="bg-gray-100 p-3 rounded-md">{user?.fullName}</p>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold">Email</label>
          <p className="bg-gray-100 p-3 rounded-md">{user?.email}</p>
        </div>

        {/* <div>
          <label className="block text-gray-700 font-semibold">Wallet Balance</label>
          <p className="bg-gray-100 p-3 rounded-md">₹{user?.wallet?.balance}</p>
        </div> */}

<div>
  <label className="block text-gray-700 font-semibold">Earned Detergent (kg)</label>
  <p className="bg-gray-100 p-3 rounded-md">
    {(user?.wallet?.coins / 1000).toFixed(3)} kg
  </p>
</div>

        {/** Editable Fields */}
        {isEditing ? (
          <>
            <div>
              <label className="block text-gray-700 font-semibold">Phone</label>
              <input
              title="Phone"
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold">Address</label>
              <input
              title="Address"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold">State</label>
              <input
              title="state"
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold">Pincode</label>
              <input
              title="Pincode"
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold">Country</label>
              <select
              title="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="India">India</option>
                <option value="USA">USA</option>
                <option value="UK">UK</option>
                <option value="Canada">Canada</option>
              </select>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full mt-4 bg-green-500 text-white py-3 rounded-md font-semibold hover:bg-green-600 transition"
            >
              Save Changes
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full mt-4 bg-blue-500 text-white py-3 rounded-md font-semibold hover:bg-blue-600 transition"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}
