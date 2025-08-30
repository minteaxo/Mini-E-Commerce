"use client";
import Link from "next/link";
import { useCart } from "./hooks/cart";

export default function Header() {
  const { cartArray } = useCart();

  return (
    <header className="p-4 bg-blue-600 text-white flex justify-between">
      <h1 className="text-xl font-bold">My Shop</h1>
      <nav className="space-x-4">
        <Link href="/" className="hover:underline">
          Products
        </Link>
        <Link href="/cart" className="hover:underline">
          Cart {cartArray.length > 0 && `(${cartArray.length})`}
        </Link>
      </nav>
    </header>
  );
}
