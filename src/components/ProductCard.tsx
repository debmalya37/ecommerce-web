// src/components/ProductCard.tsx
import Link from 'next/link';

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export default function ProductCard({ id, name, description, price, imageUrl }: ProductCardProps) {
  return (
    <div className="border p-4 rounded-lg shadow-lg hover:shadow-xl transition bg-slate-200">
      <div className="h-80 w-full overflow-hidden rounded-md mb-4">
        {/* Ensure consistent size and aspect ratio */}
        <img 
          src={imageUrl} 
          alt={name} 
          className="h-full w-full object-contain"
        />
      </div>
      <h2 className="font-bold text-lg mb-2">{name}</h2>
      <p className="text-gray-600 mb-4">{description}</p>
      <p className="text-blue-500 font-semibold mb-4">₹{price.toFixed(2)}</p>
      <Link href={`/product/${id}`} className="text-white bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded">
        View Product
      </Link>
    </div>
  );
}
