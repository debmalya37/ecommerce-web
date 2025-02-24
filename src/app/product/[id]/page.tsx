"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react"; // Get session data
import axios from "axios";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import ImageZoom from "@/components/ImageZoom"; // Import the ImageZoom component

export default function ProductDetails({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const userEmail = session?.user?.email || "";
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alreadyInCart, setAlreadyInCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/products?id=${params.id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  useEffect(() => {
    if (product) {
      const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
      const exists = cartItems.some((item: any) => item._id === product._id);
      setAlreadyInCart(exists);
    }
  }, [product]);

  if (loading) return <Loader />;
  if (!product) return <p className="text-center mt-10 text-red-600">Product not found</p>;

  const handleAddToCart = () => {
    if (alreadyInCart) return;
    const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
    const newProduct = {
      _id: product._id,
      name: product.name,
      quantity,
      price: product.price,
    };
    cartItems.push(newProduct);
    localStorage.setItem("cart", JSON.stringify(cartItems));
    setAlreadyInCart(true);
    window.location.reload();
  };

  const handleBuyNow = () => {
    sessionStorage.setItem("selectedProduct", JSON.stringify({ ...product, quantity }));
    sessionStorage.setItem("source", "buy-now");
    router.push("/userBillingDetails");
  };
  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + product.images.length) % product.images.length);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      <div className="flex-1 overflow-y-auto container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="space-y-4">
            {/* Using the ImageZoom component for Amazon-like zoom */}
            <div className="relative">
              <ImageZoom
                src={product.images[currentImageIndex]}
                alt={product.name}
                containerClassName="w-full h-56 sm:h-72 md:h-96 overflow-hidden bg-gray-100 rounded-lg shadow-md cursor-pointer"
              />
            </div>
            {/* Thumbnail Navigation */}
            <div className="flex space-x-4 overflow-x-auto bg-sky-100 rounded-md p-2">
              {product.images.map((image: string, index: number) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className={`w-16 h-16 object-cover rounded-md cursor-pointer ${
                    currentImageIndex === index ? "border-2 border-blue-600" : ""
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <h1 className="text-3xl font-semibold text-gray-800">{product.name}</h1>
            {product.stock > 0 && (
              <div className="flex items-center space-x-4">
                <label htmlFor="quantity" className="text-lg text-gray-700">
                  Quantity:
                </label>
                <div className="flex items-center space-x-2">
                  <button onClick={decrementQuantity} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                    -
                  </button>
                  <span className="text-lg font-semibold">{quantity}</span>
                  <button
                    onClick={incrementQuantity}
                    className={`px-4 py-2 rounded-md ${quantity < product.stock ? "bg-green-600 hover:bg-green-900 text-white" : "bg-gray-400 text-gray-700 cursor-not-allowed"}`}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>
            )}
            <div className="flex items-center">
              <div className="bg-purple-600 text-white text-sm font-bold px-3 py-2 rounded-md">
                Hot Deal
              </div>
            </div>
            {/* Pricing Section */}
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
              <span className="text-lg font-bold text-gray-900">MRP:</span>
              <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
              <span className="text-lg font-bold text-green-700">
                ↓{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
              </span>
            </div>
            <p className="text-gray-600">{product.description}</p>
            {product.stock === 0 ? (
              <p className="text-red-600 font-bold text-lg">Out of Stock</p>
            ) : (
              <p className="text-green-600 font-semibold"></p>
            )}

            {/* Fixed Action Buttons */}
            <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md p-4 flex justify-between z-50 md:relative md:mt-4 md:static md:flex md:space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={alreadyInCart || product.stock === 0}
                className={`flex-1 mx-1 py-3 text-lg font-semibold rounded-md ${
                  product.stock === 0 || alreadyInCart
                    ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {alreadyInCart ? "Already in Cart" : "Add to Cart"}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className={`flex-1 mx-1 py-3 text-lg font-semibold rounded-md ${
                  product.stock === 0
                    ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600 text-white"
                }`}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Full-Size Image */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white p-6 rounded-lg max-w-[90vw] max-h-[90vh]">
            <button onClick={closeModal} className="absolute top-2 right-2 text-gray-600 text-3xl">
              &times;
            </button>
            <img src={product.images[currentImageIndex]} alt={product.name} className="w-full h-full object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
