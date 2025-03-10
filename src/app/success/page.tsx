"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import axios from "axios";
import { useWallet } from "@/hooks/useWallet"; // Import the useWallet hook

export default function SuccessPage() {
  const [userDetails, setUserDetails] = useState<any>(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [products, setProducts] = useState<any[]>([]);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [walletEarned, setWalletEarned] = useState(0);
  const [coinRate, setCoinRate] = useState<number>(50); // Default coin rate: ₹50 per coin
  const { walletBalance } = useWallet(userDetails?.email);
  const router = useRouter();
  const [emailSent, setEmailSent] = useState(false);

  
  // Ref flag to ensure the order is posted only once
  const orderPostedRef = useRef(false);

  // Fetch coin earning rate from the API
  useEffect(() => {
    const fetchCoinRate = async () => {
      try {
        const response = await axios.get("/api/coin-earning-rate");
        setCoinRate(response.data.rate);
      } catch (error) {
        console.error("Failed to fetch coin earning rate", error);
      }
    };
    fetchCoinRate();
  }, []);

  // Retrieve user details, payment source, and compute totals
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("userDetails") || "{}");
    const source = sessionStorage.getItem("source");
    setUserDetails(user);

    let total = 0;
    let selectedProducts: any[] = [];

    if (source === "cart") {
      const cart = JSON.parse(sessionStorage.getItem("cart") || "[]");
      total = cart.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
      selectedProducts = cart;
    } else if (source === "buy-now") {
      const product = JSON.parse(sessionStorage.getItem("selectedProduct") || "{}");
      total = product.price * product.quantity || 0;
      selectedProducts = [product];
    }

    setTotalAmount(total);
    setProducts(selectedProducts);
    setPaymentStatus("Payment Successful!");
  }, []);

//   // Send confirmation email using your send-email API
// useEffect(() => {
//   const sendConfirmationEmail = async () => {
//     // If reward has already been given (stored in sessionStorage), skip sending email.
//     const rewardGiven = sessionStorage.getItem("rewardGiven");
//     if (rewardGiven === "true") return;

//     if (!userDetails?.email) return;
//     const transactionId = sessionStorage.getItem("transactionId");
//     if (!transactionId) return;
//     if (emailSent) return; // Ensure we send the email only once

//     const emailDetails = {
//       userDetails,
//       transactionId,
//       products,
//       totalAmount,
//     };

//     try {
//       const response = await axios.post("/api/send-email", emailDetails);
//       if (response.data.success) {
//         setEmailSent(true);
//       } else {
//         console.error("Failed to send email:", response.data.message);
//       }
//     } catch (error) {
//       console.error("Error sending email:", error);
//     }
//   };

//   sendConfirmationEmail();
// }, [userDetails, products, totalAmount, emailSent]);



  // Update wallet reward, add transaction record, push order details, and send confirmation email (only once)
useEffect(() => {
  const addTransactionAndOrderRecord = async () => {
    // Skip if order has already been posted
    if (orderPostedRef.current) return;

    const originalTotal = Number(sessionStorage.getItem("originalTotal"));
    const walletUsedValue = Number(sessionStorage.getItem("walletUsed") || "0");
    const transactionId = sessionStorage.getItem("transactionId");
    const rewardGiven = sessionStorage.getItem("rewardGiven");

    if (!transactionId) {
      console.log("No valid transactionId. Skipping update.");
      return;
    }
    if (rewardGiven) {
      console.log("Reward already given for this transaction. Skipping update.");
      return;
    }

    // Update wallet reward if applicable
    if (originalTotal) {
      const coinsEarned = Math.floor(originalTotal / coinRate);
      const netChange = coinsEarned - walletUsedValue;
      setWalletEarned(coinsEarned);
      try {
        const response = await fetch("/api/update-wallet", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userDetails?.email, walletChange: netChange, transactionId }),
        });
        const data = await response.json();
        if (data.success) {
          setWalletEarned(coinsEarned);
          // Do not set rewardGiven here since we haven't sent the email yet
        } else {
          console.error("Failed to update wallet:", data.message);
        }
      } catch (error) {
        console.error("Error updating wallet:", error);
      }
    }

    // Add transaction record
    const purchasedProducts = products.map((p) => p.name);
    const transactionData = {
      email: userDetails.email,
      transactionId,
      amount: totalAmount,
      products: purchasedProducts,
    };

    try {
      await axios.post("/api/add-transaction", transactionData);
    } catch (error) {
      console.error("Error adding transaction record:", error);
    }

    // Push the order details directly to the user's orders
    const orderData = {
      orderId: transactionId, // from your payment flow
      totalAmount,
      products: products.map((p) => ({
        productId: p._id, // ensure this is a valid ObjectId string
        name: p.name,
        quantity: p.quantity,
        price: p.price,
      })),
      status: "Placed",
      placedAt: new Date().toISOString(),
    };
    try {
      await axios.post("/api/orders", { email: userDetails.email, order: orderData });
      // Mark order as posted so that it won't post again
      orderPostedRef.current = true;
    } catch (error) {
      console.error("Error adding order record:", error);
    }

    // Send confirmation email if reward has not been given
    try {
      const emailDetails = {
        userDetails,
        transactionId,
        products,
        totalAmount,
      };
      const emailResponse = await axios.post("/api/send-email", emailDetails);
      if (emailResponse.data.success) {
        sessionStorage.setItem("rewardGiven", "true");
      } else {
        console.error("Failed to send email:", emailResponse.data.message);
      }
    } catch (error) {
      console.error("Error sending email:", error);
    }

    // Optionally clear sessionStorage if not coming from a valid payment URL
    if (typeof window !== "undefined") {
      const currentUrl = window.location.href;
      if (!currentUrl.includes("sltTkn=") && !currentUrl.includes("/api/status/")) {
        sessionStorage.removeItem("originalTotal");
        sessionStorage.removeItem("walletUsed");
        sessionStorage.removeItem("transactionId");
      }
    }
  };

  if (userDetails?.email) {
    addTransactionAndOrderRecord();
  }
}, [userDetails.email, products, totalAmount, coinRate, userDetails]);

  // PDF Download function
const handleDownloadInvoice = () => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Invoice", 14, 20);

  doc.setFontSize(12);
  doc.text(`Full Name: ${userDetails?.fullName}`, 14, 30);
  doc.text(`Email: ${userDetails?.email}`, 14, 40);
  doc.text(`Phone: ${userDetails?.phone}`, 14, 50);
  doc.text(`Address: ${userDetails?.address}`, 14, 60);
  doc.text(`Pincode: ${userDetails?.pincode}`, 14, 70);
  doc.text(`State: ${userDetails?.state}`, 14, 80);

  let yPosition = 90;
  doc.text("Purchased Items:", 14, yPosition);
  yPosition += 10;

  products.forEach((product: any) => {
    doc.text(
      `${product.name} - ₹${product.price} x ${product.quantity} = ₹${product.price * product.quantity}`,
      14,
      yPosition
    );
    yPosition += 10;
  });

  doc.text(`Total: ₹${totalAmount}`, 14, yPosition + 10);
  doc.save("invoice.pdf");
};

// PDF Print function
const handlePrintInvoice = () => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Invoice", 14, 20);

  doc.setFontSize(12);
  let yPosition = 30;
  doc.text(`Full Name: ${userDetails?.fullName}`, 14, yPosition);
  yPosition += 10;
  doc.text(`Email: ${userDetails?.email}`, 14, yPosition);
  yPosition += 10;
  doc.text(`Phone: ${userDetails?.phone}`, 14, yPosition);
  yPosition += 10;
  doc.text(`Address: ${userDetails?.address}`, 14, yPosition);
  yPosition += 10;
  doc.text(`Pincode: ${userDetails?.pincode}`, 14, yPosition);
  yPosition += 10;
  doc.text(`State: ${userDetails?.state}`, 14, yPosition);
  yPosition += 10;

  doc.text("Purchased Items:", 14, yPosition);
  yPosition += 10;

  products.forEach((product: any) => {
    doc.text(
      `${product.name} - ₹${product.price} x ${product.quantity} = ₹${product.price * product.quantity}`,
      14,
      yPosition
    );
    yPosition += 10;
  });

  doc.text(`Total: ₹${totalAmount}`, 14, yPosition + 10);
  doc.autoPrint();
  window.open(doc.output("bloburl"), "_blank");

  const walletUsedValue = Number(sessionStorage.getItem("walletUsed") || "0");
  if (walletUsedValue > 0) {
    yPosition += 10;
    doc.text(`Wallet Used: ₹${walletUsedValue}`, 14, yPosition);
  }
  yPosition += 10;
  doc.text(`Coins Earned: ₹${walletEarned}`, 14, yPosition);

  doc.save("invoice.pdf");
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 text-white flex flex-col justify-center items-center">
      <div className="w-full max-w-md bg-white text-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold text-center mb-6 text-purple-700">
          Payment Confirmation
        </h2>
        {paymentStatus && (
          <p className="text-green-600 text-xl font-semibold text-center mb-4">
            {paymentStatus}
          </p>
        )}
        {/* Wallet summary */}
        <div className="bg-purple-100 p-4 rounded-md mb-4">
          <div className="text-center">
            <p className="text-green-600 font-semibold">
              Earned Detergent (kg): {(walletEarned / 1000).toFixed(3)} kg ({walletEarned} gm)
            </p>
            <p className="text-sm text-gray-600 mt-1">
              (At the current coin rate: For every ₹{coinRate} spent, you earn 1 coin)
            </p>
          </div>
        </div>
        {/* User and purchase details */}
        <div className="space-y-4" id="invoice-content">
          <p><strong>Full Name:</strong> {userDetails?.fullName}</p>
          <p><strong>Email:</strong> {userDetails?.email}</p>
          <p><strong>Phone:</strong> {userDetails?.phone}</p>
          <p><strong>Address:</strong> {userDetails?.address}</p>
          <p><strong>Pincode:</strong> {userDetails?.pincode}</p>
          <p><strong>State:</strong> {userDetails?.state}</p>
          <p className="text-2xl font-bold text-purple-700 text-center">
            Total: ₹{totalAmount}
          </p>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Purchased Items</h3>
            <ul className="space-y-2">
              {products.map((product, index) => (
                <li key={index} className="border-b py-2">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-gray-600">₹{product.price} x {product.quantity}</p>
                  <p className="text-gray-500">Total: ₹{product.price * product.quantity}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Invoice buttons */}
        <div className="mt-6 flex space-x-4">
          <button
            onClick={handleDownloadInvoice}
            className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white py-3 px-6 rounded-lg font-semibold w-full shadow-md transform hover:scale-105 transition duration-300"
          >
            Download Invoice
          </button>
          <button
            onClick={handlePrintInvoice}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white py-3 px-6 rounded-lg font-semibold w-full shadow-md transform hover:scale-105 transition duration-300"
          >
            Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
