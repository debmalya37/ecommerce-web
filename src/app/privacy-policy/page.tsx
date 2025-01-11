import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Privacy Policy</h1>
      <p className="text-gray-600 leading-7">
        Your privacy is important to us at <strong>Hiuri</strong>. This policy outlines how we collect, use, and protect your personal information. We comply with the guidelines issued by the Reserve Bank of India (RBI) to ensure transparency and data security.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800">1. Compliance with RBI Guidelines</h2>
      <p className="text-gray-600">
        In adherence to RBI regulations, we ensure that all data collected, processed, and stored by <strong>Hiuri</strong> is handled responsibly. This includes:
      </p>
      <ul className="list-disc ml-6 text-gray-600 space-y-2">
        <li>Ensuring secure transactions through verified payment gateways like PhonePe.</li>
        <li>Maintaining the confidentiality of personal and financial data.</li>
        <li>Providing users with clear policies on data collection, usage, and sharing.</li>
        <li>Offering transparent procedures for handling complaints and inquiries.</li>
      </ul>
      <p className="text-gray-600">
        For more details on our compliance measures, feel free to contact us using the information provided below.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800">2. Information We Collect</h2>
      <ul className="list-disc ml-6 text-gray-600 space-y-2">
        <li>Personal details such as name, email, and phone number when you create an account or place an order.</li>
        <li>Payment information when processing transactions.</li>
        <li>Browsing and interaction data collected through cookies.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800">3. How We Use Your Information</h2>
      <p className="text-gray-600">
        We use your information to process orders, provide customer support, and improve our services. We may also use your data for promotional purposes, with your consent.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800">4. Sharing of Information</h2>
      <p className="text-gray-600">
        Your data will not be shared with third parties except for:
      </p>
      <ul className="list-disc ml-6 text-gray-600 space-y-2">
        <li>Payment processing partners such as PhonePe.</li>
        <li>Logistics providers for order delivery.</li>
        <li>Legal obligations or regulatory compliance.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800">5. Data Security</h2>
      <p className="text-gray-600">
        We implement robust security measures to protect your personal information, including encryption for sensitive data and secure access protocols. However, no system is completely foolproof, and we encourage users to safeguard their login credentials.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800">6. Your Rights</h2>
      <p className="text-gray-600">
        As a user of <strong>Hiuri</strong>, you have the right to:
      </p>
      <ul className="list-disc ml-6 text-gray-600 space-y-2">
        <li>Access the personal data we have collected about you.</li>
        <li>Request corrections or updates to your data.</li>
        <li>Withdraw consent for promotional communications.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800">7. Contact Us</h2>
      <p className="text-gray-600">
        If you have any questions about our privacy practices or RBI compliance measures, please contact us at{" "}
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
