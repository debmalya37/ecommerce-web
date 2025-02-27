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
    <div className="bg-[#1F2A37] text-white rounded-lg shadow-md p-4 flex flex-col relative transition-transform hover:-translate-y-1 hover:shadow-xl hover:scale-[1.01]">
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
      <div className="relative w-full aspect-square bg-gray-800 rounded-md overflow-hidden flex items-center justify-center">
        <img
          src={imageUrl}
          alt={name}
          className="object-contain w-full h-full"
          onError={(e) => (e.currentTarget.src = "/images/placeholder.jpg")}
        />
        {stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Product Title & Rating */}
      <div className="mt-3">
        <h2 className="font-bold text-sm sm:text-base md:text-lg line-clamp-2">
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
          <span className="text-xl font-bold text-white">
            ₹{price.toLocaleString()}
          </span>
          <span className="text-sm line-through text-gray-400">
            ₹{originalPrice.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Bottom Action: "Add to Cart" */}
      <div className="mt-auto flex items-center justify-between pt-3">
        <Link
          href={stock === 0 ? "#" : `/product/${id}`}
          className={`inline-flex items-center text-sm font-semibold px-4 py-2 rounded-md transition ${
            stock === 0
              ? "bg-gray-600 cursor-not-allowed text-gray-300"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {stock === 0 ? (
            "Unavailable"
          ) : (
            <>
              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-5 h-5 mr-2"
              >
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 7.5M17 13l1.5 7.5M9 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z" />
              </svg> */}
              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGK0lEQVR4nO2Za1BTRxTHaWda22k/2H5pp/1qv/hB+5jRtkNHO1aLrRV8UEChLSCYgMDwMoAIGiCEIIrAKKQdSyNYRhzFURCpigrcC4JVwPrAAg1mb3jsQnwrkJ7OXrlpgITcxACdTs7Mf3Zzc+9mf3fP7jm7cXNzmctc5jKX/R+N6el5tQHrgliCDjMYdTGEe8gQ9IAl3E2GoHJ2kPOv7et73e2/agDwAjvISRnMDbCEg6nEEKSn9wLAi7PSWV939wXh3p6qoK+Wh3nPn/+ycP2qXv8ag9FJWwAWdGzGR0e6ZnVgmTpff3foDnRcazLGBPjWe8ybN6cKOuYwmLvoAMQzYXS+BeClGQPJiI24bBwdAkG32hqNGz9fcm5PWjLZt1sJRcU/OgZCeFcrmNbOh3mvCsiMj2rPSoi5mrczkTMHGR0ZhM4bLUbh89mqo1B+vsYxEIyMTD/60OkASxYunBvqtSo5JymuQ+io9nYrXLpQDX3olgnGXF03L0NiZBjU/tXh6MgcdTrEdummdqHDBqKFM8fLoLmu2iIA1R9X6qH71hUeUrVjG9RqbzsC8pguGk4DkXh+s12AoCPQUn8aRoeJVYiJos8WFqsdnCuch9NAqEsJIEJZui8Htm70AnnoBptK3eQDMv81kBziJ0rRfl6g2qXgQRoJF+pU10qWbmrv1f07FzS5Cmg/kg2PWkqcrvYj2ZCtShNWryOMoedNp8GoTx5+v6hYPZKVmQZU0d/5zggIy8cVbpAlOh+ngDAY5Zj7Lv2hGQMh/HL8N01hnADCXZ1NEPZZxB9hsX6xYwCE82AwqqQByrzRvMJ8YH7eOS0gDQfkkFeUbyVQchftzlxpmmBtWazpaAep5wq4VJLBv0FnqelgOkhXr+Dbt7os9995TzQIO4gSzB/ufGCY1OCOZBmkBHiCPHCtTcWu/3LStfCVSyHyk49h86JFsMVjKX9tO20vNclGUqn/QRREnUH7xtjGB7QP7wF6fJ8vJzaoVMrhYGoYnN2fbFPywHWTrmX4e0GnuydULV4O6X6e/DVNqhRU2Rm28rBEMS619d7w0+O084JaDf38iLTdHeA/09IcJEviO6mTpfIIUMZIoWCHjFf+WJmbFA1FCZtNIHlLlkGW+1JQ2ANCOImoEel/8ugU7ax5583VZhgPYult740Jhs6bzWAcHRynIdwNyvDv+XuKYoOgIjMaKpQxUBgbKBqkYUC3TBQIg9EW4SHqUsIIWHMtSyA1BUlQIJOCMiJonPbEhkBlrsyqC2psgqA+0ZuuxgHuIzEJ3USQM/uSoTwzalJdrKiLaqYAaTUMgO7xfR0AJAHAAlEwLObq7QXZG+kP6xZ9AKfzE8fVn4Ftsxuk1TDAe4S5uh4Y4Po9XAoA4qI8XasZzGF7QDJDfSD4i8/gUFrEuDr9Lj14vahR0UwYEQpD5yotqSiI9uFd41PjSAYAyMa0wCbMVCNjaY6IqT+Pa3UJ8UxsLDE3unemCwBDuBpbIIXxQRbrU4GUKaIgJz4cchJjQL7ZH1SqdJvzkwZsu0FMQBhFWAKhbnMidysoQrwnSS0LtgmyKz7ctM9pbz4PERt9YP8eJeRkpUO9XmsluusCHQZhMbfWvDG6i/slRQIHqTtI/OC3KSa0JRC6POenxENV2c/jtsYjw5gvezrbQF1ywAIEGmFwz7uOg/T2vmWeBWtOHgOFZAPfKcHFUgK8LEr27demesIGL1BEh0Hd6aNT7vUbz1VCuiwGDp2qmBjZc92e1xjM1ZnlPBAnCeZhKEipPFyUdidEiTq04LTX+bLAbPIzhKu4BtdMR7OOjwrhVk5I4EBTWQG7clW8q4lRVlKc6BMY4+gQ5KvSjSxGF+ipvVMPuVmMToiJ/Nb0a/Vx2jkoLtxrUnnJT/wI/HmjmddhjfqpWpV2WxEX2Ra+frWv23RY7VD3XPrfhiMQdO/NYJTEYu53q/cQxDb19b3tNhNWP6B9hyWoyU6IYZagEPo89XM+OcUcwxJ0n8UcocGXwSjYKXPAHqvt7n6FIUgubMKmhCCokR28Iy7Rmy0bW5bp261mMOpmMfeEIaiXIaiZ7vsbiO5TegYwax10mctc5jKXuU2j/QPV9w80W/QS2QAAAABJRU5ErkJggg==" alt="product"></img>
              Checkout
            </>
          )}
        </Link>
      </div>
    </div>
  );
}
