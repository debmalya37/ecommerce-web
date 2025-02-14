"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const router = useRouter();

  // Fetch cart details from local storage when the component mounts
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);

    // Calculate total price from the cart items
    const totalAmount = savedCart.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    setTotal(totalAmount);
  }, []);

  // Handle checkout and pass the cart details to the payment page
  const handleCheckout = async () => {
    // Store cart and total amount in session storage for checkout
    sessionStorage.setItem("cart", JSON.stringify(cart));
    sessionStorage.setItem('source', 'cart'); 
    sessionStorage.setItem("total", total.toString());

    // Redirect to the payment page
    router.push("/userBillingDetails");
  };

  // Handle item removal from cart using the _id property
  const handleRemoveFromCart = (itemId: string) => {
    const updatedCart = cart.filter((item) => item._id !== itemId);
    setCart(updatedCart);

    // Update local storage after removing an item
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    // Recalculate total
    const updatedTotal = updatedCart.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    setTotal(updatedTotal);
    // Refresh the window to update the view
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className=" cart max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Shopping Cart</h2>
        {cart.length === 0 ? (
          <p className="text-center text-gray-600">Your cart is empty</p>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex flex-col md:flex-row justify-between items-center border p-4 rounded-md"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-600">Price: ₹{item.price}</p>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <button
                  onClick={() => handleRemoveFromCart(item._id)}
                  className="mt-2 md:mt-0 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-xl font-bold">Total: ₹{total.toFixed(2)}</p>
          <button
            onClick={handleCheckout}
            className="mt-4 sm:mt-0 bg-blue-900 text-white px-6 py-3 rounded-md hover:bg-green-600 transition"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
