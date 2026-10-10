"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";

const ShopContext = createContext(null);

export function ShopProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [recent, setRecent] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setCart(JSON.parse(localStorage.getItem("farmora_cart")) || []);
      setWishlist(JSON.parse(localStorage.getItem("farmora_wishlist")) || []);
      setRecent(JSON.parse(localStorage.getItem("farmora_recent")) || []);
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => { if (ready) localStorage.setItem("farmora_cart", JSON.stringify(cart)); }, [cart, ready]);
  useEffect(() => { if (ready) localStorage.setItem("farmora_wishlist", JSON.stringify(wishlist)); }, [wishlist, ready]);
  useEffect(() => { if (ready) localStorage.setItem("farmora_recent", JSON.stringify(recent)); }, [recent, ready]);

  const toast = useCallback((message, type = "success") => {
    const id = Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  }, []);

  const finalPrice = (p) => +(p.price * (1 - (p.discount || 0) / 100)).toFixed(2);

  function addToCart(product, qty = 1) {
    setCart((c) => {
      const found = c.find((i) => i.productId === product.id);
      if (found) return c.map((i) => (i.productId === product.id ? { ...i, qty: Math.min(i.qty + qty, product.stock || 99) } : i));
      return [...c, {
        productId: product.id, name: product.name, price: finalPrice(product), image: product.image,
        unit: product.unit, farmerId: product.farmerId, stock: product.stock, qty,
      }];
    });
    toast(`${product.name} added to cart`);
  }

  const updateQty = (productId, qty) =>
    setCart((c) => c.map((i) => (i.productId === productId ? { ...i, qty: Math.max(1, Math.min(qty, i.stock || 99)) } : i)));
  const removeFromCart = (productId) => setCart((c) => c.filter((i) => i.productId !== productId));
  const clearCart = () => setCart([]);

  function toggleWishlist(product) {
    setWishlist((w) => {
      if (w.includes(product.id)) { toast("Removed from wishlist", "info"); return w.filter((x) => x !== product.id); }
      toast("Saved to wishlist");
      return [...w, product.id];
    });
  }

  const addRecent = useCallback((id) => setRecent((r) => [id, ...r.filter((x) => x !== id)].slice(0, 8)), []);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.qty * i.price, 0);

  return (
    <ShopContext.Provider value={{
      cart, addToCart, updateQty, removeFromCart, clearCart, cartCount, cartTotal,
      wishlist, toggleWishlist, recent, addRecent, toast, finalPrice,
    }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] space-y-2">
        {toasts.map((t) => (
          <div key={t.id} className={`animate-slide-up rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg ${t.type === "error" ? "bg-red-600" : t.type === "info" ? "bg-gray-800" : "bg-brand-600"}`}>
            {t.message}
          </div>
        ))}
      </div>
    </ShopContext.Provider>
  );
}

export const useShop = () => useContext(ShopContext);
