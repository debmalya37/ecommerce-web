"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import Link from "next/link";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
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
    router.push("/login");
  }

  // Fetch user data
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
  }, [router]);

  // Fetch notifications for delivery information
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("/api/notifications");
        setNotifications(response.data);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };
    fetchNotifications();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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

  // Compute detergent earnings
  const previousEarningsInGrams = user.walletHistory
    ? user.walletHistory.reduce(
        (acc: number, record: { year: number; coins: number }) => acc + record.coins,
        0
      )
    : 0;
  const currentYearEarningsInGrams = user.wallet?.coins || 0;
  const totalEarningsKg = (
    (previousEarningsInGrams + currentYearEarningsInGrams) /
    1000
  ).toFixed(3);

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">My Profile</h1>
      <div className="mt-auto flex items-center justify-between pt-3">
      <Link className="inline-flex items-center text-sm font-semibold px-4 py-2 rounded-md transition bg-white border-2 border-green-600 hover:bg-blue-400" href="/profile/orders">
                   <span className="flex text-center text-black rounded-md pr-1">Orders</span>
                  <img className="flex text-center bg-white text-black rounded-md" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAv0lEQVR4nO2WSwoCMRBEcw31QoogpsF72BlG1+KtxFmJ9/Gz0VVJyEodZ2InIoEu6FVDP1KVRRmj+rcs+EhwyDN8iAbng4Yx34KFhsnvkILNuwsxeZYNlqhsMGnGEdKMy/pcEik4c+v43DCirCbwRdowLJaD13sL8Cjs3LkP3CT0qrrFwXUA874TbFFNE3rVjeBWM9RDPx5qwXe/m6OadIID3G0T4C0RuE0v9Pnl3Fi4qwzGJwLvLHgcDVWZH+kBw0Lc2yYZ514AAAAASUVORK5CYII=" alt="purchase-order"/>
                </Link>
                </div>
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold">Full Name</label>
          <p className="bg-gray-100 p-3 rounded-md">{user?.fullName}</p>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold">Email</label>
          <p className="bg-gray-100 p-3 rounded-md">{user?.email}</p>
        </div>

        {/* Earned Detergent Section (displayed in kg) */}
        <div>
          <label className="block text-gray-700 font-semibold">Earned Detergent (kg)</label>
          <p className="bg-gray-100 p-3 rounded-md">
            {(user?.wallet?.coins / 1000).toFixed(3)} kg (Current Year)
          </p>
        </div>

        {/* Editable Fields */}
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
                title="State"
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

      {/* Detergent Earning History Table */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Detergent Earning History</h2>
        {user?.walletHistory && user.walletHistory.length > 0 ? (
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 border">Year</th>
                <th className="px-4 py-2 border">Detergent Earned (kg)</th>
              </tr>
            </thead>
            <tbody>
              {user.walletHistory.map((record: { year: number; coins: number }) => (
                <tr key={record.year}>
                  <td className="px-4 py-2 border">{record.year}</td>
                  <td className="px-4 py-2 border">{(record.coins / 1000).toFixed(3)} kg</td>
                </tr>
              ))}
              <tr className="font-bold">
                <td className="px-4 py-2 border">Total</td>
                <td className="px-4 py-2 border">
                  {(
                    (user.walletHistory.reduce(
                      (acc: number, record: any) => acc + record.coins,
                      0
                    ) +
                      (user.wallet?.coins || 0)) /
                    1000
                  ).toFixed(3)}{" "}
                  kg
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p>No detergent earning history available.</p>
        )}
        <p className="mt-2 text-sm text-gray-600">
          At the start of each year, your current year&apos;s detergent earned is added to your history and your current detergent balance is reset.
        </p>
      </div>

      {/* Gift Section */}
      <div className="mt-6 p-4 bg-green-100 rounded-lg text-center">
        <h3 className="text-xl font-bold text-green-800">Your Gift for the Next Year</h3>
        <p className="text-gray-700 mt-2">
          As a token of our appreciation, you will receive a special gift every year based on your detergent earnings.
          Keep shopping for more Gift!
        </p>
      </div>

      {/* Delivery Notifications Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Delivery Information</h2>
        {notifications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 border">Title</th>
                  <th className="px-4 py-2 border">Message</th>
                  <th className="px-4 py-2 border">Date</th>
                </tr>
              </thead>
              <tbody>
                {notifications.map((notif: any) => (
                  <tr key={notif._id}>
                    <td className="px-4 py-2 border">{notif.title}</td>
                    <td className="px-4 py-2 border">{notif.message}</td>
                    <td className="px-4 py-2 border">{new Date(notif.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No delivery information available.</p>
        )}
      </div>
    </div>
  );
}
