"use client";

import { useCart } from "../hooks/cart";
import Image from "next/image";

export default function CartPage() {
  const { cartArray, removeFromCart, updateQuantity } = useCart();
  let total = 0;
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
      {cartArray.length === 0 ? (
        <div className="p-6 text-center text-gray-500">Your cart is empty.</div>
      ) : (
        <>
          <div className="space-y-4">
            {cartArray.map((item) => {
              total += item.price * item.quantity;
              return (
                <div
                  key={item.id}
                  className="flex items-center bg-white shadow rounded-xl p-4"
                >
                  {/* Image */}
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-contain"
                    />
                  </div>

                  {/* Info */}
                  <div className="ml-4 flex-1">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-gray-600">${item.price.toFixed(2)}</p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, Math.max(item.quantity - 1, 1))
                      }
                      className="px-2 py-1 bg-gray-200 rounded cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1 bg-gray-200 rounded cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="ml-4 text-red-500 hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>

          {/* Total */}
          <div className="mt-6 text-right">
            <h3 className="text-xl font-bold">Total: ${total.toFixed(2)}</h3>
          </div>
        </>
      )}
    </div>
  );
}
