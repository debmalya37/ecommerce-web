"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [newCategory, setNewCategory] = useState("");

  // Get the email from session, if available.
  const userEmail = session?.user?.email || "";

  // Check if the current session user is allowed to access the admin page.
  useEffect(() => {
    // Wait until the session is loaded
    if (status === "loading") return;

    const allowedEmails = [
      "debmalyasen37@gmail.com",
      "sunilchahal1995a@gmail.com",
      "tech@gmail.com",
    ];

    // Do a case-insensitive comparison
    const isAllowed = allowedEmails.some(
      (email) => email.toLowerCase() === userEmail.toLowerCase()
    );

    if (!userEmail || !isAllowed) {
      // If the user is not allowed, redirect to the homepage.
      router.push("/");
    }
  }, [router, userEmail, status]);

  // Fetch users and categories on mount
  useEffect(() => {
    fetchUsers();
    fetchCategories();
  }, []);

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

  // Derive recentTransactions from the users array
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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Users Section */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Users Management
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Wallet Balance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Coins
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.fullName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.address}, {user.state}, {user.pincode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ₹{user.wallet?.balance || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.wallet?.coins || 0}
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
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Categories Management
          </h2>
          <form onSubmit={handleAddCategory} className="flex gap-4 mb-6">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New category name"
              className="flex-1 p-2 border rounded-md"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
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

        {/* Recent Transactions Section */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Recent Transactions
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Transaction ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    User Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount (₹)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Products
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((txn, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {txn.transactionId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {txn.fullName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {txn.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ₹{txn.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(txn.date).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {Array.isArray(txn.products)
                          ? txn.products.join(", ")
                          : txn.products}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap" colSpan={6}>
                      No recent transactions.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
