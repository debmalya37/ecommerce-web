"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    images: "",
    stock: "",
    category: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const formattedImages = newProduct.images.split(",").map((url) => {
        if (url.includes("drive.google.com")) {
          const fileIdMatch = url.match(/[-\w]{25,}/); // Extracts the file ID
          if (fileIdMatch) return `https://drive.google.com/thumbnail?id=${fileIdMatch[0]}&sz=w1000`;
        }
        return url; // Keep other URLs unchanged
      });
      
  
    try {
      await axios.post("/api/products", {
        ...newProduct,
        images: formattedImages,
      });
  
      setNewProduct({
        name: "",
        description: "",
        price: "",
        originalPrice: "",
        images: "",
        stock: "",
        category: "",
      });
      fetchProducts();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };
  

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Admin: Manage Products</h1>

      {/* Add New Product Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input name="name" placeholder="Product Name" value={newProduct.name} onChange={handleChange} required 
          className="p-3 border rounded-md focus:ring-2 focus:ring-blue-500 w-full" />
        
        <input name="category" placeholder="Category" value={newProduct.category} onChange={handleChange} required 
          className="p-3 border rounded-md focus:ring-2 focus:ring-blue-500 w-full" />

        <textarea name="description" placeholder="Description" value={newProduct.description} onChange={handleChange} required 
          className="p-3 border rounded-md focus:ring-2 focus:ring-blue-500 w-full md:col-span-2" />

        <input name="price" type="number" placeholder="Price" value={newProduct.price} onChange={handleChange} required 
          className="p-3 border rounded-md focus:ring-2 focus:ring-blue-500 w-full" />

        <input name="originalPrice" type="number" placeholder="Original Price" value={newProduct.originalPrice} onChange={handleChange} required 
          className="p-3 border rounded-md focus:ring-2 focus:ring-blue-500 w-full" />

        <input name="images" placeholder="Image URLs (comma-separated)" value={newProduct.images} onChange={handleChange} required 
          className="p-3 border rounded-md focus:ring-2 focus:ring-blue-500 w-full md:col-span-2" />

        <input name="stock" type="number" placeholder="Stock" value={newProduct.stock} onChange={handleChange} required 
          className="p-3 border rounded-md focus:ring-2 focus:ring-blue-500 w-full" />

        <button type="submit" className="bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 w-full md:col-span-2">
          Add Product
        </button>
      </form>

      {/* Display Existing Products */}
      <h2 className="text-2xl font-bold mt-10">Existing Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
        {products.map((product: any) => (
          <div key={product._id} className="border p-4 rounded-lg shadow-md">
            <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-40 object-contain rounded-md bg-gray-200"
                />

            <h3 className="font-bold mt-2">{product.name}</h3>
            <p className="text-gray-600">{product.category}</p>
            <p className="text-red-500">₹{product.price}</p>
            <p className="text-sm text-gray-500 line-through">₹{product.originalPrice}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
