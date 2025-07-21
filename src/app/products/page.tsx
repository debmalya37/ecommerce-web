"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { HiSearch } from "react-icons/hi";
import ProductCard from "@/components/ProductCard";
import { useSearchParams } from "next/navigation";
import Loader from "@/components/Loader";

export default function ProductPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [filtered, setFiltered] = useState<any[]>([]);
  const searchParams = useSearchParams();

  // Fetch once on mount
  useEffect(() => {
    axios.get("/api/products").then(r => setProducts(r.data));
    axios.get("/api/categories").then(r => setCategories(r.data.map((c: any) => c.name)));
  }, []);

  // Pick up ?category= only on client
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  // Filtering logic
  useEffect(() => {
    let tmp = [...products];
    if (selectedCategory !== "All") {
      tmp = tmp.filter(p => p.category === selectedCategory);
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      tmp = tmp.filter(
        p =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term)
      );
    }
    setFiltered(tmp);
  }, [products, selectedCategory, searchTerm]);

  if (!products.length) {
    return <div className="h-[60vh] flex items-center justify-center"><Loader /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-12 lg:px-24">

      {/* Search & Filter Bar */}
      <div className="mb-8 flex flex-col lg:flex-row items-center lg:justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full lg:w-1/3">
          <HiSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search products..."
            className="
              w-full pl-12 pr-4 py-2 rounded-full bg-white shadow-md
              focus:outline-none focus:ring-2 focus:ring-purple-500
              placeholder-gray-400 text-gray-800
            "
          />
        </div>

        {/* Category Pills */}
        <div className="flex overflow-x-auto space-x-2 scrollbar-hide py-2">
          {["All", ...categories].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`
                flex-shrink-0 px-4 py-2 rounded-full font-medium transition
                ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                    : "bg-white text-gray-700 ring-1 ring-gray-200 hover:ring-purple-500"
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.05 } }
        }}
      >
        {filtered.map(p => (
          <motion.div
            key={p._id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <ProductCard
              id={p._id}
              name={p.name}
              price={p.price}
              originalPrice={p.originalPrice}
              imageUrl={p.images[0]}
              stock={p.stock}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
