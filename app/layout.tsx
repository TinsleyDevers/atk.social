import { Inter, Playfair_Display, Manrope } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import Script from "next/script";
import CookieBanner from "@/components/CookieBanner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata = {
  title: "ATK - Studios & Social",
  description:
    "ATK is a creative powerhouse combining content creation and game development.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <Script id="suppress-hydration-warning" strategy="beforeInteractive">
          {`
            (function() {
              const originalError = console.error;
              console.error = function(message) {
                if (message && 
                    typeof message === 'string' && 
                    (message.includes('Hydration failed') || 
                     message.includes('hydrated but some attributes') ||
                     message.includes('cz-shortcut-listen'))) {
                  return;
                }
                originalError.apply(console, arguments);
              };
            })();
          `}
        </Script>
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} ${manrope.variable} font-sans bg-black text-white`}
        suppressHydrationWarning
      >
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
