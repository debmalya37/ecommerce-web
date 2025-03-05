"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const router = useRouter();

  // Fetch cart details from local storage when the component mounts
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);

    // Calculate total price from the cart items
    const totalAmount = savedCart.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );
    setTotal(totalAmount);
  }, []);

  // Handle checkout and pass the cart details to the payment page
  const handleCheckout = async () => {
    sessionStorage.setItem("cart", JSON.stringify(cart));
    sessionStorage.setItem("source", "cart");
    sessionStorage.setItem("total", total.toString());
    router.push("/userBillingDetails");
  };

  // Handle item removal from cart using the _id property
  const handleRemoveFromCart = (itemId: string) => {
    const updatedCart = cart.filter((item) => item._id !== itemId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    const updatedTotal = updatedCart.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );
    setTotal(updatedTotal);
    window.location.reload();
  };

  return (
    <div className="bg-[#1F2A37] min-h-screen flex flex-col">
      <div className="container mx-auto py-8 px-4 flex-1">
        <div className="max-w-4xl mx-auto bg-[#2B3A4A] text-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-center mb-6">Your Shopping Cart</h2>
          {cart.length === 0 ? (
            <p className="text-center text-gray-300">Your cart is empty</p>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col md:flex-row justify-between items-center bg-[#1F2A37] rounded-md p-4 shadow transition hover:shadow-md"
                >
                  <div className="flex items-center">
                    <div className="w-16 h-16 flex-shrink-0 mr-4">
                    <img
                    src={item.imageUrl || "/images/placeholder.jpg"}
                    alt={item.name}
                    className="w-full h-full object-cover rounded"
                    onError={(e) => (e.currentTarget.src = "/images/placeholder.jpg")}
                  />

                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-300">
                        Price:{" "}
                        <span className="font-bold text-green-400">
                          ₹{item.price}
                        </span>
                      </p>
                      <p className="text-sm text-gray-300">
                        Quantity:{" "}
                        <span className="font-bold">{item.quantity}</span>
                      </p>
                    </div>
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => handleRemoveFromCart(item._id)}
                    className="mt-2 md:mt-0 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-semibold transition"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Cart total & Checkout */}
          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-xl font-bold">
              Total:{" "}
              <span className="text-green-400">₹{total.toFixed(2)}</span>
            </p>
            <button
              onClick={handleCheckout}
              className={`mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md transition ${
                cart.length === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={cart.length === 0}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
