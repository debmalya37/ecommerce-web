"use client";

import { products } from '@/data/products';
import { useCart } from '@/hooks/useCart';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProductDetails({ params }: { params: { id: string } }) {
  const { addToCart } = useCart();
  const router = useRouter();
  const product = products.find((p) => p.id === params.id);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!product) return <p>Product not found</p>;

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    router.push('/cart'); // Redirect to cart page
  };

  const handleBuyNow = () => {
    // Store selected product details and mark source as buy-now
    sessionStorage.setItem(
      'selectedProduct',
      JSON.stringify({ ...product, quantity })
    );
    sessionStorage.setItem('source', 'buy-now');
    router.push('/userBillingDetails'); // Redirect to billing details page
  };

  if (!product) return <p>Product not found</p>;

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + product.images.length) % product.images.length);
  };

  

  const openModal = () => {
    setIsModalOpen(true); // Open modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close modal
  };

  return (
    <div className="container mx-auto p-6 space-y-8 bg-sky-200 h-[100vh]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="space-y-4">
          <div className="relative w-full h-96 overflow-hidden bg-gray-100 rounded-lg shadow-md">
            <img
              src={product.images[currentImageIndex]}
              alt={product.name}
              className="w-full h-full object-contain cursor-pointer"
              onClick={openModal}
              onError={(e) => (e.currentTarget.src = '/images/placeholder.jpg')}
            />
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-600 text-white p-3 rounded-full"
            >
              &lt;
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-600 text-white p-3 rounded-full"
            >
              &gt;
            </button>
          </div>

          {/* Thumbnail Navigation */}
          <div className="flex space-x-4 overflow-x-auto bg-sky-100 rounded-md">
            {product.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className={`w-20 h-20 object-cover rounded-md cursor-pointer ${
                  currentImageIndex === index ? 'border-2 border-blue-600' : ''
                }`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <h1 className="text-3xl font-semibold text-gray-800">{product.name}</h1>
          <p className="text-gray-600">{product.description}</p>
          <p className="text-2xl font-bold text-gray-900">₹{product.price}</p>

          {/* Quantity Selector */}
          <div className="flex items-center space-x-4">
            <label htmlFor="quantity" className="text-lg text-gray-700">
              Quantity:
            </label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              min="1"
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
              className="border p-2 w-20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handleAddToCart}
              className="bg-blue-600 text-white py-2 px-6 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="bg-yellow-500 text-white py-2 px-6 rounded-md shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Modal for Full-Size Image */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-gray-700 p-6 rounded-lg max-w-[90vw] max-h-[90vh]">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-black text-3xl"
            >
              &times;
            </button>
            <img
              src={product.images[currentImageIndex]}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
