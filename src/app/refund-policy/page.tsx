import Link from "next/link";

export default function RefundPolicy() {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Refund Policy</h1>
        <p className="text-gray-600 leading-7">
          At Hiuri, we prioritize customer satisfaction. If you are not completely satisfied with your purchase, we are here to help. Please read our refund policy carefully.
        </p>
        
        <h2 className="text-2xl font-semibold text-gray-800">Eligibility for Refunds</h2>
        <ul className="list-disc ml-6 text-gray-600 space-y-2">
          <li>Items must be returned within 30 days of purchase.</li>
          <li>The item must be unused and in the same condition as when received.</li>
          <li>Proof of purchase, such as a receipt or order confirmation, is required.</li>
        </ul>
        
        <h2 className="text-2xl font-semibold text-gray-800">Non-Refundable Items</h2>
        <p className="text-gray-600">
          Certain items are exempt from refunds, such as perishable goods, customized items, and gift cards.
        </p>
        
        <h2 className="text-2xl font-semibold text-gray-800">Refund Process</h2>
        <p className="text-gray-600">
          Once we receive your returned item, we will inspect it and notify you of the status of your refund. Approved refunds will be processed to your original payment method within 7 business days.
        </p>
        
        <h2 className="text-2xl font-semibold text-gray-800">Contact Us</h2>
        <p className="text-gray-600">
          For any queries regarding refunds, please contact our support team at <a href="mailto:support@hiuri.com" className="text-blue-600 hover:underline">support@hiuri.com</a>.
        </p>
        
        <p className="text-gray-600">
          For payments processed via PhonePe, you can review their <Link href="https://www.phonepe.com/terms-conditions" target="_blank" className="text-blue-600 hover:underline">terms and conditions</Link> and reach out to their support team if needed.
        </p>
      </div>
    );
  }
  