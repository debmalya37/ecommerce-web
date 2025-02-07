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
  return (
    <div className="border p-4 rounded-lg shadow-lg hover:shadow-xl transition bg-white relative">
      {/* Product Image */}
      <div className="h-80 w-full overflow-hidden rounded-md mb-4 bg-gray-100 flex items-center justify-center">
        <img 
          src={imageUrl} 
          alt={name} 
          className="h-full w-full object-contain"
          onError={(e) => (e.currentTarget.src = "/images/placeholder.jpg")}
        />
      </div>

      {/* Product Details */}
      <h2 className="font-bold text-lg mb-2 text-gray-800">{name}</h2>
      <p className="text-gray-600 text-sm mb-4">{description}</p>

      {/* Price Section */}
      <div className="mb-4">
        <p className="text-red-500 font-semibold text-lg">₹{price.toFixed(2)}</p>
        <p className="text-gray-500 line-through text-sm">₹{originalPrice.toFixed(2)}</p>
      </div>

      {/* Stock Status */}
      {stock === 0 ? (
        <p className="text-red-600 font-bold absolute top-2 right-2">Out of Stock</p>
      ) : (
        <p className="text-green-600 font-semibold">In Stock: {stock}</p>
      )}

      {/* View Product Button */}
      <Link
        href={stock === 0 ? "#" : `/product/${id}`}
        className={`block text-center text-white py-2 px-4 rounded mt-4 ${
          stock === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {stock === 0 ? "Unavailable" : "View Product"}
      </Link>
    </div>
  );
}
