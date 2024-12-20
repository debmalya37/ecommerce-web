import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Privacy Policy</h1>
      <p className="text-gray-600 leading-7">
        Your privacy is important to us at Hiuri. This policy outlines how we collect, use, and protect your personal information.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800">Information We Collect</h2>
      <ul className="list-disc ml-6 text-gray-600 space-y-2">
        <li>Personal details such as name, email, and phone number when you create an account or place an order.</li>
        <li>Payment information when processing transactions.</li>
        <li>Browsing and interaction data collected through cookies.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800">How We Use Your Information</h2>
      <p className="text-gray-600">
        We use your information to process orders, provide customer support, and improve our services. We may also use your data for promotional purposes, with your consent.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800">Sharing of Information</h2>
      <p className="text-gray-600">Your data will not be shared with third parties except for:</p>
      <ul className="list-disc ml-6 text-gray-600 space-y-2">
        <li>Payment processing partners such as PhonePe.</li>
        <li>Logistics providers for order delivery.</li>
        <li>Legal obligations or regulatory compliance.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800">Contact Us</h2>
      <p className="text-gray-600">
        If you have any questions about our privacy practices, please contact us at{" "}
        <a
          href="mailto:privacy@hiuri.com"
          className="text-blue-600 hover:underline"
        >
          privacy@hiuri.com
        </a>
        .
      </p>

      <p className="text-gray-600">
        For PhonePe transactions, please refer to their{" "}
        <Link
          href="https://www.phonepe.com/privacy-policy"
          target="_blank"
          className="text-blue-600 hover:underline"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
