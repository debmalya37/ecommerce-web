"use client";
import Link from "next/link";
import { motion } from "framer-motion";

interface Props {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  imageUrl: string;
  stock: number;
}

export default function ProductCard({
  id, name, price, originalPrice, imageUrl, stock
}: Props) {
  const discount = Math.round(((originalPrice - price) / originalPrice) * 100);

  return (
    <Link href={stock ? `/product/${id}` : "#"} className="group">
      <motion.div
        whileHover={{ scale: 1.03, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
        className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-lg h-full relative"
      >
        {/* Discount badge */}
        {discount > 0 && (
          <span className="
            absolute top-3 left-3 px-3 py-1 text-xs font-bold rounded-full
            bg-gradient-to-r from-purple-500 to-pink-500 text-white z-10
          ">
            -{discount}%
          </span>
        )}

        {/* Image */}
        <div className="relative w-full aspect-square bg-gray-100">
          <img
            src={imageUrl}
            alt={name}
            className="object-contain w-full h-full p-4"
            onError={e => (e.currentTarget.src = "/images/placeholder.jpg")}
          />
          {!stock && (
            <div className="
              absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center
            ">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 flex-1 flex flex-col">
          <h2 className="
            text-gray-900 font-semibold text-base line-clamp-2 mb-2
            group-hover:text-purple-600 transition-colors
          ">
            {name}
          </h2>

          <div className="mt-auto">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-green-600">
                ₹{price.toLocaleString()}
              </span>
              {originalPrice > price && (
                <span className="text-sm line-through text-gray-400">
                  ₹{originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
