"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";
import heroImg from "../../public/images/hero.jpg";

export default function HomePage() {
  const [categories, setCategories] = useState<any[]>([]);

  // Fetch categories from your API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="bg-blue-50 min-h-screen">
      {/* Hero Section */}
      <header className="relative bg-blue-600 text-white sm:h-[50vh] md:h-[80vh]">
        <div className="relative h-full">
          {/* Background Image */}
          <Image
            src={heroImg}
            alt="Hero Section Background"
            fill // Next.js 13+ uses fill instead of layout="fill"
            
            className="absolute inset-0 object-cover sm:object-contain md:object-cover"
            priority
          />
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          {/* Hero Content */}
          <div className="relative container mx-auto px-6 text-center z-10 h-full flex flex-col justify-center items-center">
            <div className="mt-auto mb-16 md:mb-12 lg:mb-20">
              <h1 className="text-4xl font-bold mb-4">
                Welcome to <span className="text-yellow-300">Hiuri</span>
              </h1>
              <p className="text-lg mb-6">
                Your one-stop shop for high-quality detergents, dishwashers, soaps, and more!
              </p>
              <Link
                href="/products"
                className="bg-yellow-400 hover:bg-yellow-500 text-blue-800 py-3 px-6 rounded-lg font-semibold shadow-md transition"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </header>

       {/* Categories Section */}
       <section className="py-8 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/products?category=${encodeURIComponent(cat.name)}`}
              >
                <span className="block bg-white rounded-lg shadow p-4 text-center hover:shadow-lg transition">
                  <p className="text-gray-800 font-semibold">{cat.name}</p>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section
      <section className="bg-blue-600 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Thousands of Happy Customers!</h2>
          <p className="text-lg mb-6">
            Discover the perfect cleaning solutions for your home at Hiuri.
          </p>
          <Link
            href="/products"
            className="bg-yellow-400 hover:bg-yellow-500 text-blue-800 py-3 px-6 rounded-lg font-semibold shadow-md transition"
          >
            Start Shopping
          </Link>
        </div>
      </section> */}

      

      {/* Call to Action Section (repeat) */}
      <section className="bg-blue-600 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Thousands of Happy Customers!</h2>
          <p className="text-lg mb-6">
            Discover the perfect cleaning solutions for your home at Hiuri.
          </p>
          <Link
            href="/products"
            className="bg-yellow-400 hover:bg-yellow-500 text-blue-800 py-3 px-6 rounded-lg font-semibold shadow-md transition"
          >
            Start Shopping
          </Link>
        </div>
      </section>

      {/* About Us Section */}
      <section className="bg-blue-200 py-12 rounded-md m-3">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">About Us</h2>
          <p className="text-lg text-gray-700 mb-6">
            HIURI ENTERPRISES, founded in 2023, is a fast-growing FMCG company dedicated to manufacturing high-quality cleaning products that simplify everyday life. Driven by innovation and a commitment to excellence, our products are designed to deliver superior cleanliness, safety, and satisfaction for households and businesses alike.
          </p>
          <p className="text-lg text-gray-700 mb-6">
            With sustainability at our core, we prioritize eco-friendly practices and carefully select ingredients that are effective yet gentle on the environment. Our mission is to set new standards in cleanliness while contributing to a healthier, greener future.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-700 text-white py-6">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; 2025 HIURI ENTERPRISES. All rights reserved.</p>
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
        </div>
      </footer>
    </div>
  );
}
