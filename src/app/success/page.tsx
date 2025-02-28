"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import axios from "axios";
import { useWallet } from "@/hooks/useWallet";

export default function SuccessPage() {
  const [userDetails, setUserDetails] = useState<any>(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [products, setProducts] = useState<any[]>([]);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [walletEarned, setWalletEarned] = useState(0);
  const [coinRate, setCoinRate] = useState<number>(50); // Default to 50
  const { walletBalance } = useWallet(userDetails?.email);
  const router = useRouter();

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

  // First effect: retrieve user details, payment source, compute totals, etc.
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

  // Second effect: update wallet reward (if needed) and add transaction record
  useEffect(() => {
    const addTransactionRecord = async () => {
      const originalTotal = Number(sessionStorage.getItem("originalTotal"));
      const walletUsed = Number(sessionStorage.getItem("walletUsed") || "0");
      const transactionId = sessionStorage.getItem("transactionId");
      const rewardGiven = sessionStorage.getItem("rewardGiven");

      if (!transactionId) {
        console.log("No valid transactionId. Skipping transaction record update.");
        return;
      }
      if (rewardGiven) {
        console.log("Reward already given for this transaction. Skipping update.");
        return;
      }

      if (originalTotal) {
        // Use the fetched coin rate instead of hardcoded 50
        const coinsEarned = Math.floor(originalTotal / coinRate);
        const netChange = coinsEarned - walletUsed;
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
            sessionStorage.setItem("rewardGiven", "true");
          } else {
            console.error("Failed to update wallet:", data.message);
          }
        } catch (error) {
          console.error("Error updating wallet:", error);
        }
      }

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
      addTransactionRecord();
    }
  }, [userDetails?.email, products, totalAmount, coinRate]);


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
