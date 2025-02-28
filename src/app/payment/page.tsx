"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PaymentPage() {
  const [userDetails, setUserDetails] = useState<any>(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [walletUsed, setWalletUsed] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const [walletCoins, setWalletCoins] = useState(0);
  const [adjustedTotal, setAdjustedTotal] = useState(0);
  const router = useRouter();

  // Helper function to calculate delivery charge
  const getDeliveryCharge = (amount: number): number => {
    // return amount > 300 ? 10 : 13;
    return amount > 300 ? 0 : 0;
  };

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("userDetails") || "{}");
    setUserDetails(user);

    if (!user?.email) {
      // Redirect to login if no user details found in session
      router.push("/login");
      return;
    }

    // Fetch user wallet details (walletBalance, walletCoins)
    const fetchUserWalletDetails = async () => {
      try {
        const response = await axios.get(`/api/user?email=${user.email}`);
        if (response.data) {
          setWalletBalance(response.data.wallet.balance);
          setWalletCoins(response.data.wallet.coins);
        }
      } catch (error) {
        console.error("Failed to fetch user wallet details:", error);
      }
    };

    fetchUserWalletDetails();

    // Calculate total cart amount from source (cart or buy-now)
    const source = sessionStorage.getItem("source");
    let total = 0;
    if (source === "cart") {
      const cart = JSON.parse(sessionStorage.getItem("cart") || "[]");
      total = cart.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    } else if (source === "buy-now") {
      const product = JSON.parse(sessionStorage.getItem("selectedProduct") || "{}");
      total = product.price * product.quantity || 0;
    }

    // Calculate the delivery charge and add it to the total
    const delivery = getDeliveryCharge(total);
    setDeliveryCharge(delivery);
    const totalWithDelivery = total + delivery;
    const totalwithoutDelivery = total;
    setTotalAmount(totalwithoutDelivery);
    setAdjustedTotal(totalWithDelivery);
  }, [router]);

  useEffect(() => {
    // Adjust total after wallet deduction
    setAdjustedTotal(totalAmount - walletUsed + deliveryCharge);

  }, [walletUsed, totalAmount, deliveryCharge]);

  const handleWalletChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), walletBalance, totalAmount);
    setWalletUsed(value);
  };

  const handlePayment = async () => {
    // Remove any previous reward flag so that new payment is processed fresh
    sessionStorage.removeItem("rewardGiven");

    if (walletUsed > 0) {
      try {
        // Deduct wallet balance first
        const walletUpdateResponse = await axios.post("/api/updateWallet", {
          email: userDetails.email,
          amountUsed: walletUsed,
        });

        if (walletUpdateResponse.data.error) {
          console.error("Wallet update failed:", walletUpdateResponse.data.error);
          return;
        }

        setWalletBalance(walletUpdateResponse.data.newBalance); // Update UI with new balance
      } catch (error) {
        console.error("Failed to update wallet balance:", error);
        return;
      }
    }

    sessionStorage.setItem("originalTotal", totalAmount.toString());
    sessionStorage.setItem("walletUsed", walletUsed.toString());

    try {
      const response = await axios.post("/api/phonepe-payment", {
        amount: adjustedTotal,
        userDetails,
      });

      if (response.data.transactionId) {
        sessionStorage.setItem("transactionId", response.data.transactionId); // Store transaction ID in session
      }

      if (response.data.redirect) {
        window.location.href = response.data.redirect;
      } else {
        console.error("Redirect URL not returned");
      }
    } catch (error) {
      console.error("Payment initiation failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-600 text-white flex flex-col justify-center items-center">
      <div className="w-full max-w-md bg-white text-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold text-center mb-6 text-purple-700">
          Confirm Your Payment
        </h2>
        <div className="space-y-4">
          {/* Wallet Section */}
          <div className="bg-gray-100 p-4 rounded-md">
            <div className="flex justify-between items-center mb-2">
              {/* <span>Wallet Balance:</span>
              <span className="font-bold">₹{walletBalance}</span> */}
            </div>
            <div className="flex items-center gap-2">
              {/* <input
                type="number"
                value={walletUsed}
                onChange={handleWalletChange}
                className="w-24 px-2 py-1 border rounded-md"
                placeholder="Amount to use"
                min="0"
                max={Math.min(walletBalance, totalAmount)}
              /> */}
              {/* <button
                onClick={() => setWalletUsed(Math.min(walletBalance, totalAmount))}
                className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded-md hover:bg-blue-200"
              >
                Use Max
              </button> */}
            </div>
          </div>

          {/* User Details */}
          <p><strong>Full Name:</strong> {userDetails?.fullName}</p>
          <p><strong>Email:</strong> {userDetails?.email}</p>
          <p><strong>Phone:</strong> {userDetails?.phone}</p>

          {/* Price Details */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Original Total:</span>
              <span>₹{totalAmount}</span>
            </div>
            {/* <div className="flex justify-between">
              <span>Wallet Used:</span>
              <span>- ₹{walletUsed}</span>
            </div> */}
            <div className="flex justify-between">
              <span>Delivery Charge:</span>
              <span>₹{deliveryCharge}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Payable Amount:</span>
              <span>₹{adjustedTotal}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handlePayment}
          className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white py-3 px-6 rounded-lg font-semibold w-full mt-6 shadow-md transform hover:scale-105 transition duration-300"
        >
          Proceed to Payment (₹{adjustedTotal})
        </button>
      </div>
    </div>
  );
}
