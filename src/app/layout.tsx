import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MintMark™ — The Coin Collector's First Call",
    template: "%s | MintMark™",
  },
  description:
    "Type in any US coin and instantly get every known error, variety, key date status, grade ceiling, and estimated value range. Powered by AI.",
  keywords: ["coin collecting", "numismatics", "coin errors", "coin varieties", "key dates", "PCGS", "NGC", "coin grading"],
  openGraph: {
    type: "website",
    siteName: "MintMark™",
    title: "MintMark™ — The Coin Collector's First Call",
    description: "Type in any US coin. Get instant AI analysis — errors, varieties, key dates, grade ceiling, and value range.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0B",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        // MintMark is dark-first — force .dark so shadcn components render
        // against our brand token values, not the shadcn light defaults
        className={`${inter.variable} ${playfair.variable} dark h-full antialiased`}
      >
        <body className="min-h-full flex flex-col bg-background text-foreground">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
