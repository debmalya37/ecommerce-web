// src/components/Navbar.tsx
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-blue-900 p-4 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Hiuri
        </Link>
        <div>
          <Link href="/products" className="ml-4 hover:underline">
            Products
          </Link>
          <Link href="/cart" className="ml-4 hover:underline">
            Cart
          </Link>
          <Link href="/contact-us" className="ml-4 hover:underline">
            Contact us
          </Link>
        </div>
      </div>
    </nav>
  );
}
