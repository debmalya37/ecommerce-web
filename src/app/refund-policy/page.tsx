import Link from "next/link";

export default function RefundPolicy() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Refund Policy</h1>
      <p className="text-gray-600 leading-7">
        At <strong>Hiuri</strong>, we prioritize customer satisfaction. If you are not completely satisfied with your purchase, we are here to help. This refund policy is designed to comply with the guidelines issued by the Reserve Bank of India (RBI) and ensure transparency in our refund process.
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
        <li>For payments made via PhonePe, the refund timeline will also depend on PhonePe's policies.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800">5. Customer Support</h2>
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

      <h2 className="text-2xl font-semibold text-gray-800">6. Payments via PhonePe</h2>
      <p className="text-gray-600">
        For refunds related to PhonePe transactions:
      </p>
      <ul className="list-disc ml-6 text-gray-600 space-y-2">
        <li>Refunds will be processed back to your PhonePe wallet or linked bank account, as applicable.</li>
        <li>If you face issues, you may contact PhonePe's support team directly or review their{" "}
          <Link
            href="https://www.phonepe.com/terms-conditions"
            target="_blank"
            className="text-blue-600 hover:underline"
          >
            terms and conditions
          </Link>.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800">7. Additional Notes</h2>
      <p className="text-gray-600">
        Please note that the refund timeline may vary depending on your payment method and the policies of third-party providers such as PhonePe or your bank. We will do our best to expedite the process and keep you informed at every step.
      </p>
    </div>
  );
}
