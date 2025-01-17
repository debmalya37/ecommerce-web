import Link from "next/link";

export default function RefundPolicy() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Return & Refund Policy</h1>
      <p className="text-gray-600 leading-7">
            We have a 30-day return policy, which means you have 30 days after receiving your item to request a return.

            </p>
            <p className="text-gray-600">
            To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You’ll also need the receipt or proof of purchase.
            </p>
            <p className="text-gray-600">
                To start a return, you can contact us at{" "}
                <a href="mailto:chahalh4@gmail.com" className="text-blue-600 hover:underline">
                    chahalh4@gmail.com
                </a>.
            </p>
            <p className="text-gray-600">
                If your return is accepted, we’ll send you a return shipping label, as well as instructions on how and where to send your package. Items sent back to us without first requesting a return will not be accepted.
            </p>
            <h2 className="text-2xl font-semibold text-gray-800">Customer Support</h2>
            <p className="text-gray-600">
                You can always contact us for any return questions at{" "}
                <a href="mailto:chahalh4@gmail.com" className="text-blue-600 hover:underline">
                    chahalh4@gmail.com
                </a>.
            </p>
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
      
    </div>
  );
}
