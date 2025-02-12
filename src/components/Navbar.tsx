"use client";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-blue-900 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link href="/">
          <span className="text-xl font-bold">Hiuri</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <Link href="/products">
            <span className="hover:underline">Products</span>
          </Link>
          <Link href="/profile">
            <span className="hover:underline">Profile</span>
          </Link>
          <Link href="/cart">
            <span className="hover:underline">Cart</span>
          </Link>
          <Link href="/contact-us">
            <span className="hover:underline">Contact us</span>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            {isOpen ? (
              // Close icon
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Hamburger icon
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-900">
          <div className="px-4 pt-2 pb-4 space-y-1">
            <Link href="/products">
              <span className="block px-2 py-1 hover:bg-blue-800 rounded">Products</span>
            </Link>
            <Link href="/profile">
              <span className="block px-2 py-1 hover:bg-blue-800 rounded">Profile</span>
            </Link>
            <Link href="/cart">
              <span className="block px-2 py-1 hover:bg-blue-800 rounded">Cart</span>
            </Link>
            <Link href="/contact-us">
              <span className="block px-2 py-1 hover:bg-blue-800 rounded">Contact us</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
