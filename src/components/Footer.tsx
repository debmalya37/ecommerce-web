import Link from "next/link";

// src/components/Footer.tsx
export default function Footer() {
    return (
      <footer className="bg-gray-900 text-white py-4 bottom-0 mb-0">
        <div className="container mx-auto px-4 text-center">
        <Link
            href="/terms-and-conditions"
            className="text-yellow-300 hover:underline mx-2"
          >
            Terms and Conditions
          </Link>
          <Link
            href="/privacy-policy"
            className="text-yellow-300 hover:underline mx-2"
          >
            Privacy Policy
          </Link>
          <Link
            href="/shipping-policy"
            className="text-yellow-300 hover:underline mx-2"
          >
            Shipping Policy
          </Link>
          <Link
            href="/refund-policy"
            className="text-yellow-300 hover:underline mx-2"
          >
            Refund Policy
          </Link>
          <p className="text-sm">
            &copy; 2025 HIURI ENTERPRISES. All rights reserved.
          </p>
          <p className="text-sm">
            Created by <span className="font-semibold">KRYPTAROID DIGITAL SOLUTIONS</span>
          </p>
        </div>
      </footer>
    );
  }
  