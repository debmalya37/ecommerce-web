"use client";
import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';


const SuccessPage = () => {
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    // Retrieve payment details from session storage or any other source
    const paymentData = JSON.parse(sessionStorage.getItem('paymentDetails') || '{}');
    setPaymentDetails(paymentData);
  }, []);

  const generateInvoice = () => {
    const doc = new jsPDF();

    // Invoice Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Invoice', 14, 22);
    doc.setFontSize(12);
    doc.text('Hiuri Enterprises', 14, 30);
    doc.text('Date: ' + new Date().toLocaleDateString(), 14, 38);
    doc.text('Transaction ID: ' + paymentDetails.transactionId, 14, 46);

    // User Details
    doc.setFont('helvetica', 'normal');
    doc.text('Name: ' + paymentDetails.userDetails?.fullName, 14, 54);
    doc.text('Email: ' + paymentDetails.userDetails?.email, 14, 62);
    doc.text('Phone: ' + paymentDetails.userDetails?.phone, 14, 70);

    // Product Details
    doc.text('Product Name: ' + paymentDetails.productDetails?.productName, 14, 78);
    doc.text('Price: ₹' + paymentDetails.productDetails?.productPrice, 14, 86);
    doc.text('Amount Paid: ₹' + paymentDetails.amountPaid, 14, 94);

    // Save PDF
    doc.save('invoice.pdf');
  };

  const printInvoice = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Invoice', 14, 22);
    doc.setFontSize(12);
    doc.text('Hiuri Enterprises', 14, 30);
    doc.text('Date: ' + new Date().toLocaleDateString(), 14, 38);
    doc.text('Transaction ID: ' + paymentDetails.transactionId, 14, 46);

    doc.setFont('helvetica', 'normal');
    doc.text('Name: ' + paymentDetails.userDetails?.fullName, 14, 54);
    doc.text('Email: ' + paymentDetails.userDetails?.email, 14, 62);
    doc.text('Phone: ' + paymentDetails.userDetails?.phone, 14, 70);
    doc.text('Product Name: ' + paymentDetails.productDetails?.productName, 14, 78);
    doc.text('Price: ₹' + paymentDetails.productDetails?.productPrice, 14, 86);
    doc.text('Amount Paid: ₹' + paymentDetails.amountPaid, 14, 94);

    doc.autoPrint();
    window.open(doc.output('bloburl'), '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 text-white flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-lg bg-white text-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold text-center mb-6 text-purple-700">Payment Successful</h2>
        <p className="text-lg mb-4 text-center">
          Thank you for your payment. Your transaction has been completed successfully.
        </p>

        <div className="space-y-4 mb-6">
          <p><strong>Name:</strong> {paymentDetails?.userDetails?.fullName}</p>
          <p><strong>Email:</strong> {paymentDetails?.userDetails?.email}</p>
          <p><strong>Phone:</strong> {paymentDetails?.userDetails?.phone}</p>
          <p className="text-2xl font-bold text-purple-700 text-center">
            Amount Paid: ₹{paymentDetails?.amountPaid}
          </p>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={generateInvoice}
            className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white py-3 px-6 rounded-lg font-semibold w-full max-w-xs shadow-md transform hover:scale-105 transition duration-300"
          >
            Download Invoice
          </button>
          <button
            onClick={printInvoice}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white py-3 px-6 rounded-lg font-semibold w-full max-w-xs shadow-md transform hover:scale-105 transition duration-300"
          >
            Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
