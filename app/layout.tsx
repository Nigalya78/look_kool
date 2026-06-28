import type { Metadata } from "next";
import { Inter, Playfair_Display, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/shared/providers";
import { ShopShell } from "@/components/shared/shop-shell";

// Premium Typography
const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"], 
  variable: "--font-cormorant",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "LookKool — Premium Women's Fashion Boutique",
    template: "%s | LookKool",
  },
  description:
    "Shop premium women's fashion, ethnic wear, western outfits and more. Based in India, delivering quality fashion across the country.",
  keywords: ["women's fashion", "ethnic wear", "western wear", "boutique", "indian fashion", "designer wear"],
  icons: {
    icon: "/lookkool_logo.png",
    shortcut: "/lookkool_logo.png",
    apple: "/lookkool_logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://lookkool.in",
    siteName: "LookKool",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} ${cormorant.variable} font-sans antialiased flex flex-col min-h-screen bg-white`}>
        <Providers>
          <ShopShell>{children}</ShopShell>
        </Providers>
      </body>
    </html>
  );
}
