"use client";
import Link from "next/link";
import { useState } from "react";

// Optional: You can import an icon library (e.g. Heroicons, FontAwesome) for the heart & star icons
// For demonstration, we use inline SVG placeholders here.

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  imageUrl: string;
  stock: number;
}

export default function ProductCard({
  id,
  name,
  price,
  originalPrice,
  imageUrl,
  stock,
}: ProductCardProps) {
  // Compute discount label (example: "Up to 15% off") or a dynamic label if you prefer
  const discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100);
  const discountLabel = discountPercent > 0 ? `Up to ${discountPercent}% off` : null;

  // Example star rating / review data (static or from props)
  const rating = 4.9;
  const totalReviews = 1233;
  

  return (
    <>
    <Link
          href={stock === 0 ? "#" : `/product/${id}`}>
    
    <div className="bg-[#e4ecf5] text-white rounded-lg shadow-sm shadow-gray-800 p-4 flex flex-col relative transition-transform hover:-translate-y-1 hover:shadow-2xl hover:scale-[1.01] hover:shadow-gray-800">
      {/* Top Row: Discount Badge & Heart Icon */}
      <div className="flex justify-between items-center mb-2">
        {discountLabel && (
          <span className="bg-blue-600 text-xs font-semibold px-2 py-1 rounded">
            {discountLabel}
          </span>
        )}
        {/* Heart / Wishlist Icon */}
        {/* Simple Heart Icon (SVG) */}
        {/* <button
          className="text-gray-300 hover:text-white transition"
          title="Add to wishlist"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="w-5 h-5"
            >
            <path d="M12 4.248c-3.148-5.376-12-3.733-12 2.944 0 4.696 6.627 10.777 12 15.808 5.373-5.031 12-11.112 12-15.808 0-6.677-8.852-8.32-12-2.944z" />
            </svg>
        </button> */}
      </div>

      {/* Product Image (aspect-square) */}
      <div className="relative w-full aspect-square bg-gray-200 rounded-md overflow-hidden flex items-center justify-center">
        <img
          src={imageUrl}
          alt={name}
          className="object-contain w-full h-full"
          onError={(e) => (e.currentTarget.src = "/images/placeholder.jpg")}
        />
        {stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-gray-900 font-bold">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Product Title & Rating */}
      <div className="mt-3">
        <h2 className="font-bold text-sm sm:text-base md:text-lg line-clamp-2 text-gray-800">
          {name}
        </h2>

        {/* Rating + (Reviews)
        <div className="flex items-center text-xs sm:text-sm mt-1">
          {/* Star Icons */}
           {/*  <div className="flex items-center space-x-0.5 text-yellow-400">
            {/* Example 5-star icons. Adjust based on rating if needed. */}
             {/* {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 16 16"
                className="w-4 h-4"
              >
                <path d="M8 .25a.75.75 0 0 1 .67.418l1.66 3.37 3.72.54a.75.75 0 0 1 .416 1.279l-2.69 2.62.63 3.67a.75.75 0 0 1-1.088.79L8 11.347l-3.326 1.75A.75.75 0 0 1 3.586 12.31l.63-3.67-2.69-2.62A.75.75 0 0 1 1.94 4.58l3.72-.54L7.32.668A.75.75 0 0 1 8 .25z" />
              </svg>
              ))}
              </div>
              {/* Rating number & total reviews 
              <span className="ml-2 text-gray-400">
              {rating.toFixed(1)} ({totalReviews.toLocaleString()})
              </span>
              </div> */}
      </div>

      {/* Some small badges: e.g. Best Seller, Best Price */}
      <div className="flex items-center space-x-2 mt-2 text-[10px] sm:text-xs text-gray-300">
        <span className="px-2 py-1 bg-gray-700 rounded">Best Seller</span>
        <span className="px-2 py-1 bg-gray-700 rounded">Best Price</span>
      </div>

      {/* Price Section */}
      <div className="mt-2">
        <div className="flex items-baseline space-x-2">
          <span className="text-xl font-bold text-green-600">
            ₹{price.toLocaleString()}
          </span>
          <span className="text-sm line-through text-gray-600">
            ₹{originalPrice.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Bottom Action: "Add to Cart" */}
      
    </div>
    </Link>
            </>
  );
}
