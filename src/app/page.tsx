// src/app/page.tsx
import { products } from '@/data/products';
import ProductCard from '@/components/ProductCard';

export default function Home() {
  return (
    <div className="container mx-auto p-6 bg-blue-500">
      <h1 className="text-2xl font-bold mb-6">Our Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            description={product.description}
            price={product.price}
            imageUrl={product.images[0]} // Updated to use the first image
          />
        ))}
      </div>
    </div>
  );
}
