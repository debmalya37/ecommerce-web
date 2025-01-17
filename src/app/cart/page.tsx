"use client";
import { useCart } from '@/hooks/useCart';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cart, removeFromCart } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const router = useRouter();

  // Handle checkout and pass the cart details to the payment page
  const handleCheckout = async () => {
    // Store cart and total amount in session storage
    sessionStorage.setItem('cart', JSON.stringify(cart));
    sessionStorage.setItem('source', 'cart'); // Mark source as cart
    sessionStorage.setItem('total', total.toString());

    // Redirect to the billing details page
    router.push('/userBillingDetails');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-500 p-6 text-white">
      <div className="max-w-3xl mx-auto bg-white text-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold text-center mb-6 text-teal-700">
          Shopping Cart
        </h2>
        {cart.length === 0 ? (
          <p className="text-center text-gray-500">Your cart is empty</p>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-gray-100 p-4 rounded-md shadow-sm"
              >
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    ₹{item.price} x {item.quantity}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="mt-6">
          <p className="text-lg font-bold text-center text-gray-800">
            Total: ₹{total.toFixed(2)}
          </p>
          <button
            onClick={handleCheckout}
            className="bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600 text-white py-3 px-6 rounded-lg font-semibold w-full mt-6 shadow-md transform hover:scale-105 transition duration-300"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
