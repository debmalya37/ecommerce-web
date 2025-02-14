"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";


export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };




  // Load cart count from localStorage (summing the quantity of each item)
  useEffect(() => {
    const loadCartCount = () => {
      const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      const count = savedCart.reduce(
        (acc: number, item: any) => acc + (item.quantity || 1),
        0
      );
      setCartCount(count);
    };

    loadCartCount();
  }, []);


  return (
    <nav className="bg-blue-900 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link href="/">
          <span className="text-xl font-bold">HIURI</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link href="/products">
            <span className="hover:underline">Products</span>
          </Link>
          <Link href="/profile">
            <span className="hover:underline">Profile</span>
          </Link>
          {/* Cart Icon with Badge */}
          <Link href="/cart" className="relative">
            <FontAwesomeIcon icon={faShoppingCart} className="w-6 h-6 hover:underline" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
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
            <Link href="/cart" className="relative block px-2 py-1 hover:bg-blue-800 rounded">
              <svg
                className="w-6 h-6 inline"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 7.5M17 13l1.5 7.5M9 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
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
