"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";
import heroImg from "../../public/images/hero.jpg";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [categories, setCategories] = useState<any[]>([]);
  const { data: session } = useSession();
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const router = useRouter();

  const testimonials = [
    {
      message:
        "Hiuri’s detergents have completely changed my laundry game! Clothes come out fresher and last longer.",
      author: "Ravi",
      location: "Mumbai",
    },
    {
      message:
        "हिउरी के डिटर्जेंट से मेरी धोबी की काम में क्रांति आ गई है! कपड़े बेहद साफ़ और चमकदार होते हैं।",
      author: "संजय",
      location: "दिल्ली",
    },
    {
      message:
        "I love the eco-friendly formulas and amazing cleaning power. Truly a game changer.",
      author: "Priya",
      location: "Bengaluru",
    },
    {
      message:
        "इन प्रोडक्ट्स ने घर की सफाई को आसान बना दिया है। मैं इन्हें हर बार खरीदती हूँ।",
      author: "सीमा",
      location: "Meerut",
    },
    {
      message:
        "Fast delivery and excellent quality. I recommend Hiuri to all my friends.",
      author: "Amit",
      location: "Kolkata",
    },
  ];

  // Fetch categories from your API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch featured products (only 4)
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await axios.get("/api/products");
        // Display only the first 4 products
        setFeaturedProducts(response.data.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
      }
    };
    fetchFeaturedProducts();
  }, []);

  const sliderItems = [...testimonials, ...testimonials];

  return (
    <>
    <div className="bg-gradient-to-br from-gray-900 via-blue-950 to-purple-900 min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="relative bg-blue-600 text-white sm:h-[50vh] md:h-[80vh]">
        <div className="relative h-full">
          {/* Background Image */}
          <Image
            src={heroImg}
            alt="Hero Section Background"
            fill
            className="absolute inset-0 object-cover sm:object-contain md:object-cover"
            priority
          />
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>

          {/* Hero Content */}
          <div className="relative container mx-auto px-6 text-center z-10 h-full flex flex-col justify-center items-center">
            <div className="mt-auto mb-16 md:mb-12 lg:mb-20">
              <h1 className="text-4xl font-bold mb-4">
                Welcome to <span className="text-yellow-300">Hiuri</span>
              </h1>
              <p className="text-lg mb-6">
                Your one-stop shop for high-quality detergents, dishwashers, soaps, and more!
              </p>
              <Link
                href="/products"
                className="bg-yellow-400 hover:bg-yellow-500 text-blue-800 py-3 px-6 rounded-lg font-semibold shadow-md transition"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Categories Section */}
      <section className="py-8 bg-gradient-to-br from-gray-900 via-blue-950 to-purple-900">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-100 mb-4 text-center">
            Shop by Category
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 ">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/products?category=${encodeURIComponent(cat.name)}`}
              >
                <span
                  className="
                    block 
                    bg-[#331f62] 
                    rounded-lg 
                    shadow 
                    p-4 
                    text-center 
                    hover:shadow-lg 
                    transition 
                    min-h-[80px] 
                    flex 
                    items-center 
                    justify-center
                    text-white
                    border-2
                    border-cyan-500
                    hover:border-gray-200
                  "
                >
                  <p className="text-gray-100 font-semibold break-words max-w-full">
                    {cat.name}
                  </p>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

     {/* Featured Products Section */}
<section className="py-12 bg-gradient-to-br from-gray-900 via-blue-950 to-purple-900">
  <div className="container mx-auto px-6">
    <h2 className="text-3xl font-bold text-gray-200 mb-6 text-center">
      Featured Products
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {featuredProducts.map((product: any) => (
        <Link key={product._id} href={`/product/${product._id}`}>
          <span className="block bg-gray-50 p-4 rounded-lg shadow-md text-center hover:shadow-xl transition transform hover:scale-105">
            <div className="h-40 w-full bg-gray-200 mb-2 rounded-md overflow-hidden">
              <img
                src={product.images[0]}
                alt={product.name}
                width={300}
                height={300}
                className="object-contain w-full h-full"
              />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">{product.name}</h3>
            <p className="text-sm text-gray-600">Short description here</p>
            <p className="text-lg font-semibold text-blue-600 mt-2">
              ₹{product.price}
            </p>
          </span>
        </Link>
      ))}
    </div>
  </div>
</section>


      {/* Why Choose Us Section */}
      <section className="py-12 bg-gradient-to-r from-purple-100 to-blue-100">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center tracking-widest uppercase">
            Why Choose Hiuri?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Premium Quality */}
            <div className="p-4 text-center bg-white rounded-lg shadow-lg hover:shadow-xl transition">
              <div className="relative text-5xl mb-4 text-blue-700 mx-auto w-fit">
                <span className="icon-premium">💯</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-2 text-xl">Premium Quality</h3>
              <p className="text-sm text-gray-600">
                We use only the finest ingredients and the latest manufacturing processes to ensure top-notch cleaning power.
              </p>
            </div>

            {/* Eco-Friendly */}
            <div className="p-4 text-center bg-white rounded-lg shadow-lg hover:shadow-xl transition">
              <div className="relative text-5xl mb-4 text-green-600 mx-auto w-fit">
                <span className="icon-eco">🌱</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-2 text-xl">Eco-Friendly</h3>
              <p className="text-sm text-gray-600">
                Our products are gentle on the environment, using biodegradable formulas and sustainable packaging.
              </p>
            </div>

            {/* Fast Delivery */}
            <div className="p-4 text-center bg-white rounded-lg shadow-lg hover:shadow-xl transition">
              <div className="relative text-5xl mb-4 text-blue-700 mx-auto w-fit">
                <span className="icon-delivery">🚚</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-2 text-xl">Fast Delivery</h3>
              <p className="text-sm text-gray-600">
                Get your orders delivered quickly with our reliable shipping partners nationwide.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Testimonial / Brand Logos (Example) */}
      <section className="py-12 bg-gradient-to-br from-gray-900 via-blue-950 to-purple-900">
  <div className="container mx-auto px-4">
    <h2 className="text-3xl font-bold text-gray-200 mb-6 text-center">
      Our Happy Customers
    </h2>
    {/* Wrap the slider in an overflow-x-auto container */}
    <div className="overflow-x-clip">
      <div className="flex space-x-4 testimonial-slider">
        {sliderItems.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg p-4 min-w-[280px] transition-transform hover:scale-105"
          >
            <p className="text-gray-600 italic text-base break-words">
              “{item.message}”
            </p>
            <p className="mt-4 font-bold text-gray-800 break-words">
              - {item.author}, {item.location}
            </p>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>



      {/* Another CTA Section (repeated) */}
      <section className="bg-gradient-to-br from-gray-900 via-blue-950 to-purple-900 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Thousands of Happy Customers!</h2>
          <p className="text-lg mb-6">
            Discover the perfect cleaning solutions for your home at Hiuri.
          </p>
          <Link
            href="/products"
            className="bg-yellow-400 hover:bg-yellow-500 text-blue-800 py-3 px-6 rounded-lg font-semibold shadow-md transition"
          >
            Start Shopping
          </Link>
        </div>
      </section>

      {/* About Us Section */}
      <section className="bg-gradient-to-br from-gray-900 to-blue-950  py-12 rounded-md m-3">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-100 mb-6">About Us</h2>
          <p className="text-lg text-gray-200 mb-6">
            HIURI ENTERPRISES, founded in 2023, is a fast-growing FMCG company dedicated
            to manufacturing high-quality cleaning products that simplify everyday life.
            Driven by innovation and a commitment to excellence, our products are designed
            to deliver superior cleanliness, safety, and satisfaction for households and
            businesses alike.
          </p>
          <p className="text-lg text-gray-200 mb-6">
            With sustainability at our core, we prioritize eco-friendly practices and
            carefully select ingredients that are effective yet gentle on the environment.
            Our mission is to set new standards in cleanliness while contributing to a
            healthier, greener future.
          </p>
        </div>
      </section>

      
    </div>
    <style jsx global>{`
      @keyframes bounceIcon {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-8px);
        }
      }

      @keyframes floatIcon {
        0% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-6px);
        }
        100% {
          transform: translateY(0);
        }
      }

      @keyframes driveIcon {
        0% {
          transform: translateX(0);
        }
        50% {
          transform: translateX(10px);
        }
        100% {
          transform: translateX(0);
        }
      }

      .animate-bounce-icon {
        animation: bounceIcon 1.5s infinite ease-in-out;
      }

      .animate-float-icon {
        animation: floatIcon 2s infinite ease-in-out;
      }

      .animate-drive-icon {
        animation: driveIcon 2s infinite ease-in-out;
      }
        @keyframes slide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .testimonial-slider {
          animation: slide 20s linear infinite;
        }
        .testimonial-slider:hover {
          animation-play-state: paused;
        }
          @keyframes slide {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-50%);
      }
    }
    .testimonial-slider {
      animation: slide 20s linear infinite;
    }
    .testimonial-slider:hover {
      animation-play-state: paused;
    }
    `}</style>
    </>
  );
}
