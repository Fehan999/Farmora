import "./globals.css";
import { Suspense } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { ShopProvider } from "@/context/ShopContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SplashScreen from "@/components/SplashScreen";
import RouteProgress from "@/components/RouteProgress";
import { AUTHOR, DEFAULT_TITLE, KEYWORDS, SITE_DESCRIPTION, SITE_NAME, SITE_URL, THEME_COLOR, TITLE_TEMPLATE, siteJsonLd, toJsonLd } from "@/lib/seo";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: DEFAULT_TITLE, template: TITLE_TEMPLATE },
  description: SITE_DESCRIPTION,
  keywords: KEYWORDS,
  authors: [{ name: AUTHOR.name, url: AUTHOR.url }],
  creator: AUTHOR.name,
  publisher: AUTHOR.name,
  applicationName: SITE_NAME,
  category: "shopping",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    url: "/",
    title: { default: DEFAULT_TITLE, template: TITLE_TEMPLATE },
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: { default: DEFAULT_TITLE, template: TITLE_TEMPLATE },
    description: SITE_DESCRIPTION,
    creator: AUTHOR.name,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  formatDetection: { email: false, address: false, telephone: false },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: ["/icon.svg"],
    apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: SITE_NAME, statusBarStyle: "default" },
};

export const viewport = {
  themeColor: THEME_COLOR,
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://images.pexels.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://images.pexels.com" />
        <link rel="preconnect" href="https://randomuser.me" crossOrigin="" />
        <link rel="author" type="text/plain" href="/humans.txt" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(siteJsonLd()) }} />
      </head>
      <body className="flex min-h-screen flex-col">
        <SplashScreen />
        <AuthProvider>
          <ShopProvider>
            <Suspense fallback={null}>
              <RouteProgress />
            </Suspense>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </ShopProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
