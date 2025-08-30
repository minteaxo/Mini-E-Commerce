"use client";
import Image from "next/image";
import { useEffect, useState, useMemo } from "react";
import { useCart } from "./hooks/cart";

const urlProducts = "https://fakestoreapi.com/products";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(null);
  const { addToCart, cartMap, updateQuantity } = useCart();

  // Get Products
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await fetch(urlProducts);
        if (!response.ok) {
          throw new Error("Failed to fetch products, try again.");
        }
        const prods = await response.json();
        setProducts(prods);
      } catch (e) {
        console.error(e);
        setError(e || "Something went wrong, please refresh to try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Filter and sort
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search) {
      result = result.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sort === "asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "desc") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, search, sort]);

  const toggleSort = () => {
    if (sort === null) setSort("asc");
    else if (sort === "asc") setSort("desc");
    else setSort(null);
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <p className="text-gray-600 animate-pulse">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex flex-col justify-center items-center">
        <p className="text-gray-600 font-semibold">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Search bar */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-text"
        />

        <button
          onClick={toggleSort}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 cursor-pointer"
        >
          <span
            className={`transition-transform ${
              sort === "asc" ? "rotate-180" : ""
            }`}
          >
            ↑↓
          </span>
          {sort === null && <span>No Sort</span>}
          {sort === "asc" && <span>Price Low → High</span>}
          {sort === "desc" && <span>Price High → Low</span>}
        </button>
      </div>
      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const inCart = cartMap.get(product.id);
            return (
              <div
                key={product.id}
                className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-lg transition"
              >
                <div className="relative w-full h-48">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover"
                    priority={product.id === 1}
                  />
                </div>
                <div className="p-4 flex flex-col justify-between">
                  <h3 className="text-lg font-semibold">{product.title}</h3>
                  <p className="text-gray-600 mt-1">${product.price}</p>
                  {inCart ? (
                    <div className="mt-3 flex items-center justify-between">
                      <button
                        onClick={() =>
                          updateQuantity(product.id, inCart.quantity - 1)
                        }
                        className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-2">{inCart.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(product.id, inCart.quantity + 1)
                        }
                        className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(product)}
                      className="mt-3 bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition cursor-pointer"
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-6 flex justify-center items-center">
          <p className="text-gray-600">No products available...</p>
        </div>
      )}
    </div>
  );
}
