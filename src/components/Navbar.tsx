"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Load cart count from localStorage (summing the quantity of each item)
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const count = savedCart.reduce(
      (acc: number, item: any) => acc + (item.quantity || 1),
      0
    );
    setCartCount(count);
  }, []);

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="container mx-auto p-4 flex items-center justify-between">
        {/* Brand + Cart (mobile) */}
        <div className="flex items-center space-x-4">
          {/* Brand Name */}
          <Link href="/">
            <span className="text-xl font-bold">Hiuri</span>
          </Link>

          {/* Mobile Cart Icon (hidden on md and up) */}
          <Link
            href="/cart"
            className="relative md:hidden"
            title="View Cart (Mobile)"
          >
            <FontAwesomeIcon icon={faShoppingCart} className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          {session ? (
            <>
              <Link href="/products">
                <span className="hover:underline">Products</span>
              </Link>
              <Link href="/profile">
                <span className="hover:underline">Profile</span>
              </Link>
              {/* Cart Icon with Badge (desktop) */}
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
            </>
          ) : (
            <>
              <Link href="/products">
                <span className="hover:underline">Products</span>
              </Link>
              <Link href="/cart" className="relative">
                <FontAwesomeIcon icon={faShoppingCart} className="w-6 h-6 hover:underline" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link href="/login">
                <span className="hover:underline">Login</span>
              </Link>
              <Link href="/register">
                <span className="hover:underline">Sign Up</span>
              </Link>
            </>
          )}
        </div>

        {/* Hamburger Button (mobile) */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            {isOpen ? (
              // Close icon
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              // Hamburger icon
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-900">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {session ? (
              <>
                <Link href="/products">
                  <span className="block px-2 py-1 hover:bg-blue-800 rounded">
                    Products
                  </span>
                </Link>
                <Link href="/profile">
                  <span className="block px-2 py-1 hover:bg-blue-800 rounded">
                    Profile
                  </span>
                </Link>
                <Link href="/contact-us">
                  <span className="block px-2 py-1 hover:bg-blue-800 rounded">
                    Contact us
                  </span>
                </Link>
              </>
            ) : (
              <>
                <Link href="/products">
                  <span className="block px-2 py-1 hover:bg-blue-800 rounded">
                    Products
                  </span>
                </Link>
                <Link href="/contact-us">
                  <span className="block px-2 py-1 hover:bg-blue-800 rounded">
                    Contact us
                  </span>
                </Link>
                <Link href="/login">
                  <span className="block px-2 py-1 hover:bg-blue-800 rounded">
                    Login
                  </span>
                </Link>
                <Link href="/register">
                  <span className="block px-2 py-1 hover:bg-blue-800 rounded">
                    Sign Up
                  </span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
