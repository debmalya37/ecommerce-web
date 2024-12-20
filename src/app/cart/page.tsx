"use client";
import { useCart } from '@/hooks/useCart';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cart, removeFromCart } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const router = useRouter();

  // Handle checkout and pass the cart details to the payment page
  const handleCheckout = async () => {
    // Store cart and total amount in the local storage or session storage
    sessionStorage.setItem('cart', JSON.stringify(cart));
    sessionStorage.setItem('total', total.toString());

    // Redirect to the payment page
    router.push('/userBillingDetails');
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Shopping Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        cart.map((item) => (
          <div key={item.id} className="border-b py-2">
            <p>{item.name} - ₹{item.price} x {item.quantity}</p>
            <button onClick={() => removeFromCart(item.id)} className="text-red-500">
              Remove
            </button>
          </div>
        ))
      )}
      <p className="font-bold">Total: ₹{total.toFixed(2)}</p>
      <button onClick={handleCheckout} className="bg-green-500 text-white py-2 px-4 mt-4">
        Checkout
      </button>
    </div>
  );
}
