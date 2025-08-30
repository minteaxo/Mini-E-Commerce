"use client";

import { createContext, useContext, useState, useMemo, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartMap, setCartMap] = useState(new Map());
  const cartArray = useMemo(() => Array.from(cartMap.values()), [cartMap]);

  // Load cart from LocalStorage
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCartMap(new Map(parsed));
      } catch (e) {
        console.error("Failed to load cart from localStorage", e);
      }
    }
  }, []);

  useEffect(() => {
    if (cartMap.size > 0) {
      localStorage.setItem(
        "cart",
        JSON.stringify(Array.from(cartMap.entries()))
      );
    } else {
      localStorage.removeItem("cart"); // clear if empty
    }
  }, [cartMap]);

  const addToCart = (product) => {
    setCartMap((prev) => {
      const newCart = new Map(prev);
      newCart.set(product.id, { ...product, quantity: 1 });
      return newCart;
    });
  };

  const removeFromCart = (id) => {
    setCartMap((prev) => {
      const newCart = new Map(prev);
      newCart.delete(id);
      return newCart;
    });
  };

  const updateQuantity = (id, quantity) => {
    setCartMap((prev) => {
      const newCart = new Map(prev);
      if (newCart.has(id)) {
        if (quantity <= 0) {
          newCart.delete(id);
        } else {
          const product = newCart.get(id);
          newCart.set(id, { ...product, quantity });
        }
      }
      return newCart;
    });
  };

  return (
    <CartContext.Provider
      value={{ cartMap, cartArray, addToCart, removeFromCart, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Custom hook for easy access
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return ctx;
}
