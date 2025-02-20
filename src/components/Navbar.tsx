"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faBell } from "@fortawesome/free-solid-svg-icons";
import { useSession } from "next-auth/react";
import axios from "axios";

export default function Navbar() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

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

  // Fetch notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("/api/notifications");
        // Assume the API returns an array of notifications
        setNotifications(response.data);
        setNotificationCount(response.data.length);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <>
      <nav className="bg-gray-900 text-white shadow-md">
        <div className="container mx-auto p-4 flex items-center justify-between">
          {/* Mobile: Brand + Notification + (Cart shown next to brand) */}
          <div className="flex items-center space-x-4">
            {/* Brand Name */}
            <Link href="/">
              <span className="text-xl font-bold">Hiuri</span>
            </Link>

            {/* Mobile Notification Icon (only on mobile) */}
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative md:hidden"
              title="View Notifications"
            >
              <FontAwesomeIcon icon={faBell} className="w-6 h-6" />
              {notificationCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>

            {/* Mobile Cart Icon (only on mobile) */}
            <Link href="/cart" className="relative md:hidden" title="View Cart">
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
                {/* Notification Icon (desktop) */}
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative"
                  title="View Notifications"
                >
                  <FontAwesomeIcon icon={faBell} className="w-6 h-6 hover:underline" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                </button>
                {/* Cart Icon (desktop) */}
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
                <Link href="/contact-us">
                  <span className="hover:underline">Contact us</span>
                </Link>
              </>
            )}
          </div>

          {/* Hamburger Button (mobile) */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="focus:outline-none">
              {isOpen ? (
                // Close icon
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                // Hamburger icon
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
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

      {/* Notification Popup */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className="bg-white rounded-lg shadow-xl w-11/12 md:w-1/2 lg:w-1/3 p-6 relative"
            style={{ animation: "fadeIn 0.5s ease-out" }}
          >
            <button
              onClick={() => setShowNotifications(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              title="Close Notifications"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Announcements</h2>
            <div className="max-h-80 overflow-y-auto space-y-4">
              {notifications.length === 0 ? (
                <p>No Announcements</p>
              ) : (
                notifications.map((notif) => (
                  <div key={notif._id} className="border-b pb-2">
                    <p className="font-semibold text-gray-700">{notif.title}</p>
                    <p className="text-gray-600">{notif.message}</p>
                    <p className="text-xs text-gray-400">{new Date(notif.createdAt).toLocaleString()}</p>
                  </div>
                ))
              )}
            </div>
          </div>
          <style jsx global>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
