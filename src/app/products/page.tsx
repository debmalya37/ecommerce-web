"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "@/components/ProductCard";

export default function ProductPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);

  // Fetch products and categories when component mounts
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

    // Update filteredProducts whenever products, selectedCategory, or searchTerm changes
    useEffect(() => {
      let tempProducts = products;
  
      // Filter by category if a specific category is selected (not "All")
      if (selectedCategory !== "All") {
        tempProducts = tempProducts.filter((product) => {
          // Replace spaces with hyphen and convert to lowercase
          const productCat = product.category.toLowerCase().replace(/\s+/g, '-');
          const selectedCat = selectedCategory.toLowerCase().replace(/\s+/g, '-');
          return productCat === selectedCat;
        });
      }
  

    // Filter by search term on product name or description (case-insensitive)
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      tempProducts = tempProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term)
      );
    }
    setFilteredProducts(tempProducts);
  }, [products, selectedCategory, searchTerm]);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const response = await axios.get("/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-blue-100">
      {/* Filter Section */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Category Filter */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="mt-1 block w-full sm:w-48 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search Box */}
        <div className="w-full sm:w-64">
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700"
          >
            Search Products
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title or description"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product: any) => (
          <ProductCard
            key={product._id}
            id={product._id}
            name={product.name}
            description={product.description}
            price={product.price}
            originalPrice={product.originalPrice}
            imageUrl={product.images[0]}
            stock={product.stock}
          />
        ))}
      </div>
    </div>
  );
}
