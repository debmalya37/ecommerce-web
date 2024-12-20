import Link from "next/link";

export default function ReturnPolicy() {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Return Policy</h1>
        <p className="text-gray-600 leading-7">
          We at Hiuri aim to ensure a seamless shopping experience. If you wish to return a product, please follow the guidelines below.
        </p>
        
        <h2 className="text-2xl font-semibold text-gray-800">Conditions for Returns</h2>
        <ul className="list-disc ml-6 text-gray-600 space-y-2">
          <li>Returns must be initiated within 15 days of delivery.</li>
          <li>The product must be unused, with all original packaging and tags intact.</li>
          <li>Digital or downloadable products are not eligible for returns.</li>
        </ul>
        
        <h2 className="text-2xl font-semibold text-gray-800">Return Process</h2>
        <p className="text-gray-600">
          To initiate a return, contact us at <a href="mailto:returns@yourstore.com" className="text-blue-600 hover:underline">returns@yourstore.com</a>. Once your return request is approved, we will provide instructions for shipping the product back to us.
        </p>
        
        <h2 className="text-2xl font-semibold text-gray-800">Refunds for Returned Items</h2>
        <p className="text-gray-600">
          Upon receipt and inspection of the returned item, we will process your refund within 7-10 business days. Refunds will be issued to the original payment method, including payments made via PhonePe.
        </p>
        
        <p className="text-gray-600">
          For PhonePe transactions, you can also refer to their <Link href="https://www.phonepe.com/terms-conditions" target="_blank" className="text-blue-600 hover:underline">terms and conditions</Link>.
        </p>
      </div>
    );
  }
  