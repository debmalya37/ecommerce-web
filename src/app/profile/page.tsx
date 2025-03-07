"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBagShopping } from "@fortawesome/free-solid-svg-icons";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [gifts, setGifts] = useState([]);

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


  // Fetch gifts for the user
useEffect(() => {
  const fetchGifts = async () => {
    try {
      const response = await axios.get(`/api/gifts?recipientEmail=${user.email}`);
      if (response.data.success) {
        setGifts(response.data.gifts);
      }
    } catch (err) {
      console.error("Failed to fetch gifts", err);
    }
  };
  if (user?.email) {
    fetchGifts();
  }
}, [user]);
  

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
      <div className="mt-auto flex items-center justify-center pt-3">
      <Link className="inline-flex items-center text-sm font-semibold px-4 py-2 rounded-md transition bg-pink-100 border-2 border-cyan-100 hover:bg-blue-900 hover:text-gray-200" href="/profile/orders">
                   <FontAwesomeIcon className="w-10 h-10 justify-center items-center flex" icon={faBagShopping} style={{color: "#f23184",}} />
                   
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
        {/* <div>
          <label className="block text-gray-700 font-semibold">Earned Detergent (kg)</label>
          <p className="bg-gray-100 p-3 rounded-md">
            {(user?.wallet?.coins / 1000).toFixed(3)} kg (Current Year)
          </p>
        </div> */}

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
  <h2 className="text-2xl font-bold text-gray-800 mb-4">Derox Active Detergent Powder Earning History</h2>
  {user && (() => {
    // 1. Build a map of year -> coins earned from walletHistory
    const yearsMap: Record<number, number> = {};

    // Add the archived years from user.walletHistory
    if (user.walletHistory && user.walletHistory.length > 0) {
      user.walletHistory.forEach((record: { year: number; coins: number }) => {
        yearsMap[record.year] = (yearsMap[record.year] || 0) + record.coins;
      });
    }

    // Add the current year’s coins (from user.wallet.coins)
    const currentYear = new Date().getFullYear();
    yearsMap[currentYear] = (yearsMap[currentYear] || 0) + (user.wallet?.coins || 0);

    // 2. Sort the years in ascending order
    const sortedYears = Object.keys(yearsMap).map(Number).sort((a, b) => a - b);

    // 3. We'll keep a running total as we move year by year
    let runningTotal = 0;

    return (
      <table className="min-w-full border text-center">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border">Year</th>
            <th className="px-4 py-2 border">Previous Year (kg)</th>
            <th className="px-4 py-2 border">Current Year (kg)</th>
            <th className="px-4 py-2 border">Gift (kg)</th>
            <th className="px-4 py-2 border">Total (kg)</th>
          </tr>
        </thead>
        <tbody>
          {sortedYears.map((year) => {
            // previousYearKg: total so far before adding this year's coins
            const previousYearKg = runningTotal / 1000;

            // coins for the current year
            const currentYearCoins = yearsMap[year];
            const currentYearKg = currentYearCoins / 1000;

            // In this example, we assume gift = current year's earning
            const giftKg = currentYearKg;

            // Update the running total after adding current year's coins
            runningTotal += currentYearCoins;
            const totalKg = runningTotal / 1000;

            return (
              <tr key={year}>
                <td className="px-4 py-2 border">{year}</td>
                <td className="px-4 py-2 border">
                  {previousYearKg.toFixed(3)}
                </td>
                <td className="px-4 py-2 border">
                  {/* {currentYearKg.toFixed(3)} */}
                  {(user?.wallet?.coins / 1000).toFixed(3)}
                </td>
                <td className="px-4 py-2 border">
                  {/* {giftKg.toFixed(3)} */}
                  0.200
                </td>
                <td className="px-4 py-2 border">
                  {/* {totalKg.toFixed(3)} */}
                  {/* {(currentYearKg + 0.2).toFixed(3)} */}
                  {((user?.wallet?.coins / 1000) + 0.2).toFixed(3)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  })()}
  <p className="mt-2 text-sm text-gray-600">
    At the start of each year, your current year&apos;s detergent earned is added to your history and your current detergent balance is reset.
  </p>
</div>



      {/* Gift Section */}
      {/* <div className="mt-6 p-4 bg-green-100 rounded-lg text-center">
        <h3 className="text-xl font-bold text-green-800">Your Gift for the Next Year</h3>
        <p className="text-gray-700 mt-2">
          As a token of our appreciation, you will receive a special gift every year based on your detergent earnings.
          Keep shopping for more Gift!
        </p>
      </div>
                                <div className="mt-6 p-4 bg-green-100 rounded-lg text-center">
                            <h3 className="text-xl font-bold text-green-800">Gifts Recievables</h3>
                            {gifts.length > 0 ? (
                              <div className="mt-2">
                                {gifts.map((gift: any) => (
                                  <div key={gift._id} className="border p-2 rounded mb-2 text-left">
                                    <p className="font-semibold">Gift Details:</p>
                                    <pre className="whitespace-pre-wrap">{gift.giftDetails}</pre>
                                    <p>Status: {gift.status}</p>
                                    <p>Sent on: {new Date(gift.createdAt).toLocaleString()}</p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-700 mt-2">No gifts received yet.</p>
                            )}
                          </div> */}


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
