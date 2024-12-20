"use client";
import { useState, useEffect } from 'react';

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    // Retrieve cart data from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      // Check if item already exists in the cart
      const existingItemIndex = prev.findIndex((i) => i.id === item.id);
      let updatedCart = [...prev];

      if (existingItemIndex >= 0) {
        updatedCart[existingItemIndex].quantity += item.quantity;
      } else {
        updatedCart.push(item);
      }

      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const updatedCart = prev.filter((item) => item.id !== id);
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  return { cart, addToCart, removeFromCart };
}
