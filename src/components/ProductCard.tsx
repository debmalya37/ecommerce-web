"use client";
import Link from "next/link";

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
  const discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100);
  const discountLabel = discountPercent > 0 ? `Up to ${discountPercent}% off` : null;

  return (
    <>
      <Link href={stock === 0 ? "#" : `/product/${id}`}>
        <div className="bg-[#e4ecf5] text-white rounded-lg shadow-sm shadow-gray-800 p-4 flex flex-col relative transition-transform hover:-translate-y-1 hover:shadow-2xl hover:scale-[1.01] hover:shadow-gray-800 h-96">
          {/* Top Row: Discount Badge */}
          <div className="flex justify-between items-center mb-2">
            {discountLabel && (
              <span className="bg-blue-600 text-xs font-semibold px-2 py-1 rounded">
                {discountLabel}
              </span>
            )}
          </div>

          {/* Product Image */}
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

          {/* Product Title */}
          <div className="mt-3 h-12 overflow-ellipsis">
            <h2 className="font-bold text-sm sm:text-base md:text-lg line-clamp-2 text-gray-800">
              {name}
            </h2>
          </div>

          {/* Small Badges */}
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
        </div>
      </Link>
    </>
  );
}
