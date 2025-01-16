import Link from "next/link";

export default function ReturnPolicy() {
    return (
        <div className="container mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Return Policy</h1>
            <p className="text-gray-600 leading-7">
                We at Hiuri aim to ensure a seamless shopping experience. If you wish to return a product, please follow the guidelines below.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800">Return Policy</h2>
            <p className="text-gray-600">
            We offer refund / exchange within first 7 days from the date of your purchase. If 7 days have passed since your purchase, you will not be offered a return, exchange or refund of any kind. 
            </p>
            <p className="text-gray-600">
                In order to become eligible for a return or an exchange:
            </p>
            <ul className="list-disc ml-6 text-gray-600 space-y-2">
                <li>The purchased item should be unused and in the same condition as you received it.</li>
                <li>The item must have original packaging.</li>
                <li>If the item that you purchased was on sale, it may not be eligible for a return/exchange.</li>
            </ul>
            <p className="text-gray-600">
                Further, only such items are replaced by us (based on an exchange request) if such items are found defective or damaged.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800">Exempted Items</h2>
            <p className="text-gray-600">
                You agree that there may be a certain category of products/items that are exempted from returns or refunds. Such categories of products would be identified to you at the time of purchase.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800">Return Process</h2>
            <p className="text-gray-600">
                For exchange/return accepted request(s) (as applicable), once your returned product/item is received and inspected by us, we will send you an email to notify you about the receipt of the returned/exchanged product. Further, if the same has been approved after the quality check at our end, your request (i.e., return/exchange) will be processed in accordance with our policies.
            </p>
            <p className="text-gray-600">
                To initiate a return, contact us at <a href="mailto:chahalh4@gmail.com" className="text-blue-600 hover:underline">chahalh4@gmail.com</a>. Once your return request is approved, we will provide instructions for shipping the product back to us.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800">Refunds for Returned Items</h2>
            <p className="text-gray-600">
                Upon receipt and inspection of the returned item, we will process your refund within 7 business days. Refunds will be issued to the original payment method, including payments made via PhonePe.
            </p>
            <p className="text-gray-600">
                For PhonePe transactions, you can also refer to their <Link href="https://www.phonepe.com/terms-conditions" target="_blank" className="text-blue-600 hover:underline">terms and conditions</Link>.
            </p>
        </div>
    );
}
