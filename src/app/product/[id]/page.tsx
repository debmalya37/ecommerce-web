"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Loader from "@/components/Loader";
import ImageZoomWithPopup from "@/components/ImageZoomWithPopUp";

export default function ProductDetails({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alreadyInCart, setAlreadyInCart] = useState(false);

  // Zoom states
  const [modalZoom, setModalZoom] = useState(1);
  const [clickCount, setClickCount] = useState(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Variant selection: null means no variant selected
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number | null>(null);

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

  // Check if product (with selected variant, if any) is in cart
  useEffect(() => {
    if (product) {
      const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
      const variantColor =
        selectedVariantIndex !== null && product.variants?.[selectedVariantIndex]
          ? product.variants[selectedVariantIndex].color
          : null;

      const exists = cartItems.some(
        (item: any) => item._id === product._id && item.variant === variantColor
      );
      setAlreadyInCart(exists);
    }
  }, [product, selectedVariantIndex]);

  if (loading) return <Loader />;
  if (!product) {
    return <p className="text-center mt-10 text-red-500">Product not found</p>;
  }

  const hasVariants = product.variants && product.variants.length > 0;

  // Determine active images & stock
  const activeImages =
    hasVariants && selectedVariantIndex !== null
      ? product.variants[selectedVariantIndex].images
      : product.images;
  const activeStock =
    hasVariants && selectedVariantIndex !== null
      ? product.variants[selectedVariantIndex].stock
      : product.stock;

  // Discount
  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  // Add to cart
  // Inside ProductDetails component, update handleAddToCart:
const handleAddToCart = () => {
  if (alreadyInCart) return;

  const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
  const variantColor =
    hasVariants && selectedVariantIndex !== null
      ? product.variants[selectedVariantIndex].color
      : null;

  // Include image URL from activeImages array (using the first image)
  const productToAdd = {
    _id: product._id,
    name: product.name,
    quantity,
    price: product.price,
    variant: variantColor,
    imageUrl: activeImages[0]  // Added property: store the first image URL
  };

  cartItems.push(productToAdd);
  localStorage.setItem("cart", JSON.stringify(cartItems));
  setAlreadyInCart(true);
  window.location.reload();
};

  // Buy now
  const handleBuyNow = () => {
    const variantColor =
      hasVariants && selectedVariantIndex !== null
        ? product.variants[selectedVariantIndex].color
        : null;

    const productToBuy = {
      ...product,
      quantity,
      variant: variantColor,
      images: activeImages,
      stock: activeStock,
    };

    sessionStorage.setItem("selectedProduct", JSON.stringify(productToBuy));
    sessionStorage.setItem("source", "buy-now");
    router.push("/userBillingDetails");
  };

  // Image navigation
  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % activeImages.length);
  };
  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + activeImages.length) % activeImages.length);
  };

  // Modal
  const openModal = () => {
    setIsModalOpen(true);
    setModalZoom(1);
    setClickCount(0);
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
  };
  const closeModal = () => setIsModalOpen(false);

  // Double/triple click for zoom
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

  // Quantity
  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };
  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  // Toggle variant selection
  const handleVariantToggle = (index: number) => {
    if (selectedVariantIndex === index) {
      setSelectedVariantIndex(null);
    } else {
      setSelectedVariantIndex(index);
    }
    setCurrentImageIndex(0);
  };

  // For the top label
  const selectedColorName =
    hasVariants && selectedVariantIndex !== null
      ? product.variants[selectedVariantIndex].color
      : null;

  const colorCount = hasVariants ? product.variants.length : 0;

  return (
    <div className="bg-white text-black min-h-screen flex flex-col">
      <div className="container mx-auto p-4 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left side: images & thumbnails */}
          <div className="space-y-4">
            {/* Main image */}
            <div className="relative cursor-pointer" onClick={openModal}>
              <ImageZoomWithPopup
                src={activeImages[currentImageIndex]}
                alt={product.name}
                containerClassName="w-full h-64 sm:h-80 md:h-96 bg-gray-100 rounded-lg shadow-md flex items-center justify-center overflow-hidden"
                zoomLevel={2}
              />
              {activeImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevImage();
                    }}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-600 text-white p-3 rounded-full hover:bg-gray-500"
                  >
                    &lt;
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextImage();
                    }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-600 text-white p-3 rounded-full hover:bg-gray-500"
                  >
                    &gt;
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail row */}
            {activeImages.length > 1 && (
              <div className="flex space-x-3 bg-gray-200 p-2 rounded-md overflow-x-auto">
                {activeImages.map((img: string, idx: number) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-16 h-16 rounded-md object-cover cursor-pointer transition ${
                      currentImageIndex === idx
                        ? "border-2 border-blue-500 scale-105"
                        : "border border-transparent"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Variant selection: show a thumbnail + color name */}
            <div className="mt-4">
              {hasVariants ? (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-700">
                      Color:{" "}
                      <span className="font-bold">
                        {selectedColorName || "None"}
                      </span>
                    </span>
                    <span className="text-sm text-gray-600">
                      Available Color: {colorCount}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant: any, idx: number) => {
                      // Show the first image as the thumbnail for the color
                      const variantThumbnail = variant.images?.[0] || "";
                      return (
                        <button
                          key={idx}
                          onClick={() => handleVariantToggle(idx)}
                          className={`px-2 py-2 rounded-md transition border text-sm font-medium
                            ${
                              selectedVariantIndex === idx
                                ? "bg-white text-blue-600 border-blue-600 ring-2 ring-blue-300"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          style={{ width: "80px", minHeight: "100px" }}
                        >
                          <div className="flex flex-col items-center">
                            {variantThumbnail ? (
                              <img
                                src={variantThumbnail}
                                alt={variant.color}
                                className="w-12 h-12 object-cover mb-1 rounded"
                              />
                            ) : (
                              <div className="w-12 h-12 mb-1 bg-gray-400 rounded flex items-center justify-center">
                                <span className="text-xs text-white">No Img</span>
                              </div>
                            )}
                            <span className="truncate">{variant.color}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : (
                <p className="font-semibold text-gray-700">
                  Color: None
                </p>
              )}
            </div>
          </div>

          {/* Right side: product details */}
          <div className="space-y-6 bg-gray-100 p-6 rounded-lg shadow-md">
            {discountPercent > 0 && (
              <div className="text-xs inline-block bg-blue-500 text-white px-2 py-1 rounded-full self-start">
                Save {discountPercent}%
              </div>
            )}

            <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>

            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-extrabold text-green-600">
                ₹{product.price.toLocaleString()}
              </span>
              <span className="text-sm font-bold text-gray-500">MRP:</span>
              <span className="text-sm line-through text-gray-400">
                ₹{product.originalPrice.toLocaleString()}
              </span>
              {discountPercent > 0 && (
                <span className="text-sm font-semibold text-red-500">
                  ↓{discountPercent}%
                </span>
              )}
            </div>

            {activeStock > 0 ? (
              <p className="inline-block px-3 py-1 rounded-md text-sm font-bold">
              </p>
            ) : (
              <p className="bg-red-100 text-red-800 inline-block px-3 py-1 rounded-md text-sm font-bold">
                Out of Stock
              </p>
            )}

<p
  className="text-gray-700 text-sm leading-relaxed"
  style={{ whiteSpace: "pre-line" }}
>
  {product.description}
</p>


            {activeStock > 0 && (
              <div className="flex items-center space-x-4">
                <label className="text-sm font-semibold text-gray-600">
                  Quantity:
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    -
                  </button>
                  <span className="text-lg font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    disabled={quantity >= activeStock}
                    className={`px-3 py-1 rounded text-white ${
                      quantity < activeStock
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={handleAddToCart}
                disabled={alreadyInCart || activeStock === 0}
                className={`flex-1 inline-flex items-center justify-center text-sm font-semibold px-4 py-2 rounded-md transition ${
                  activeStock === 0 || alreadyInCart
                    ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {alreadyInCart ? "Already in Cart" : "Add to Cart"}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={activeStock === 0}
                className={`flex-1 inline-flex items-center justify-center text-sm font-semibold px-4 py-2 rounded-md transition ${
                  activeStock === 0
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

      {/* Modal for full-size image & zoom */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            className="relative bg-white text-black p-6 rounded-lg max-w-[90vw] max-h-[90vh] overflow-auto"
            onClick={handleModalImageClick}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeModal();
              }}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-3xl"
            >
              &times;
            </button>
            <div className="flex justify-center">
              <img
                src={activeImages[currentImageIndex]}
                alt={product.name}
                style={{ transform: `scale(${modalZoom})`, transition: "transform 0.2s ease" }}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <p className="mt-2 text-center text-sm text-gray-500">
              Double-click to zoom in (130%), triple-click to reset.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
