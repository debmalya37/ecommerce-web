"use client";
import { useState, useEffect } from "react";
import axios from "axios";

type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

export function useCart(userEmail: string) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    if (!userEmail) return;

    axios.get(`/api/cart?email=${userEmail}`).then((res) => {
      setCart(res.data.cart);
    });
  }, [userEmail]);

  const updateCart = async (newCart: CartItem[]) => {
    setCart(newCart);
    await axios.post("/api/cart", { email: userEmail, cartItems: newCart });
  };

  const addToCart = async (item: CartItem) => {
    const updatedCart = [...cart, item];
    await updateCart(updatedCart);
  };

  const removeFromCart = async (productId: string) => {
    const updatedCart = cart.filter((item) => item.productId !== productId);
    await updateCart(updatedCart);
  };

  return { cart, addToCart, removeFromCart };
}
