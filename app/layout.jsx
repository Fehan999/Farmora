import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ShopProvider } from "@/context/ShopContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Farmora | From Local Farms to Your Door",
  description: "Farmora connects local farmers with buyers. Fresh produce delivered to your door in 3 days. Designed & developed by Ehan Siddique.",
  authors: [{ name: "Ehan Siddique" }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://images.pexels.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://images.pexels.com" />
        <link rel="preconnect" href="https://randomuser.me" crossOrigin="" />
      </head>
      <body className="flex min-h-screen flex-col">
        <AuthProvider>
          <ShopProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </ShopProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
