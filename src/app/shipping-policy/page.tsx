import Link from "next/link";

export default function ShippingPolicy() {
    return (
        <div className="container mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Shipping Policy</h1>
            <p className="text-gray-600 leading-7">
                At Hiuri, we strive to ensure that your orders are delivered to you in a timely and efficient manner. Please review our shipping policy below for more details.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800">Shipping Process</h2>
            <p className="text-gray-600">
                Orders are shipped through registered domestic courier companies and/or speed post only. We ensure that:
            </p>
            <ul className="list-disc ml-6 text-gray-600 space-y-2">
                <li>Orders are shipped within 3 days from the date of order and/or payment.</li>
                <li>Delivery is made as per the agreed date at the time of order confirmation, subject to courier company or postal norms.</li>
            </ul>
            <p className="text-gray-600">
                Please note that Hiuri is not liable for any delays caused by the courier company or postal authority.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800">Delivery Address</h2>
            <p className="text-gray-600">
                Delivery of all orders will be made to the address provided by the buyer at the time of purchase. It is the buyer’s responsibility to ensure that the shipping address provided is accurate and accessible.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800">Order Confirmation</h2>
            <p className="text-gray-600">
                Once your order is shipped, delivery confirmation will be sent to your registered email ID. Please ensure your email address is correct at the time of registration to avoid delays in communication.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800">Shipping Costs</h2>
            <p className="text-gray-600">
                Any shipping costs levied by the seller or the Platform Owner (as applicable) are non-refundable.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800">Customer Support</h2>
            <p className="text-gray-600">
                For any questions or concerns regarding your shipment, please contact our support team at{" "}
                <a href="mailto:chahalh4@gmail.com" className="text-blue-600 hover:underline">
                    chahalh4@gmail.com
                </a>.
            </p>
        </div>
    );
}
