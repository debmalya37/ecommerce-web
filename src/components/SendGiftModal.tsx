// components/SendGiftModal.tsx
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
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [giftDescription, setGiftDescription] = useState("");

  // Fetch products when the modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchProducts = async () => {
        try {
          const response = await axios.get("/api/products");
          setProducts(response.data);
        } catch (error) {
          console.error("Failed to fetch products", error);
        }
      };
      fetchProducts();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) {
      alert("Please select a product for the gift.");
      return;
    }
    // Find the selected product details
    const selectedProduct = products.find(
      (prod) => prod._id === selectedProductId
    );
    // Combine the product title with the custom gift description
    const combinedGiftDetails = `Gift: ${selectedProduct?.name}\nDescription: ${giftDescription}`;
    try {
      const response = await axios.post("/api/gifts", {
        recipientEmail: recipient.email,
        recipientName: recipient.fullName,
        giftDetails: combinedGiftDetails,
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
              Select Product
            </label>
            <select
            title="products"
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">-- Select a product --</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </select>
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
