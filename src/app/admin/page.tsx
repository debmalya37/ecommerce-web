"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader"; // Your Loader component
import SendGiftModal from "@/components/SendGiftModal";
import { PiBroomLight } from "react-icons/pi";
import {
  FaSoap,
  FaBath,
  FaTshirt,
  FaBroom,
  FaWater,
  FaBoxOpen,
  FaRecycle,
  FaTruck,
  FaShoppingBag,
  FaStore,
} from "react-icons/fa";
import React from "react";

import { GiSoap } from "react-icons/gi";
import { FaJugDetergent } from "react-icons/fa6";
import { BsFillLampFill } from "react-icons/bs";

import { TbBrandTorchain } from "react-icons/tb";


export default function AdminPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<any[]>([]);
  const [orderedUsers, setorderedUsers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [loadingData, setLoadingData] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [newNotificationTitle, setNewNotificationTitle] = useState("");
  const [newNotificationMessage, setNewNotificationMessage] = useState("");
  const [offlinePurchases, setOfflinePurchases] = useState<any[]>([]);
    const [showOrderManagement, setShowOrderManagement] = useState(false);
  // Add state for coin earning rate
const [coinRate, setCoinRate] = useState<number>(50);
const [newCoinRate, setNewCoinRate] = useState<number>(50);
const [offers, setOffers] = useState([]);
const [newOffer, setNewOffer] = useState({ cutoff: 0, discountPercentage: 0, description: "" });
const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
const [giftRecipient, setGiftRecipient] = useState<{ email: string; fullName: string } | null>(null);
const [gifts, setGifts] = useState<any[]>([]);
const [newCategoryIcon, setNewCategoryIcon] = useState("");
const [newCategoryIconColor, setNewCategoryIconColor] = useState("#000000");
  const [newCategoryIconFile, setNewCategoryIconFile] = useState<string>("");
  const [categoryError, setCategoryError] = useState<string>("");

// List of available icon identifiers (statically defined)
const iconOptions = [
  "FaSoap",        // Detergent
  "GiSoap",        // Hand Soap
  "FaBath",        // Dishwasher/Toilet Cleaner alternative
  "FaBroom",       // Jhadu/Broom
  "FaWater",       // Water/Cleaning
  "FaBoxOpen",     // Packaging
  "FaRecycle",     // Recycling
  "FaTruck",       // Delivery
  "FaShoppingBag", // Shopping
  "FaStore",       // Store
  "FaJugDetergent",
  "PiBroomLight",
  "BsFillLampFill",
  "TbBrandTorchain",
];

// Mapping from icon identifier to the component
const iconMapping: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  FaSoap,
  GiSoap,
  FaBath,
  FaBroom,
  FaWater,
  FaBoxOpen,
  FaRecycle,
  FaTruck,
  FaShoppingBag,
  FaStore,
  FaJugDetergent,
  PiBroomLight,
  BsFillLampFill,
  TbBrandTorchain,
};



const fetchGifts = async () => {
  try {
    const response = await axios.get("/api/gifts");
    if (response.data.success) {
      setGifts(response.data.gifts);
    }
  } catch (error) {
    console.error("Failed to fetch gifts:", error);
  }
};

useEffect(() => {
  fetchGifts();
}, []);

// Function to cancel a gift (set its status to "Cancelled")
const handleCancelGift = async (giftId: string) => {
  try {
    const response = await axios.patch("/api/gifts", { giftId, status: "Cancelled" });
    if (response.data.success) {
      alert("Gift cancelled successfully!");
      fetchGifts(); // Refresh the gift list
    } else {
      alert("Failed to cancel gift: " + response.data.error);
    }
  } catch (error) {
    console.error("Error cancelling gift:", error);
    alert("Error cancelling gift.");
  }
};

const handleOpenGiftModal = (user: any) => {
  setGiftRecipient({ email: user.email, fullName: user.fullName });
  setIsGiftModalOpen(true);
};

const handleGiftSent = async () => {
  alert("Gift sent and recorded successfully!");
  // Optionally, refresh data that might be affected by sending a gift.
  await fetchUsers(); // For example, re-fetch the users list if their gift status is updated.
  await fetchGifts(); // Re-fetch the gifts list
};

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
      "debmalyasen15@gmail.com",
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
        await Promise.all([fetchUsers(), fetchCategories(), fetchNotifications(), fetchOfflinePurchases(),fetchGifts(),fetchOffers(),fetchAllOrders()]);
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

  const fetchOffers = async () => {
    try {
      const response = await axios.get("/api/offers");
      if (response.data.success) {
        setOffers(response.data.offers);
      }
    } catch (error) {
      console.error("Failed to fetch offers:", error);
    }
  };
  
  useEffect(() => {
    fetchOffers();
  }, []);

  useEffect(() => {
    if (status === "loading") return;
    // Add your admin check here if needed
    fetchAllOrders();
  }, [status]);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get("/api/allOrders");
      setorderedUsers(response.data); // response.data is the array of users + orders
    } catch (error) {
      console.error("Error fetching all orders:", error);
    } finally {
      setLoadingData(false);
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

  const handleIconFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCategoryIconFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    try {
      await axios.post("/api/categories", {
        name: newCategory,
        icon: newCategoryIcon,
        iconColor: newCategoryIconColor,
        iconFile: newCategoryIconFile, // Include file data if provided
      });
      setNewCategory("");
      setNewCategoryIcon("");
      setNewCategoryIconFile("");
      setNewCategoryIconColor("#000000");
      fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error);
      // If error response contains message, show it, otherwise a generic error message.
      setCategoryError((error as any).response?.data?.error || "Failed to add category try uploading pic with jpg, png, jpeg format with less size");
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

  const handleAddOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/offers", newOffer);
      if (response.data.success) {
        alert("Offer added successfully!");
        setNewOffer({ cutoff: 0, discountPercentage: 0, description: "" });
        fetchOffers();
      }
    } catch (error) {
      console.error("Failed to add offer:", error);
    }
  };
  

  // Admin page snippet for handling gift sending
const handleSendGift = async (user: any) => {
  const giftDetails = prompt(`Enter gift details for ${user.fullName}`);
  if (!giftDetails) return;
  const quantityStr = prompt(`Enter gift quantity in grams for ${user.fullName}`);
  const quantity = Number(quantityStr);
  if (!quantity || quantity <= 0) {
    alert("Please enter a valid quantity in grams.");
    return;
  }
  try {
    const response = await axios.post("/api/gifts", {
      recipientEmail: user.email,
      recipientName: user.fullName,
      giftDetails,
      quantity, // Send quantity
    });
    if (response.data.success) {
      alert("Congrats! Gift sent successfully!");
      fetchGifts(); // Refresh gift list
    } else {
      alert("Failed to send gift: " + response.data.error);
    }
  } catch (error) {
    console.error("Error sending gift:", error);
    alert("Error sending gift.");
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
   // Inside your AdminPage component
const handleStatusChange = async (orderId: string, newStatus: string) => {
  try {
    const response = await axios.patch("/api/orders/update", { orderId, newStatus });
    if (response.data.success) {
      alert("Order status updated successfully!");
      // Refresh the user list to update order statuses on the UI
      await fetchUsers();
      await fetchAllOrders();
    } else {
      alert("Failed to update order: " + response.data.error);
    }
  } catch (error) {
    console.error("Error updating order status:", error);
    alert("Error updating order status.");
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

    // Inside your AdminPage component before the return statement
const aggregatedCoins = offlinePurchases.reduce((acc, purchase) => {
  const email = purchase.email;
  if (email) {
    if (!acc[email]) {
      acc[email] = { name: purchase.name, totalCoins: 0, count: 0 };
    }
    acc[email].totalCoins += purchase.coinsEarned || 0;
    acc[email].count += 1;
  }
  return acc;
}, {} as Record<string, { name: string; totalCoins: number; count: number }>);

// Convert the object to an array for rendering
const aggregatedData = Object.keys(aggregatedCoins).map((email) => ({
  email,
  ...aggregatedCoins[email],
}));

  if (loadingData) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
      <section className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-2xl font-bold mb-6 text-gray-800">Detegent Earning Rate</h2>
    <p className="mb-4">Current Rate: For every ₹{coinRate} spent, you earn 1 Gram Detergent.</p>
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
  <button
    onClick={() => handleOpenGiftModal(user)}
    className="bg-purple-600 text-white px-3 py-1 rounded-md hover:bg-purple-700 ml-2"
  >
    Send Gift
  </button>
</td>


{isGiftModalOpen && giftRecipient && (
  <SendGiftModal
    isOpen={isGiftModalOpen}
    onClose={() => setIsGiftModalOpen(false)}
    recipient={giftRecipient}
    onGiftSent={handleGiftSent}
  />
)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6 mt-8">
  <h2 className="text-2xl font-bold text-gray-800 mb-6">Gifts Sent to Users</h2>
  <div className="overflow-x-auto">
    <table className="min-w-full border">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-2 border">Recipient Name</th>
          <th className="px-4 py-2 border">Recipient Email</th>
          <th className="px-4 py-2 border">Gift Details</th>
          <th className="px-4 py-2 border">Quantity (g)</th>
          <th className="px-4 py-2 border">Status</th>
          <th className="px-4 py-2 border">Sent On</th>
          <th className="px-4 py-2 border">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {gifts.map((gift: any) => (
          <tr key={gift._id}>
            <td className="px-4 py-2 border">{gift.recipientName}</td>
            <td className="px-4 py-2 border">{gift.recipientEmail}</td>
            <td className="px-4 py-2 border">
              <pre className="whitespace-pre-wrap">{gift.giftDetails}</pre>
            </td>
            <td className="px-4 py-2 border">{gift.quantity}</td>
            <td className="px-4 py-2 border">{gift.status}</td>
            <td className="px-4 py-2 border">{new Date(gift.createdAt).toLocaleString()}</td>
            <td className="px-4 py-2 border">
              {gift.status === "Sent" && (
                <button
                  onClick={() => handleCancelGift(gift._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs"
                >
                  Cancel Gift
                </button>
              )}
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

        <section className="bg-white rounded-lg shadow-md p-6 mt-8">
    <h2 className="text-2xl font-bold mb-6 text-gray-800">Offer Management</h2>
    <form onSubmit={handleAddOffer} className="flex flex-col gap-4 mb-6">
      <input
        type="number"
        placeholder="Cutoff Amount"
        value={newOffer.cutoff}
        onChange={(e) => setNewOffer({ ...newOffer, cutoff: Number(e.target.value) })}
        className="p-2 border rounded-md"
        required
      />
      <input
        type="number"
        placeholder="Discount Percentage"
        value={newOffer.discountPercentage}
        onChange={(e) => setNewOffer({ ...newOffer, discountPercentage: Number(e.target.value) })}
        className="p-2 border rounded-md"
        required
      />
      <input
        type="text"
        placeholder="Description (optional)"
        value={newOffer.description}
        onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
        className="p-2 border rounded-md"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
        Add Offer
      </button>
    </form>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 border">Cutoff Amount</th>
            <th className="px-4 py-2 border">Discount %</th>
            <th className="px-4 py-2 border">Description</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {offers.map((offer:any) => (
            <tr key={offer._id}>
              <td className="px-4 py-2 border">₹{offer.cutoff}</td>
              <td className="px-4 py-2 border">{offer.discountPercentage}%</td>
              <td className="px-4 py-2 border">{offer.description || "-"}</td>
              <td className="px-4 py-2 border">
                <button
                  onClick={async () => {
                    try {
                      await axios.delete(`/api/offers/${offer._id}`);
                      fetchOffers();
                    } catch (error) {
                      console.error("Failed to delete offer:", error);
                    }
                  }}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>

       
  <section className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Categories Management</h2>
      <form onSubmit={handleAddCategory} className="flex flex-col gap-4 mb-6">
        {/* Display error message if exists */}
      {categoryError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {categoryError}
        </div>
      )}
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category name"
          className="flex-1 p-2 border rounded-md"
          required
        />
        {/* File input for uploading icon image */}
        <input
        title="icon"
          type="file"
          accept="image/*"
          onChange={handleIconFileChange}
          className="flex-1 p-2 border rounded-md"
        />
        {/* Or manual icon URL input */}
        <input
          type="text"
          value={newCategoryIcon}
          onChange={(e) => setNewCategoryIcon(e.target.value)}
          placeholder="Category Icon URL (optional)"
          className="flex-1 p-2 border rounded-md"
        />
        <p className="text-sm font-medium">Or select an icon:</p>
        <div className="grid grid-cols-5 gap-2">
          {iconOptions.map((iconId) => {
            const IconComponent = iconMapping[iconId];
            return (
              <div
                key={iconId}
                className={`cursor-pointer p-1 border rounded-md ${newCategoryIcon === iconId ? "border-blue-500" : "border-transparent"}`}
                onClick={() => setNewCategoryIcon(iconId)}
              >
                <IconComponent className="w-10 h-10" style={{ color: newCategoryIconColor }} />
              </div>
            );
          })}
        </div>
        <p className="text-sm font-medium">Select icon color:</p>
        <input
          title="color"
          type="color"
          value={newCategoryIconColor}
          onChange={(e) => setNewCategoryIconColor(e.target.value)}
          className="w-16 h-10 p-0 border rounded-md"
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
            <div className="flex items-center gap-2">
              {category.icon ? (
                iconMapping[category.icon] ? (
                  // Render the static icon with the stored color
                  React.createElement(iconMapping[category.icon], {
                    className: "w-6 h-6",
                    style: { color: category.iconColor || "#000" },
                  })
                ) : (
                  <img
                    src={category.icon}
                    alt={category.name}
                    className="w-6 h-6 object-cover"
                  />
                )
              ) : (
                <span className="w-6 h-6 flex items-center justify-center text-sm text-gray-500">?</span>
              )}
              <span className="font-medium">{category.name}</span>
            </div>
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


       {/* Button to show Order Management view */}
<div className="mb-6">
  <button
    onClick={() => setShowOrderManagement(true)}
    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
  >
    Manage Orders
  </button>
</div>

{/* Modal for Order Management */}
{showOrderManagement && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-lg shadow-md p-6 max-w-5xl w-full overflow-auto max-h-[90vh]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
        <button
          onClick={() => setShowOrderManagement(false)}
          className="text-gray-600 hover:text-gray-800 text-2xl"
        >
          &times;
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 border">User Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Order ID</th>
              <th className="px-4 py-2 border">Product Names</th>
              <th className="px-4 py-2 border">Order Time</th>
              <th className="px-4 py-2 border">Total Amount</th>
              <th className="px-4 py-2 border">Current Status</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orderedUsers.flatMap((user) =>
              (user.orders || []).map((order: any) => (
                <tr key={order._id}>
                  <td className="px-4 py-2 border">{user.fullName}</td>
                  <td className="px-4 py-2 border">{user.email}</td>
                  <td className="px-4 py-2 border">{order.orderId}</td>
                  {/* Show product names joined by commas */}
                  <td className="px-4 py-2 border">
                    {order.products.map((p: any) => p.name).join(", ")}
                  </td>
                  {/* Format placedAt date/time */}
                  <td className="px-4 py-2 border">
                    {new Date(order.placedAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border">₹{order.totalAmount}</td>
                  <td className="px-4 py-2 border">{order.status}</td>
                  <td className="px-4 py-2 border">
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleStatusChange(order.orderId, "Cancelled")}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleStatusChange(order.orderId, "Shifted")}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-xs"
                      >
                        Shifted
                      </button>
                      <button
                        onClick={() => handleStatusChange(order.orderId, "Out for Delivery")}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-xs"
                      >
                        Out for Delivery
                      </button>
                      <button
                        onClick={() => handleStatusChange(order.orderId, "Delivered")}
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-xs"
                      >
                        Delivered
                      </button>
                      <button
                        onClick={() => handleStatusChange(order.orderId, "Refund")}
                        className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 text-xs"
                      >
                        Refund
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}


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
                {/* Inside the Offline Purchases table in your AdminPage */}
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Email</th>
                  <th className="px-4 py-2 border">Phone</th>
                  <th className="px-4 py-2 border">Address</th>
                  <th className="px-4 py-2 border">Amount Paid</th>
                  <th className="px-4 py-2 border">Due Amount</th>
                  <th className="px-4 py-2 border">Payment Date</th>
                  <th className="px-4 py-2 border">Coins Earned</th> {/* New column */}
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
                    <td className="px-4 py-2 border">{purchase.coinsEarned}</td> {/* Display coins earned */}
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

        {/* Offline Purchase Coins Earnings Section */}
<section className="bg-white rounded-lg shadow-md p-6 mt-8">
  <h2 className="text-2xl font-bold mb-6 text-gray-800">Offline Purchase Coins Earnings</h2>
  {aggregatedData.length > 0 ? (
    <div className="overflow-x-auto">
      <table className="min-w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">User Name</th>
            <th className="px-4 py-2 border">Total Coins Earned</th>
            <th className="px-4 py-2 border">Purchase Count</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {aggregatedData.map((data) => (
            <tr key={data.email}>
              <td className="px-4 py-2 border">{data.email}</td>
              <td className="px-4 py-2 border">{data.name}</td>
              <td className="px-4 py-2 border">{data.totalCoins}</td>
              <td className="px-4 py-2 border">{data.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <p>No offline purchase earnings data available.</p>
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
