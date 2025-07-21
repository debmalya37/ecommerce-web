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

  // fetch data
  useEffect(() => {
    axios.get("/api/products").then(r => setProducts(r.data));
    axios.get("/api/categories").then(r => setCategories(r.data.map((c: any) => c.name)));
  }, []);

  // pick up ?category=
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  // filter logic
  useEffect(() => {
    let tmp = [...products];
    if (selectedCategory !== "All")
      tmp = tmp.filter(p => p.category === selectedCategory);
    if (searchTerm.trim())
      tmp = tmp.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    setFiltered(tmp);
  }, [products, selectedCategory, searchTerm]);

  if (!products.length) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-12 lg:px-24">
      
      {/* Search Box */}
      <div className="relative flex-1">
          <HiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search products..."
            className="
              w-2/5 pl-10 pr-4 py-2 rounded-full bg-white shadow-sm
              focus:outline-none focus:ring-2 focus:ring-purple-500
              placeholder-gray-400 text-gray-800
            "
          />
        </div>
      {/* — Filters */}

      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
        {/* Category Pills */}
        <div className="flex overflow-x-auto space-x-2 scrollbar-hide py-2">
          {["All", ...categories].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`
                flex-shrink-0 px-4 py-2 rounded-full font-medium
                ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                    : "bg-white text-gray-700 ring-1 ring-gray-200 hover:ring-purple-500"
                }
                transition
              `}
            >
              {cat}
            </button>
          ))}
        </div>

        
      </div>

      {/* — Products Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.05 }
          }
        }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {filtered.map(p => (
          <motion.div key={p._id} variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}>
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
