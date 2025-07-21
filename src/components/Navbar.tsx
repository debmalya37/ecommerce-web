"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import LanguageToggle from "@/components/LanguageToggle";
import { motion, AnimatePresence } from "framer-motion";
import { faShoppingCart, faBagShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BsBellFill } from "react-icons/bs";
import { LuX } from "react-icons/lu";
import { Button } from "@mui/material";

export default function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  // load cart
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(saved.reduce((acc: number, i: any) => acc + (i.quantity || 1), 0));
  }, []);

  // load notifications
  useEffect(() => {
    axios
      .get("/api/notifications")
      .then(r => {
        setNotifications(r.data);
        setNotificationCount(r.data.length);
      })
      .catch(console.error);
  }, []);

  // Framer Motion variants
  const listVariants = { hover: { transition: { staggerChildren: 0.05 } } };
  const itemVariants = { rest: { y: 0 }, hover: { y: -4 } };

  // Build the menu items array
  const menuItems = [
    { label: "Products", href: "/products" },
    ...(session
      ? [
          { label: "Orders", href: "/profile/orders", icon: faBagShopping },
          { label: "Profile", href: "/profile" },
        ]
      : [
          { label: "Login", href: "/login" },
          { label: "Sign Up", href: "/register" },
        ]),
    { label: "Cart", href: "/cart", icon: faShoppingCart, badge: cartCount },
  ];

  return (
    <>
      <motion.nav
        className="fixed top-0 w-full z-50 backdrop-blur bg-white/60 shadow-lg"
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 120 }}
        whileHover={{ y: -2 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between h-16">
          {/* Brand + Language Toggle */}
          <div className="flex items-center space-x-4">
            <Link href="/">
              <motion.span
                className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500 cursor-pointer"
                whileTap={{ scale: 0.9 }}
              >
                Hiuri
              </motion.span>
            </Link>
            <LanguageToggle />
          </div>

          {/* Desktop Menu */}
          <motion.ul
            className="hidden md:flex space-x-8 items-center"
            variants={listVariants}
            initial="rest"
            whileHover="hover"
          >
            {menuItems.map((item, idx) => (
              <motion.li key={idx} variants={itemVariants} className="relative">
                <Link href={item.href!}>
                  <span className="flex items-center space-x-1 text-gray-800 hover:text-purple-600 transition">
                    {item.icon && <FontAwesomeIcon icon={item.icon} />}
                    <span className="font-medium">{item.label}</span>
                  </span>
                </Link>
                {item.badge! > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </motion.li>
            ))}

            {/* Notification Bell */}
            <motion.li variants={itemVariants} className="relative" whileHover={{ scale: 1.1 }}>
              <motion.div
                className="p-2 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowNotifications(true)}
              >
                <BsBellFill className="w-6 h-6 text-gray-800" />
              </motion.div>
              {notificationCount > 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                  initial={{ scale: 0.8, opacity: 0.7 }}
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.6, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  {notificationCount}
                </motion.span>
              )}
            </motion.li>

            {/* Contact Link */}
            <motion.li variants={itemVariants}>
              <Link href="/contact-us">
                <span className="text-gray-800 hover:text-purple-600 transition font-medium">
                  Contact
                </span>
              </Link>
            </motion.li>
          </motion.ul>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <Button onClick={() => setIsOpen(o => !o)} className="p-2">
              <svg
                className="w-6 h-6 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </Button>
          </div>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="md:hidden bg-white/90 backdrop-blur shadow-inner"
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
            >
              <ul className="flex flex-col p-4 space-y-2">
                {menuItems.map((it, i) => (
                  <li key={i}>
                    <Link href={it.href!}>
                      <a className="block px-3 py-2 rounded-lg hover:bg-purple-100 transition">
                        {it.label}
                      </a>
                    </Link>
                  </li>
                ))}
                <li>
                  <button
                    onClick={() => {
                      setShowNotifications(true);
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-purple-100 transition flex items-center"
                  >
                    <BsBellFill className="w-5 h-5 mr-2 text-gray-800" />
                    Notifications {notificationCount > 0 && `(${notificationCount})`}
                  </button>
                </li>
                <li>
                  <Link href="/contact-us">
                    <a className="block px-3 py-2 rounded-lg hover:bg-purple-100 transition">
                      Contact us
                    </a>
                  </Link>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Notification Popup */}
      <AnimatePresence>
  {showNotifications && (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl w-11/12 max-w-lg p-0 shadow-2xl overflow-hidden"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-600 to-blue-500 text-white p-4">
          <h2 className="text-2xl font-bold">Announcements</h2>
          <motion.button
            onClick={() => setShowNotifications(false)}
            className="absolute top-3 right-3 p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-40 transition"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <LuX className="w-6 h-6" />
          </motion.button>
          <div className="h-1 bg-white bg-opacity-50 mt-2 rounded-full" />
        </div>

        {/* Body */}
        <motion.div
          className="p-4 max-h-[70vh] overflow-y-auto space-y-3"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
          }}
          initial="hidden"
          animate="show"
          exit="hidden"
        >
          {notifications.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No announcements</p>
          ) : (
            notifications.map((n, i) => (
              <motion.div
                key={n._id}
                className="flex items-start space-x-3 bg-gray-50 hover:bg-gray-100 p-4 rounded-lg shadow-sm cursor-default"
                variants={{
                  hidden: { x: 50, opacity: 0 },
                  show: { x: 0, opacity: 1 }
                }}
                whileHover={{ y: -2, boxShadow: "0 6px 15px rgba(0,0,0,0.1)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {/* Accent bar */}
                <div className="w-1 bg-gradient-to-b from-purple-600 to-blue-500 rounded" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{n.title}</p>
                  <p className="text-gray-600 text-sm mt-1">{n.message}</p>
                  <p className="text-gray-400 text-xs mt-2">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

    </>
  );
}
