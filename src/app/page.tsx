import Link from "next/link";
import { products } from "@/data/products";
import heroImg from "../../public/images/hero.jpg";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="bg-blue-50 min-h-screen">
      {/* Hero Section */}
      <header className="relative bg-blue-600 text-white sm:h-[50vh] md:h-[80vh]"
>
  <div className="relative h-full">
    {/* Background Image */}
    <Image
      src={heroImg}
      alt="Hero Section Background"
      layout="fill" // Ensures the image fills the container
      objectFit="cover" // Default for larger screens
      objectPosition="center" // Default position
      priority // Optimizes loading for hero image
      className="absolute inset-0 sm:object-contain md:object-cover " // Responsive styles
    />
    {/* Overlay for text readability */}
    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
    {/* Content */}
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



      {/* Featured Products Section
      <section className="bg-white py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.slice(0, 3).map((product) => (
              <div
                key={product.id}
                className="border p-4 rounded-lg shadow-lg hover:shadow-xl transition bg-slate-200"
              >
                <div className="h-80 w-full overflow-hidden rounded-md mb-4">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-full w-full object-contain"
                  />
                </div>
                <h2 className="font-bold text-lg mb-2">{product.name}</h2>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="mb-4">
                  <p className="text-red-500 font-semibold text-lg">
                    ₹{product.price.toFixed(2)}
                  </p>
                  <p className="text-gray-500 line-through text-sm">
                    ₹{product.originalPrice.toFixed(2)}
                  </p>
                </div>
                <Link
                  href={`/product/${product.id}`}
                  className="text-white bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded"
                >
                  View Product
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Call to Action Section */}
      <section className="bg-blue-600 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Join Thousands of Happy Customers!
          </h2>
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
      <section className="bg-blue-200 py-12 rounded-md m-3">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">About Us</h2>
          <p className="text-lg text-gray-700 mb-6">
            HIURI ENTERPRISES, founded in 2023, is a fast-growing FMCG company dedicated to manufacturing high-quality cleaning products that simplify everyday life. Driven by innovation and a commitment to excellence, our products are designed to deliver superior cleanliness, safety, and satisfaction for households and businesses alike.
          </p>
          <p className="text-lg text-gray-700 mb-6">
            With sustainability at our core, we prioritize eco-friendly practices and carefully select ingredients that are effective yet gentle on the environment. Our mission is to set new standards in cleanliness while contributing to a healthier, greener future.
          </p>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-blue-600 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Join Thousands of Happy Customers!
          </h2>
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

      {/* Footer */}
      <footer className="bg-blue-700 text-white py-6">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; 2025 HIURI ENTERPRISES . All rights reserved.</p>
          <Link
            href="/terms-and-conditions"
            className="text-yellow-300 hover:underline mx-2"
          >
            Terms and Conditions
          </Link>
          <Link
            href="/privacy-policy"
            className="text-yellow-300 hover:underline mx-2"
          >
            Privacy Policy
          </Link>
          <Link
            href="/shipping-policy"
            className="text-yellow-300 hover:underline mx-2"
          >
            Shipping Policy
          </Link>
          <Link
            href="/refund-policy"
            className="text-yellow-300 hover:underline mx-2"
          >
            refund Policy
          </Link>
        </div>
      </footer>
    </div>
  );
}
