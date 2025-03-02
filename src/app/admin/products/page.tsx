"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import Loader from "@/components/Loader"; // Import your Loader component

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Main product fields
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    images: "",
    stock: "",
    category: "",
  });

  // Local state to hold color variants
  const [newVariants, setNewVariants] = useState<any[]>([]);
  const [variantInput, setVariantInput] = useState({
    color: "",
    images: "",
    stock: "",
  });

  // Fetch all products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchProducts(), fetchCategories()]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  // Update the newProduct fields
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  // Update the variant input fields
  const handleVariantChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setVariantInput((prev) => ({ ...prev, [name]: value }));
  };

  // Add a variant to the local array
  const handleAddVariant = () => {
    if (!variantInput.color || !variantInput.images) {
      return alert("Please fill in the color and images for the variant.");
    }
    setNewVariants((prev) => [...prev, variantInput]);
    // Reset the input fields
    setVariantInput({ color: "", images: "", stock: "" });
  };

  // Remove a variant from the local array
  const handleRemoveVariant = (index: number) => {
    setNewVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Format the main images
    const formattedImages = newProduct.images
      .split(",")
      .map((url) => url.trim())
      .map((url) => {
        // Example: transform Google Drive links
        if (url.includes("drive.google.com")) {
          const fileIdMatch = url.match(/[-\w]{25,}/);
          if (fileIdMatch) {
            return `https://drive.google.com/thumbnail?id=${fileIdMatch[0]}&sz=w1000`;
          }
        }
        return url;
      });

    // Format each variant's images similarly
    const formattedVariants = newVariants.map((variant) => {
      const variantImages = variant.images
        .split(",")
        .map((u: string) => u.trim())
        .map((u: string) => {
          if (u.includes("drive.google.com")) {
            const fileIdMatch = u.match(/[-\w]{25,}/);
            if (fileIdMatch) {
              return `https://drive.google.com/thumbnail?id=${fileIdMatch[0]}&sz=w1000`;
            }
          }
          return u;
        });
      return {
        color: variant.color,
        images: variantImages,
        stock: parseInt(variant.stock) || 0,
      };
    });

    try {
      await axios.post("/api/products", {
        ...newProduct,
        images: formattedImages,
        stock: parseInt(newProduct.stock) || 0,
        // Attach the array of variants
        variants: formattedVariants,
      });
      // Reset form
      setNewProduct({
        name: "",
        description: "",
        price: "",
        originalPrice: "",
        images: "",
        stock: "",
        category: "",
      });
      setNewVariants([]);
      // Reload product list
      fetchProducts();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/products?id=${id}`);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Admin: Manage Products
      </h1>

      {/* Form to add a product */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          name="name"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={handleChange}
          required
          className="p-3 border rounded-md w-full"
        />
        <select
          title="Category"
          name="category"
          value={newProduct.category}
          onChange={handleChange}
          required
          className="p-3 border rounded-md w-full"
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category._id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>

        <textarea
          name="description"
          placeholder="Description"
          value={newProduct.description}
          onChange={handleChange}
          required
          className="p-3 border rounded-md w-full md:col-span-2"
        />

        <input
          name="price"
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={handleChange}
          required
          className="p-3 border rounded-md w-full"
        />
        <input
          name="originalPrice"
          type="number"
          placeholder="Original Price"
          value={newProduct.originalPrice}
          onChange={handleChange}
          required
          className="p-3 border rounded-md w-full"
        />

        <input
          name="images"
          placeholder="Image URLs (comma-separated)"
          value={newProduct.images}
          onChange={handleChange}
          required
          className="p-3 border rounded-md w-full md:col-span-2"
        />
        <input
          name="stock"
          type="number"
          placeholder="Stock"
          value={newProduct.stock}
          onChange={handleChange}
          required
          className="p-3 border rounded-md w-full"
        />

        {/* Variant Input Fields */}
        <div className="md:col-span-2 border p-4 rounded-md">
          <h3 className="font-bold mb-2">Add Color Variants (Optional)</h3>
          <div className="flex flex-col md:flex-row gap-2 mb-2">
            <input
              type="text"
              name="color"
              placeholder="Color Name"
              value={variantInput.color}
              onChange={handleVariantChange}
              className="p-2 border rounded-md w-full md:w-1/4"
            />
            <input
              type="text"
              name="images"
              placeholder="Variant Images (comma-separated)"
              value={variantInput.images}
              onChange={handleVariantChange}
              className="p-2 border rounded-md w-full md:w-1/2"
            />
            <input
              type="number"
              name="stock"
              placeholder="Variant Stock"
              value={variantInput.stock}
              onChange={handleVariantChange}
              className="p-2 border rounded-md w-full md:w-1/4"
            />
            <button
              type="button"
              onClick={handleAddVariant}
              className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
            >
              + Add Variant
            </button>
          </div>

          {/* Display list of added variants */}
          {newVariants.length > 0 && (
            <ul className="mt-2 space-y-2">
              {newVariants.map((variant, idx) => (
                <li key={idx} className="flex items-center justify-between border p-2 rounded">
                  <span>
                    <strong>Color:</strong> {variant.color} |{" "}
                    <strong>Images:</strong> {variant.images} |{" "}
                    <strong>Stock:</strong> {variant.stock}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(idx)}
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white py-3 rounded-md font-semibold w-full md:col-span-2 hover:bg-blue-700"
        >
          Add Product
        </button>
      </form>

      {/* Existing Products Section */}
      <h2 className="text-2xl font-bold mt-10">Existing Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
        {products.map((product: any) => (
          <div key={product._id} className="border p-4 rounded-lg shadow-md">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-40 object-cover rounded-md bg-gray-200"
            />
            <h3 className="font-bold mt-2">{product.name}</h3>
            <p className="text-gray-600">{product.category}</p>
            <p className="text-red-500">₹{product.price}</p>
            <p className="text-sm text-gray-500 line-through">₹{product.originalPrice}</p>
            {product.stock === 0 ? (
              <p className="text-red-500 font-bold">Out of Stock</p>
            ) : (
              <p className="text-green-600">In Stock: {product.stock}</p>
            )}

            {/* If variants exist, show them */}
            {product.variants && product.variants.length > 0 && (
              <div className="mt-3 border-t pt-2">
                <p className="font-semibold">Color Variants:</p>
                {product.variants.map((variant: any, idx: number) => (
                  <div key={idx} className="pl-2">
                    <p className="font-medium">Color: {variant.color}</p>
                    <p>Stock: {variant.stock}</p>
                    {/* Show the first variant image as a preview, or more if you like */}
                    {variant.images && variant.images.length > 0 && (
                      <img
                        src={variant.images[0]}
                        alt={variant.color}
                        className="w-20 h-20 object-cover rounded border"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => handleDelete(product._id)}
              className="mt-2 bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
