"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";

export default function SuccessPage() {
  const [userDetails, setUserDetails] = useState<any>(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [products, setProducts] = useState<any[]>([]);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    // Retrieve user details and source from session storage
    const user = JSON.parse(sessionStorage.getItem("userDetails") || "{}");
    const source = sessionStorage.getItem("source");

    setUserDetails(user);

    if (source === "cart") {
      // Compute total from cart and fetch cart products
      const cart = JSON.parse(sessionStorage.getItem("cart") || "[]");
      const total = cart.reduce(
        (sum: number, item: any) => sum + item.price * item.quantity,
        0
      );
      setTotalAmount(total);
      setProducts(cart); // Set products from cart
    } else if (source === "buy-now") {
      // Compute total from selected product and fetch product details
      const product = JSON.parse(sessionStorage.getItem("selectedProduct") || "{}");
      const total = product.price * product.quantity || 0;
      setTotalAmount(total);
      setProducts([product]); // Only the selected product
    }

    // Simulate successful payment processing
    setPaymentStatus("Payment Successful!");
  }, []);



  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("userDetails") || "{}");
    const source = sessionStorage.getItem("source");
  
    setUserDetails(user);
  
    let selectedProducts = [];
    let total = 0;
  
    if (source === "cart") {
      selectedProducts = JSON.parse(sessionStorage.getItem("cart") || "[]");
      total = selectedProducts.reduce(
        (sum: number, item: any) => sum + item.price * item.quantity,
        0
      );
    } else if (source === "buy-now") {
      const product = JSON.parse(sessionStorage.getItem("selectedProduct") || "{}");
      selectedProducts = [product];
      total = product.price * product.quantity || 0;
    }
  
    setProducts(selectedProducts);
    setTotalAmount(total);
  
    const emailDetails = {
      userDetails: user,
      transactionId: `TXN${Date.now()}`,
      products: selectedProducts,
      totalAmount: total,
    };
  
    // Send email using the API
    fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailDetails),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log("Email sent successfully!");
        } else {
          console.error("Failed to send email:", data.message);
        }
      })
      .catch((err) => {
        console.error("Error sending email:", err);
      });
  }, []);
  

  const handleDownloadInvoice = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Invoice", 14, 20);

    doc.setFontSize(12);
    doc.text(`Full Name: ${userDetails?.fullName}`, 14, 30);
    doc.text(`Email: ${userDetails?.email}`, 14, 40);
    doc.text(`Phone: ${userDetails?.phone}`, 14, 50);
    doc.text(`address: ${userDetails?.address}`, 14, 50);
    doc.text(`pincode: ${userDetails?.pincode}`, 14, 50);

    let yPosition = 60;
    doc.text("Purchased Items:", 14, yPosition);
    yPosition += 10;

    products.forEach((product: any, index: number) => {
      doc.text(
        `${product.name} - ₹${product.price} x ${product.quantity} = ₹${product.price * product.quantity}`,
        14,
        yPosition
      );
      yPosition += 10;
    });

    doc.text(`Total: ₹${totalAmount}`, 14, yPosition + 10);

    doc.save("invoice.pdf"); // Save as PDF
  };

  const handlePrintInvoice = () => {
    const doc = new jsPDF();
  
    doc.setFontSize(18);
    doc.text("Invoice", 14, 20);
  
    doc.setFontSize(12);
  
    let yPosition = 30; // Start from a higher yPosition
  
    // Display user details on separate lines
    doc.text(`Full Name: ${userDetails?.fullName}`, 14, yPosition);
    yPosition += 10; // Move to the next line
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
  
    // Display purchased items
    doc.text("Purchased Items:", 14, yPosition);
    yPosition += 10;
  
    products.forEach((product: any, index: number) => {
      doc.text(
        `${product.name} - ₹${product.price} x ${product.quantity} = ₹${product.price * product.quantity}`,
        14,
        yPosition
      );
      yPosition += 10;
    });
  
    doc.text(`Total: ₹${totalAmount}`, 14, yPosition + 10);
  
    doc.autoPrint(); // Auto print the PDF
    window.open(doc.output("bloburl"), "_blank");
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

        <div className="space-y-4" id="invoice-content">
          <p>
            <strong>Full Name:</strong> {userDetails?.fullName}
          </p>
          <p>
            <strong>Email:</strong> {userDetails?.email}
          </p>
          <p>
            <strong>Phone:</strong> {userDetails?.phone}
          </p>
          <p>
            <strong>Phone:</strong> {userDetails?.address}
          </p>
          <p>
            <strong>Phone:</strong> {userDetails?.pincode}
          </p>
          <p>
            <strong>Phone:</strong> {userDetails?.state}
          </p>
          <p className="text-2xl font-bold text-purple-700 text-center">
            Total: ₹{totalAmount}
          </p>

          {/* Displaying products based on payment source */}
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

        {/* Buttons for download and print invoice */}
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
