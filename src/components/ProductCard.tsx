import { useState } from "react";
import Link from "next/link";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  imageUrl: string;
  stock: number;
}

export default function ProductCard({ id, name, description, price, originalPrice, imageUrl, stock }: ProductCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLongDescription = description.length > 100;

  return (
    <div className="border p-4 rounded-lg shadow-lg hover:shadow-xl transition bg-white relative flex flex-col min-h-[450px] sm:min-h-[500px]">
      {/* Product Image (Fixed Size) */}
      <div className="w-full h-48 sm:h-56 md:h-64 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-full object-cover"
          onError={(e) => (e.currentTarget.src = "/images/placeholder.jpg")}
        />
      </div>

      {/* Product Details */}
      <h2 className="font-bold text-lg text-gray-800 mt-2">{name}</h2>

      {/* Expandable Description */}
      <p className="text-gray-600 text-sm">
        {isExpanded ? description : `${description.substring(0, 100)}...`}
      </p>

      {isLongDescription && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-500 hover:underline text-sm font-semibold mt-1"
        >
          {isExpanded ? "Read Less" : "Read More"}
        </button>
      )}

      {/* Price Section */}
      <div className="mt-auto">
        <div className="flex items-center space-x-2">
          <p className="text-xl font-bold text-green-600">₹{price.toFixed(2)}</p>
          <p className="text-gray-500 line-through text-sm">₹{originalPrice.toFixed(2)}</p>
        </div>
      </div>

      {/* Stock Status */}
      {stock === 0 && (
        <p className="text-red-600 font-bold absolute top-2 right-2">Out of Stock</p>
      )}

      {/* View Product Button (Fixed at Bottom) */}
      <div className="mt-4">
        <Link
          href={stock === 0 ? "#" : `/product/${id}`}
          className={`block text-center text-white py-2 px-4 rounded w-full ${
            stock === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {stock === 0 ? "Unavailable" : "View Product"}
        </Link>
      </div>
    </div>
  );
}
