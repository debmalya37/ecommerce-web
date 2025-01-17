import Link from "next/link";

export default function ShippingPolicy() {
    return (
        <div className="container mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Shipping Policy</h1>
            <p className="text-gray-600 leading-7">
                At Hiuri, we strive to ensure that your orders are delivered to you in a timely and efficient manner. Please review our shipping policy below for more details.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800">Processing Time</h2>
            <p className="text-gray-600">
                All orders are delivered within 2-3 business days. Orders are not shipped or delivered on weekends or holidays. If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery. If there is a significant delay in the shipment of your order, we will contact you via email or phone.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800">Shipping Time</h2>
            <p className="text-gray-600">
                <strong>Domestic Shipping:</strong> Orders will be delivered within 3 to 4 weeks from the date of order confirmation. Please note that delivery times may be affected by factors beyond our control, such as weather conditions, customs delays, and other unforeseen circumstances.
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
