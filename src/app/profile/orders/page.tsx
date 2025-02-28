// In your profile page component (e.g., app/profile/orders/page.tsx)
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "@/components/Loader";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Assuming your API returns the current user's orders from /api/user
        const response = await axios.get("/api/user");
        setOrders(response.data.orders || []);
        setEmail(response.data.email || "");
      } catch (err) {
        setError("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId: string, email: string) => {
    try {
      const response = await axios.post(`/api/orders/${orderId}/cancel`, { email });
      if (response.data.success) {
        alert(response.data.message);
        // Refetch orders after cancellation
        const res = await axios.get("/api/user");
        setOrders(res.data.orders || []);
      } else {
        alert(response.data.error);
      }
    } catch (err) {
      console.error("Error cancelling order:", err);
      alert("Failed to cancel order.");
    }
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">My Orders</h1>
      {orders.length === 0 ? (
        <p>You have no orders.</p>
      ) : (
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Order ID</th>
              <th className="px-4 py-2 border">Total Amount</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Placed At</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.orderId} className="divide-y divide-gray-200">
                <td className="px-4 py-2 border">{order.orderId}</td>
                <td className="px-4 py-2 border">₹{order.totalAmount}</td>
                <td className="px-4 py-2 border">{order.status}</td>
                <td className="px-4 py-2 border">{new Date(order.placedAt).toLocaleString()}</td>
                <td className="px-4 py-2 border">
                  {order.status === "Placed" || order.status === "Processing" ? (
                    <button
                      onClick={() => handleCancelOrder(order.orderId, email)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                    >
                      Cancel Order
                    </button>
                  ) : (
                    "N/A"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
