"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function PaymentPage() {
  const [userDetails, setUserDetails] = useState<any>(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [walletUsed, setWalletUsed] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const [walletCoins, setWalletCoins] = useState(0);
  const [adjustedTotal, setAdjustedTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [offers, setOffers] = useState<any[]>([]);
  const router = useRouter();

  // Helper: Calculate delivery charge (you can adjust this logic as needed)
  const getDeliveryCharge = (amount: number): number => (amount > 300 ? 0 : 0);

  // Fetch active offers
  useEffect(() => {
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
    fetchOffers();
  }, []);

  // Updated calculateDiscount function based on offers
  const calculateDiscount = (amount: number): number => {
    if (offers.length === 0) return 0;
    // Sort offers descending by cutoff
    const sortedOffers = [...offers].sort((a, b) => b.cutoff - a.cutoff);
    const applicableOffer = sortedOffers.find((offer) => amount >= offer.cutoff);
    return applicableOffer ? amount * (applicableOffer.discountPercentage / 100) : 0;
  };

  // Initial setup: fetch user details, wallet info, and calculate totals
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("userDetails") || "{}");
    setUserDetails(user);

    if (!user?.email) {
      router.push("/login");
      return;
    }

    // Fetch wallet details from your API
    // const fetchUserWalletDetails = async () => {
    //   try {
    //     const response = await axios.get(`/api/user?email=${user.email}`);
    //     if (response.data) {
    //       setWalletBalance(response.data.wallet.balance);
    //       setWalletCoins(response.data.wallet.coins);
    //     }
    //   } catch (error) {
    //     console.error("Failed to fetch user wallet details:", error);
    //   }
    // };
    // fetchUserWalletDetails();

    // Determine total amount from the selected source (cart or buy-now)
    const source = sessionStorage.getItem("source");
    let total = 0;
    if (source === "cart") {
      const cart = JSON.parse(sessionStorage.getItem("cart") || "[]");
      total = cart.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    } else if (source === "buy-now") {
      const product = JSON.parse(sessionStorage.getItem("selectedProduct") || "{}");
      total = product.price * product.quantity || 0;
    }

    const delivery = getDeliveryCharge(total);
    setDeliveryCharge(delivery);
    setTotalAmount(total);

    // Calculate discount based on offers
    const discountAmount = calculateDiscount(total);
    setDiscount(discountAmount);

    // Compute adjusted total: total - walletUsed + deliveryCharge - discount
    setAdjustedTotal(total - walletUsed + delivery - discountAmount);
  }, [router, offers, calculateDiscount, walletUsed]);

  // Update adjusted total when walletUsed, totalAmount, deliveryCharge, or offers change
  useEffect(() => {
    const discountAmount = calculateDiscount(totalAmount);
    setDiscount(discountAmount);
    setAdjustedTotal(totalAmount - walletUsed + deliveryCharge - discountAmount);
  }, [walletUsed, totalAmount, deliveryCharge, offers, calculateDiscount]);

  const handleWalletChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), walletBalance, totalAmount);
    setWalletUsed(value);
  };

  const handlePayment = async () => {
    sessionStorage.setItem("originalTotal", totalAmount.toString());
    sessionStorage.setItem("walletUsed", walletUsed.toString());

    if (walletUsed > 0) {
      try {
        const walletUpdateResponse = await axios.post("/api/updateWallet", {
          email: userDetails.email,
          amountUsed: walletUsed,
        });

        if (walletUpdateResponse.data.error) {
          console.error("Wallet update failed:", walletUpdateResponse.data.error);
          return;
        }
        setWalletBalance(walletUpdateResponse.data.newBalance);
      } catch (error) {
        console.error("Failed to update wallet balance:", error);
        return;
      }
    }

    try {
      const response = await axios.post("/api/phonepe-payment", {
        amount: adjustedTotal,
        userDetails,
      });

      if (response.data.transactionId) {
        sessionStorage.setItem("transactionId", response.data.transactionId);
      }

      if (response.data.redirect) {
        // Instead of window.location.href, open in a new tab / external browser
        window.open(response.data.redirect, "_blank", "noopener,noreferrer");
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
          {/* Wallet Section (optional input if you want users to use wallet funds) */}
          <div className="bg-gray-100 p-4 rounded-md">
            <div className="flex justify-between items-center mb-2">
              {/* Optionally display wallet balance */}
            </div>
            <div className="flex items-center gap-2">
              {/* Uncomment below to allow wallet usage input
              <input
                type="number"
                value={walletUsed}
                onChange={handleWalletChange}
                className="w-24 px-2 py-1 border rounded-md"
                placeholder="Amount to use"
                min="0"
                max={Math.min(walletBalance, totalAmount)}
              />
              <button
                onClick={() => setWalletUsed(Math.min(walletBalance, totalAmount))}
                className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded-md hover:bg-blue-200"
              >
                Use Max
              </button>
              */}
            </div>
          </div>

          {/* User Details */}
          <p>
            <strong>Full Name:</strong> {userDetails?.fullName}
          </p>
          <p>
            <strong>Email:</strong> {userDetails?.email}
          </p>
          <p>
            <strong>Phone:</strong> {userDetails?.phone}
          </p>

          {/* Price Details */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Original Total:</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charge:</span>
              <span>₹{deliveryCharge.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount:</span>
              <span>₹{discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Payable Amount:</span>
              <span>₹{adjustedTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handlePayment}
          className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white py-3 px-6 rounded-lg font-semibold w-full mt-6 shadow-md transform hover:scale-105 transition duration-300"
        >
          Proceed to Payment (₹{adjustedTotal.toFixed(2)})
        </button>
      </div>
    </div>
  );
}
