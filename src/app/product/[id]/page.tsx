"use client";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import ImageZoomWithPopup from "@/components/ImageZoomWithPopUp";

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
  const [modalZoom, setModalZoom] = useState(1);
  const [clickCount, setClickCount] = useState(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  // State for variant selection (null means no variant selected)
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number | null>(null);

  // Fetch product details
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
    if (params.id) fetchProduct();
  }, [params.id]);

  // When product loads or variant selection changes, check if product is already in cart
  useEffect(() => {
    if (product) {
      const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
      const exists = cartItems.some((item: any) => 
        item._id === product._id &&
        item.variant === (selectedVariantIndex !== null ? product.variants[selectedVariantIndex].color : null)
      );
      setAlreadyInCart(exists);
    }
  }, [product, selectedVariantIndex]);

  if (loading) return <Loader />;
  if (!product) return <p className="text-center mt-10 text-red-500">Product not found</p>;

  // Compute active images and stock based on variant selection.
  // If a variant is selected, use its images and stock; otherwise, use the product’s defaults.
  const activeImages =
    selectedVariantIndex !== null && product.variants && product.variants.length > selectedVariantIndex
      ? product.variants[selectedVariantIndex].images
      : product.images;

  const activeStock =
    selectedVariantIndex !== null && product.variants && product.variants.length > selectedVariantIndex
      ? product.variants[selectedVariantIndex].stock
      : product.stock;

  const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  // Handle Add to Cart with variant details
  const handleAddToCart = () => {
    if (alreadyInCart) return;
    const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
    const productToAdd = {
      _id: product._id,
      name: product.name,
      quantity,
      price: product.price,
      variant: selectedVariantIndex !== null ? product.variants[selectedVariantIndex].color : null,
    };
    cartItems.push(productToAdd);
    localStorage.setItem("cart", JSON.stringify(cartItems));
    setAlreadyInCart(true);
    window.location.reload();
  };

  // Handle Buy Now with variant details
  const handleBuyNow = () => {
    const productToBuy = {
      ...product,
      quantity,
      variant: selectedVariantIndex !== null ? product.variants[selectedVariantIndex].color : null,
      images: activeImages,
      stock: activeStock,
    };
    sessionStorage.setItem("selectedProduct", JSON.stringify(productToBuy));
    sessionStorage.setItem("source", "buy-now");
    router.push("/userBillingDetails");
  };

  // Image navigation using activeImages
  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % activeImages.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + activeImages.length) % activeImages.length);
  };

  // Modal controls
  const openModal = () => {
    setIsModalOpen(true);
    setModalZoom(1);
    setClickCount(0);
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
  };

  const closeModal = () => setIsModalOpen(false);

  // Quantity controls
  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  // Custom click handler for modal image (double-click zoom in, triple-click reset)
  const handleModalImageClick = () => {
    setClickCount((prevCount) => {
      const newCount = prevCount + 1;
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      clickTimerRef.current = setTimeout(() => {
        if (newCount === 2) {
          setModalZoom(1.3);
        } else if (newCount >= 3) {
          setModalZoom(1);
        }
        setClickCount(0);
      }, 300);
      return newCount;
    });
  };
   

  return (
    <div className="bg-[#1F2A37] text-white min-h-screen flex flex-col">
      <div className="container mx-auto p-4 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Images and Variants */}
          <div className="space-y-4">
            <div className="relative cursor-pointer" onClick={openModal}>
              <ImageZoomWithPopup
                src={activeImages[currentImageIndex]}
                alt={product.name}
                containerClassName="w-full h-64 sm:h-80 md:h-96 bg-[#2B3A4A] rounded-lg shadow-md flex items-center justify-center overflow-hidden"
                zoomLevel={2}
              />
              <button
                onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-3 rounded-full hover:bg-gray-600"
              >
                &lt;
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-3 rounded-full hover:bg-gray-600"
              >
                &gt;
              </button>
            </div>
            {/* Thumbnail strip */}
            <div className="flex space-x-3 bg-[#2B3A4A] p-2 rounded-md overflow-x-auto">
              {activeImages.map((img: string, idx: number) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-16 h-16 rounded-md object-cover cursor-pointer transition ${
                    currentImageIndex === idx ? "border-2 border-blue-500 scale-105" : "border border-transparent"
                  }`}
                />
              ))}
            </div>
            {/* Variant selection */}
            {product.variants && product.variants.length > 0 && (
              <div className="mt-4">
                <p className="font-semibold text-gray-300 mb-2">Available Colors:</p>
                <div className="flex space-x-3">
                  {product.variants.map((variant: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedVariantIndex(idx);
                        setCurrentImageIndex(0);
                      }}
                      className={`px-3 py-1 rounded-md transition ${
                        selectedVariantIndex === idx
                          ? "bg-blue-600 text-white"
                          : "bg-gray-300 text-gray-800 hover:bg-blue-500 hover:text-white"
                      }`}
                    >
                      {variant.color}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Product Details */}
          <div className="space-y-6 bg-[#2B3A4A] p-6 rounded-lg shadow-md">
            {discountPercent > 0 && (
              <div className="text-xs inline-block bg-blue-600 text-white px-2 py-1 rounded-full self-start">
                Up to {discountPercent}% off
              </div>
            )}
            <h1 className="text-3xl font-bold text-white">{product.name}</h1>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-extrabold text-green-400">
                ₹{product.price.toLocaleString()}
              </span>
              <span className="text-sm font-bold text-gray-400">MRP:</span>
              <span className="text-sm line-through text-gray-400">
                ₹{product.originalPrice.toLocaleString()}
              </span>
              {discountPercent > 0 && (
                <span className="text-sm font-semibold text-yellow-300">
                  ↓{discountPercent}%
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {activeStock > 0 ? (
                <span className="bg-purple-600 text-white text-sm font-bold px-3 py-2 rounded-full">
                  Hot Deal
                </span>
              ) : (
                <span className="bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  Out of Stock
                </span>
              )}
            </div>
            <p className="text-sm text-gray-200 leading-relaxed">
              {product.description}
            </p>
            {activeStock > 0 && (
              <div className="flex items-center space-x-4">
                <label htmlFor="quantity" className="text-sm font-semibold text-gray-300">
                  Quantity:
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={decrementQuantity}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    -
                  </button>
                  <span className="text-lg font-bold">{quantity}</span>
                  <button
                    onClick={incrementQuantity}
                    disabled={quantity >= activeStock}
                    className={`px-3 py-1 rounded text-white ${
                      quantity < activeStock ? "bg-green-600 hover:bg-green-700" : "bg-gray-500 cursor-not-allowed"
                    }`}
                  >
                    +
                  </button>
                </div>
              </div>
            )}
            <div className="fixed bottom-0 left-0 right-0 mt-auto flex space-x-3 pt-3 shadow-md z-50 md:relative md:mt-4 md:flex md:space-x-4 md:mr-1 md:ml-1">
              <button
                onClick={handleAddToCart}
                disabled={alreadyInCart || activeStock === 0}
                className={`flex-1 inline-flex items-center justify-center text-sm font-semibold px-4 py-2 rounded-md transition ${
                  activeStock === 0 || alreadyInCart
                    ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {alreadyInCart ? (
                  "Already in Cart"
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="w-5 h-5 mr-2"
                    >
                      <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 7.5M17 13l1.5 7.5M9 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z" />
                    </svg>
                    Add to Cart
                  </>
                )}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={activeStock === 0}
                className={`flex-1 inline-flex items-center justify-center text-sm font-semibold px-4 py-2 rounded-md transition ${
                  activeStock === 0
                    ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600 text-white"
                }`}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            className="relative bg-[#2B3A4A] text-white p-6 rounded-lg max-w-[90vw] max-h-[90vh] overflow-auto"
            onClick={handleModalImageClick}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeModal();
              }}
              className="absolute top-2 right-2 text-gray-300 hover:text-white text-3xl"
            >
              &times;
            </button>
            <div className="flex justify-center" onClick={handleModalImageClick}>
              <img
                src={activeImages[currentImageIndex]}
                alt={product.name}
                style={{ transform: `scale(${modalZoom})`, transition: "transform 0.2s ease" }}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <p className="mt-2 text-sm text-gray-400 text-center">
              Double-click for 130% zoom, triple-click to reset.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
