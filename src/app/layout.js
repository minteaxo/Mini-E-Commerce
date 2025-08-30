import "./globals.css";
import { CartProvider } from "./hooks/cart";
import Header from "./header";

export const metadata = {
  title: "Mini E-Commerce",
  description: "A mini e-commerce store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <CartProvider>
          <Header />
          <main className="p-6">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
