"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface SendGiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipient: { email: string; fullName: string };
  onGiftSent: () => void;
}

export default function SendGiftModal({
  isOpen,
  onClose,
  recipient,
  onGiftSent,
}: SendGiftModalProps) {
  const [giftDescription, setGiftDescription] = useState("");
  const [quantity, setQuantity] = useState<string>(""); // New input for quantity (grams)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quantity || isNaN(parseFloat(quantity)) || parseFloat(quantity) <= 0) {
      alert("Please enter a valid quantity (in grams).");
      return;
    }
    if (!giftDescription.trim()) {
      alert("Please enter gift description.");
      return;
    }
    // The product is static
    const staticProductName = "Derox Active Detergent Power";
    // Create combined gift details string
    const combinedGiftDetails = `Gift: ${staticProductName}\nQuantity: ${parseFloat(quantity).toFixed(
      2
    )} g\nDescription: ${giftDescription}`;
    try {
      const response = await axios.post("/api/gifts", {
        recipientEmail: recipient.email,
        recipientName: recipient.fullName,
        giftDetails: combinedGiftDetails,
        quantity: parseFloat(quantity), // Pass quantity as number (grams)
      });
      if (response.data.success) {
        alert("Gift sent successfully!");
        onGiftSent();
        onClose();
      } else {
        alert("Failed to send gift: " + response.data.error);
      }
    } catch (error) {
      console.error("Error sending gift:", error);
      alert("Error sending gift.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">
          Send Gift to {recipient.fullName}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">
              Quantity (in grams)
            </label>
            <input
              type="number"
              step="0.01"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity in grams"
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">
              Gift Description
            </label>
            <textarea
              value={giftDescription}
              onChange={(e) => setGiftDescription(e.target.value)}
              placeholder="Enter additional details about the gift..."
              className="w-full p-2 border rounded-md"
              rows={3}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Send Gift
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
