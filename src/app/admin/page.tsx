"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader"; // Your Loader component

export default function AdminPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [loadingData, setLoadingData] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [newNotificationTitle, setNewNotificationTitle] = useState("");
  const [newNotificationMessage, setNewNotificationMessage] = useState("");
  const [offlinePurchases, setOfflinePurchases] = useState<any[]>([]);
  // Add state for coin earning rate
const [coinRate, setCoinRate] = useState<number>(50);
const [newCoinRate, setNewCoinRate] = useState<number>(50);

  // Get the email from session, if available.
  const userEmail = session?.user?.email || "";

  // New state for offline purchase form
  const [offlinePurchaseForm, setOfflinePurchaseForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    amountPaid: "",
    dueAmount: "",
    dateOfPayment: "",
  });

  // Check if the current session user is allowed to access the admin page.
  useEffect(() => {
    if (status === "loading") return;
    const allowedEmails = [
      "debmalyasen37@gmail.com",
      "sunilchahal1995a@gmail.com",
      "tech@gmail.com",
    ];
    const isAllowed = allowedEmails.some(
      (email) => email.toLowerCase() === userEmail.toLowerCase()
    );
    if (!userEmail || !isAllowed) {
      router.push("/");
    }
  }, [router, userEmail, status]);

  // Fetch users, categories, and notifications on mount.
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchUsers(), fetchCategories(), fetchNotifications(), fetchOfflinePurchases()]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchCoinRate = async () => {
      try {
        const response = await axios.get("/api/coin-earning-rate");
        setCoinRate(response.data.rate);
        setNewCoinRate(response.data.rate);
      } catch (error) {
        console.error("Failed to fetch coin earning rate", error);
      }
    };
    fetchCoinRate();
  }, []);
  
  // Handler to update coin earning rate
  const handleUpdateCoinRate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/coin-earning-rate", { rate: newCoinRate });
      if (response.data.success) {
        setCoinRate(response.data.rate);
        alert("Coin earning rate updated successfully!");
      }
    } catch (error) {
      console.error("Error updating coin earning rate:", error);
      alert("Failed to update coin earning rate.");
    }
  };
  
  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/allUser");
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.get("/api/notifications");
      setNotifications(response.data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };
  const fetchOfflinePurchases = async () => {
    try {
      const response = await axios.get("/api/offline-purchases");
      setOfflinePurchases(response.data);
    } catch (error) {
      console.error("Failed to fetch offline purchases:", error);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    try {
      await axios.post("/api/categories", { name: newCategory });
      setNewCategory("");
      fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  // Delete a category by id
  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await axios.delete(`/api/categories/${categoryId}`);
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

   // Handle adding a new notification.
   const handleAddNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotificationTitle.trim() || !newNotificationMessage.trim()) return;
    try {
      await axios.post("/api/notifications", {
        title: newNotificationTitle,
        message: newNotificationMessage,
      });
      setNewNotificationTitle("");
      setNewNotificationMessage("");
      fetchNotifications();
    } catch (error) {
      console.error("Error adding notification:", error);
    }
  };
  // Offline purchase form handlers
  const handleOfflinePurchaseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOfflinePurchaseForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOfflinePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/offline-purchases", {
        ...offlinePurchaseForm,
        amountPaid: Number(offlinePurchaseForm.amountPaid),
        dueAmount: offlinePurchaseForm.dueAmount ? Number(offlinePurchaseForm.dueAmount) : 0,
        dateOfPayment: offlinePurchaseForm.dateOfPayment,
      });
      setOfflinePurchaseForm({
        name: "",
        email: "",
        phone: "",
        address: "",
        amountPaid: "",
        dueAmount: "",
        dateOfPayment: "",
      });
      fetchOfflinePurchases();
    } catch (error) {
      console.error("Error adding offline purchase:", error);
    }
  };

  const handleDeleteOfflinePurchase = async (id: string) => {
    try {
      await axios.delete(`/api/offline-purchases?id=${id}`);
      fetchOfflinePurchases();
    } catch (error) {
      console.error("Error deleting offline purchase:", error);
    }
  };


  // Handle deleting a notification by ID.
  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await axios.delete(`/api/notifications/${notificationId}`);
      fetchNotifications();
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };
  
  // Handle resetting wallet coins for a user.
  const handleResetCoins = async (email: string) => {
    try {
      const response = await axios.post("/api/reset-wallet-coins", { email });
      if (response.data.success) {
        // Update the user's wallet coins in local state.
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.email.toLowerCase() === email.toLowerCase()
              ? { ...user, wallet: { ...user.wallet, coins: 0 } }
              : user
          )
        );
      } else {
        console.error("Reset failed:", response.data.error);
      }
    } catch (error) {
      console.error("Error resetting wallet coins:", error);
    }
  };

  // Derive recentTransactions from the users array.
  const recentTransactions = users
    .flatMap((user: any) => {
      if (!user.transactions) return [];
      return user.transactions.map((txn: any) => ({
        transactionId: txn.transactionId,
        amount: txn.amount,
        products: txn.products, // Expecting an array of product names (or IDs)
        date: txn.date,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
      }));
    })
    .sort(
      (a: { date: string | number | Date }, b: { date: string | number | Date }) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

  if (loadingData) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
      <section className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-2xl font-bold mb-6 text-gray-800">Coin Earning Rate</h2>
    <p className="mb-4">Current Rate: For every ₹{coinRate} spent, you earn 1 coin.</p>
    <form onSubmit={handleUpdateCoinRate} className="flex flex-col gap-4">
      <input
      title="Coin Earning Rate"
        type="number"
        value={newCoinRate}
        onChange={(e) => setNewCoinRate(Number(e.target.value))}
        min="1"
        className="p-3 border rounded-md"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Update Rate
      </button>
    </form>
  </section>
        {/* Users Section */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Users Management</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Password</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Detergent (grams)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reset Coins</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{user.fullName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.password}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.address}, {user.state}, {user.pincode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.wallet?.coins || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleResetCoins(user.email)}
                        className="bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700"
                      >
                        Reset
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div>
          <Link
            href="/admin/products"
            className="ml-4 hover:underline p-4 bg-blue-800 text-white rounded-md"
          >
            Add Products/See Products
          </Link>
        </div>

        {/* Categories Section */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Categories Management</h2>
          <form onSubmit={handleAddCategory} className="flex gap-4 mb-6">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New category name"
              className="flex-1 p-2 border rounded-md"
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Add Category
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <div
                key={category._id}
                className="bg-gray-50 p-4 rounded-md flex items-center justify-between"
              >
                <span className="font-medium">{category.name}</span>
                <button
                  onClick={() => handleDeleteCategory(category._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Notifications Section */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Announcements</h2>
          <form onSubmit={handleAddNotification} className="flex flex-col gap-4 mb-6">
            <input
              type="text"
              value={newNotificationTitle}
              onChange={(e) => setNewNotificationTitle(e.target.value)}
              placeholder="Announcement Title"
              className="p-3 border rounded-md"
              required
            />
            <textarea
              value={newNotificationMessage}
              onChange={(e) => setNewNotificationMessage(e.target.value)}
              placeholder="Announcement Message"
              className="p-3 border rounded-md"
              required
            />
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
              Send Announcement
            </button>
          </form>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <tr key={notif._id}>
                      <td className="px-6 py-4 whitespace-nowrap">{notif.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{notif.message}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(notif.createdAt).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button onClick={() => handleDeleteNotification(notif._id)} className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap" colSpan={4}>No Announcement.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Offline Purchases</h2>
          <form onSubmit={handleAddOfflinePurchase} className="flex flex-col gap-4 mb-6">
            <input
              type="text"
              name="name"
              value={offlinePurchaseForm.name}
              onChange={handleOfflinePurchaseChange}
              placeholder="Name"
              className="p-3 border rounded-md"
              required
            />
            <input
              type="email"
              name="email"
              value={offlinePurchaseForm.email}
              onChange={handleOfflinePurchaseChange}
              placeholder="Email (optional)"
              className="p-3 border rounded-md"
            />
            <input
              type="text"
              name="phone"
              value={offlinePurchaseForm.phone}
              onChange={handleOfflinePurchaseChange}
              placeholder="Phone"
              className="p-3 border rounded-md"
              required
            />
            <input
              type="text"
              name="address"
              value={offlinePurchaseForm.address}
              onChange={handleOfflinePurchaseChange}
              placeholder="Address"
              className="p-3 border rounded-md"
              required
            />
            <input
              type="number"
              name="amountPaid"
              value={offlinePurchaseForm.amountPaid}
              onChange={handleOfflinePurchaseChange}
              placeholder="Amount Paid"
              className="p-3 border rounded-md"
              required
            />
            <input
              type="number"
              name="dueAmount"
              value={offlinePurchaseForm.dueAmount}
              onChange={handleOfflinePurchaseChange}
              placeholder="Due Amount (optional)"
              className="p-3 border rounded-md"
            />
            <input
            title="Date of Payment"
              type="date"
              name="dateOfPayment"
              value={offlinePurchaseForm.dateOfPayment}
              onChange={handleOfflinePurchaseChange}
              className="p-3 border rounded-md"
              required
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Add Offline Purchase
            </button>
          </form>
          {offlinePurchases.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2 border">Name</th>
                    <th className="px-4 py-2 border">Email</th>
                    <th className="px-4 py-2 border">Phone</th>
                    <th className="px-4 py-2 border">Address</th>
                    <th className="px-4 py-2 border">Amount Paid</th>
                    <th className="px-4 py-2 border">Due Amount</th>
                    <th className="px-4 py-2 border">Payment Date</th>
                    <th className="px-4 py-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {offlinePurchases.map((purchase) => (
                    <tr key={purchase._id}>
                      <td className="px-4 py-2 border">{purchase.name}</td>
                      <td className="px-4 py-2 border">{purchase.email || "-"}</td>
                      <td className="px-4 py-2 border">{purchase.phone}</td>
                      <td className="px-4 py-2 border">{purchase.address}</td>
                      <td className="px-4 py-2 border">₹{purchase.amountPaid}</td>
                      <td className="px-4 py-2 border">₹{purchase.dueAmount || 0}</td>
                      <td className="px-4 py-2 border">{new Date(purchase.dateOfPayment).toLocaleDateString()}</td>
                      <td className="px-4 py-2 border">
                        <button
                          onClick={() => handleDeleteOfflinePurchase(purchase._id)}
                          className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No offline purchases available.</p>
          )}
        </section>

        {/* Recent Transactions Section */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Recent Transactions</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount (₹)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Products</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((txn, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">{txn.transactionId}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{txn.fullName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{txn.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap">₹{txn.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(txn.date).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {Array.isArray(txn.products)
                          ? txn.products.join(", ")
                          : txn.products}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap" colSpan={6}>No recent transactions.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Cancelled Orders Section */}
<section className="bg-white rounded-lg shadow-md p-6 mt-8">
  <h2 className="text-2xl font-bold text-gray-800 mb-6">Cancelled Orders</h2>
  <table className="min-w-full border">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-4 py-2 border">User Name</th>
        <th className="px-4 py-2 border">Email</th>
        <th className="px-4 py-2 border">Order ID</th>
        <th className="px-4 py-2 border">Total Amount</th>
        <th className="px-4 py-2 border">Cancelled At</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-200">
  {users.flatMap((user) =>
    (user.orders || []).filter((order: any) => order.status === "Cancelled")
      .map((order: any) => (
        <tr key={order.orderId}>
          <td className="px-4 py-2 border">{user.fullName}</td>
          <td className="px-4 py-2 border">{user.email}</td>
          <td className="px-4 py-2 border">{order.orderId}</td>
          <td className="px-4 py-2 border">₹{order.totalAmount}</td>
          <td className="px-4 py-2 border">
            {order.cancelledAt ? new Date(order.cancelledAt).toLocaleString() : "N/A"}
          </td>
        </tr>
      ))
  )}
</tbody>

  </table>
</section>

      </div>
    </div>
  );
}
