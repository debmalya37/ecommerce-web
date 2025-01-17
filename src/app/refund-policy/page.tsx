import Link from "next/link";

export default function RefundPolicy() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Refund Policy</h1>
      <p className="text-gray-600 leading-7">
        At <strong>Hiuri</strong>, we prioritize customer satisfaction. If you are not completely satisfied with your purchase, we are here to help. This refund policy is designed to comply with the guidelines issued by the Reserve Bank of India (RBI) and ensure transparency in our refund process.
      </p>
            <p className="text-gray-600 leading-7">
                We will notify you once we’ve received and inspected your return, and let you know if the refund was approved or not. If approved, you’ll be automatically refunded on your original payment method within 10 business days and credited in 4 to 5 days. Please remember it can take some time for your bank or credit card company to process and post the refund too.
            </p>
            <p className="text-gray-600">
                If more than 15 business days have passed since we’ve approved your return, please contact us at{" "}
                <a href="mailto:chahalh4@gmail.com" className="text-blue-600 hover:underline">
                    chahalh4@gmail.com
                </a>.
            </p>
      <h2 className="text-2xl font-semibold text-gray-800">1. Compliance with RBI Guidelines</h2>
      <p className="text-gray-600">
        In adherence to RBI regulations, we ensure:
      </p>
      <ul className="list-disc ml-6 text-gray-600 space-y-2">
        <li>Refund requests are processed promptly and transparently.</li>
        <li>Clear communication is maintained with customers throughout the refund process.</li>
        <li>Refunds are credited to the original payment method, as mandated by RBI.</li>
        <li>Support is available for payment-related queries, especially for PhonePe transactions.</li>
      </ul>
      <p className="text-gray-600">
        For payments made via PhonePe, additional terms may apply as outlined in their <Link href="https://www.phonepe.com/terms-conditions" target="_blank" className="text-blue-600 hover:underline">terms and conditions</Link>.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800">2. Eligibility for Refunds</h2>
      <ul className="list-disc ml-6 text-gray-600 space-y-2">
        <li>Items must be returned within 30 days of purchase.</li>
        <li>The item must be unused and in the same condition as when received.</li>
        <li>Proof of purchase, such as a receipt or order confirmation, is required.</li>
        <li>Refunds are applicable only for orders that meet our return and inspection criteria.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800">3. Non-Refundable Items</h2>
      <p className="text-gray-600">
        Certain items are exempt from refunds, including:
      </p>
      <ul className="list-disc ml-6 text-gray-600 space-y-2">
        <li>Perishable goods (e.g., food, flowers).</li>
        <li>Customized or personalized items.</li>
        <li>Gift cards or vouchers.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800">4. Refund Process</h2>
      <p className="text-gray-600">
        Once we receive your returned item, we will inspect it and notify you of the refund status. If approved:
      </p>
      <ul className="list-disc ml-6 text-gray-600 space-y-2">
        <li>Refunds will be processed to your original payment method (e.g., bank account, PhonePe wallet) within 7 business days.</li>
        <li>For payments made via PhonePe, the refund timeline will also depend on PhonePe&apos;s policies.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800">5. Refund and Cancellation Policy</h2>
      <p className="text-gray-600">
        This refund and cancellation policy outlines how you can cancel or seek a refund for a product or service that you have purchased through the Platform. Under this policy:
      </p>
      <ul className="list-disc ml-6 text-gray-600 space-y-2">
        <li>
          Cancellations will only be considered if the request is made within 30 days of placing the order. However, cancellation requests may not be entertained if the orders have been communicated to such sellers/merchants listed on the Platform and they have initiated the process of shipping them, or the product is out for delivery. In such an event, you may choose to reject the product at the doorstep.
        </li>
        <li>
          HIURI ENTERPRISES does not accept cancellation requests for perishable items like flowers, eatables, etc. However, the refund or replacement can be made if the user establishes that the quality of the product delivered is not good.
        </li>
        <li>
          In case of receipt of damaged or defective items, please report to our customer service team. The request would be entertained once the seller/merchant listed on the Platform has checked and determined the same at its own end. This should be reported within 30 days of receipt of products.
        </li>
        <li>
          If you feel that the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service within 30 days of receiving the product. The customer service team, after looking into your complaint, will take an appropriate decision.
        </li>
        <li>
          In case of complaints regarding products that come with a warranty from the manufacturers, please refer the issue to them.
        </li>
        <li>
          In case of any refunds approved by HIURI ENTERPRISES, it will take 7 days for the refund to be processed to you.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800">6. Customer Support</h2>
      <p className="text-gray-600">
        For any queries regarding refunds, please contact our support team at{" "}
        <a
          href="mailto:support@hiuri.com"
          className="text-blue-600 hover:underline"
        >
          support@hiuri.com
        </a>
        . Ensure you include your order ID and a brief description of your issue for faster resolution.
      </p>
    </div>
  );
}
