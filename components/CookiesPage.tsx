"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  Variants,
} from "framer-motion";
import Link from "next/link";
import SplitText from "../utils/SplitText";
import { setCookie, getCookie, hasCookie } from "cookies-next";

// Custom typing for window object to include dataLayer
declare global {
  interface Window {
    dataLayer?: Array<
      | string
      | number
      | boolean
      | { [key: string]: unknown }
      | Array<string | number | boolean>
    >;
  }
}
// Cookie category type definition
interface CookieCategory {
  id: string;
  name: string;
  description: string;
  required: boolean;
  cookies: Cookie[];
}

// Cookie type definition
interface Cookie {
  name: string;
  purpose: string;
  duration: string;
  provider: string;
}

// Cookie utility functions
const COOKIE_CONSENT_KEY = "atk-cookie-consent";

// Function to load cookie preferences from browser
const loadCookiePreferences = () => {
  // Default state (only essential enabled)
  const defaultConsent = {
    essential: true, // Always required
    functional: false,
    analytics: false,
    marketing: false,
  };

  try {
    // Check if our preference cookie exists
    if (hasCookie(COOKIE_CONSENT_KEY)) {
      const savedPreferences = getCookie(COOKIE_CONSENT_KEY);
      if (savedPreferences) {
        // Parse the stored JSON string
        return {
          ...defaultConsent,
          ...JSON.parse(String(savedPreferences)),
        };
      }
    }
  } catch (error) {
    console.error("Error loading cookie preferences:", error);
  }

  return defaultConsent;
};

// Function to save preferences to cookie
const saveCookiePreferences = (preferences: Record<string, boolean>) => {
  // Set cookie that expires in 1 year
  setCookie(COOKIE_CONSENT_KEY, JSON.stringify(preferences), {
    maxAge: 365 * 24 * 60 * 60, // 1 year in seconds
    path: "/",
  });
};

// Function to apply preferences to services like Google Analytics
const applyPreferences = (preferences: Record<string, boolean>) => {
  // Handle Google Analytics if it's present
  if (typeof window !== "undefined") {
    // If analytics is disabled
    if (!preferences.analytics && window.dataLayer) {
      // Push GA opt-out flags
      window.dataLayer.push(["ga-disable-tracking", true]);
    }

    // If marketing cookies are disabled, we might want to turn off ad cookies
    if (!preferences.marketing) {
      // Disable marketing/ad cookies if applicable (IMPLEMENT LATER)
    }
  }
};

const CookiesPage = () => {
  const [activeCategory, setActiveCategory] = useState<string>("essential");
  const [cookieConsent, setCookieConsent] = useState({
    essential: true, // Always required
    functional: false,
    analytics: false,
    marketing: false,
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Load saved preferences on component mount
  useEffect(() => {
    const savedPreferences = loadCookiePreferences();
    setCookieConsent(savedPreferences);

    // Apply the loaded preferences to services
    applyPreferences(savedPreferences);
  }, []);

  // Scroll animations
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const headerY = useTransform(scrollYProgress, [0, 0.1], [0, -100]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  // Magnetic button effect interface
  interface MagneticButtonProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
  }

  // Magnetic button effect
  const MagneticButton = ({
    children,
    className,
    onClick,
  }: MagneticButtonProps) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!buttonRef.current) return;

      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;

      setPosition({
        x: distanceX * 0.2,
        y: distanceY * 0.2,
      });
    };

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 });
    };

    return (
      <motion.button
        ref={buttonRef}
        className={className}
        animate={{ x: position.x, y: position.y }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        data-cursor="magnetic"
      >
        {children}
      </motion.button>
    );
  };

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  // Cookie data
  const cookieCategories: CookieCategory[] = [
    {
      id: "essential",
      name: "Essential",
      description:
        "Essential cookies are necessary for the website to function properly. They cannot be disabled.",
      required: true,
      cookies: [
        {
          name: "session",
          purpose: "Maintains session state across page requests",
          duration: "Session",
          provider: "ATK",
        },
        {
          name: "XSRF-TOKEN",
          purpose: "Helps prevent cross-site request forgery attacks",
          duration: "Session",
          provider: "ATK",
        },
        {
          name: "cookie-consent",
          purpose: "Stores your cookie preferences",
          duration: "1 year",
          provider: "ATK",
        },
      ],
    },
    {
      id: "functional",
      name: "Functional",
      description:
        "Functional cookies enhance the usability and performance of the website.",
      required: false,
      cookies: [
        {
          name: "theme_preference",
          purpose: "Remembers your preferred theme setting",
          duration: "1 year",
          provider: "ATK",
        },
        {
          name: "recent_views",
          purpose: "Tracks recently viewed content for improved navigation",
          duration: "30 days",
          provider: "ATK",
        },
      ],
    },
    {
      id: "analytics",
      name: "Analytics",
      description:
        "Analytics cookies help us understand how visitors interact with our website.",
      required: false,
      cookies: [
        {
          name: "_ga",
          purpose: "Registers a unique ID used to generate statistical data",
          duration: "2 years",
          provider: "Google",
        },
        {
          name: "_gid",
          purpose: "Registers a unique ID used to generate statistical data",
          duration: "24 hours",
          provider: "Google",
        },
        {
          name: "_gat",
          purpose: "Used to throttle request rate",
          duration: "1 minute",
          provider: "Google",
        },
      ],
    },
    {
      id: "marketing",
      name: "Marketing",
      description:
        "Marketing cookies are used to track visitors across websites to display relevant advertisements.",
      required: false,
      cookies: [
        {
          name: "_fbp",
          purpose: "Used by Facebook to deliver advertisements",
          duration: "3 months",
          provider: "Facebook",
        },
        {
          name: "ads/ga-audiences",
          purpose: "Used by Google AdWords to re-engage visitors",
          duration: "Session",
          provider: "Google",
        },
      ],
    },
  ];

  // Handle toggle changes
  const handleToggleChange = (categoryId: string) => {
    if (categoryId === "essential") return; // Cannot toggle essential cookies

    setCookieConsent((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId as keyof typeof prev],
    }));
  };

  // Handle all accept
  const handleAcceptAll = () => {
    const allConsent = {
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
    };

    // Update state
    setCookieConsent(allConsent);

    // Save to cookie
    saveCookiePreferences(allConsent);

    // Apply preferences to services
    applyPreferences(allConsent);

    // Show confirmation toast
    showToastMessage("All cookies have been accepted");
  };

  // Display a toast message
  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);

    // Auto-hide toast after 3 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // Handle save preferences
  const handleSavePreferences = () => {
    // Save to cookie
    saveCookiePreferences(cookieConsent);

    // Apply preferences to services
    applyPreferences(cookieConsent);

    // Show confirmation toast
    showToastMessage("Your cookie preferences have been saved");
  };

  // Find active category data
  const activeCategoryData = cookieCategories.find(
    (category) => category.id === activeCategory
  );

  return (
    <section
      id="cookies"
      ref={sectionRef}
      className="min-h-screen py-32 md:py-40 relative overflow-hidden bg-black"
    >
      {/* Background elements */}
      <div className="absolute inset-0 noise-texture opacity-30 z-10"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-white/10 z-20"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-white/10 z-20"></div>

      {/* Ambient light effects */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-3xl bg-white/3 rounded-full blur-[100px] opacity-20"></div>

      {/* Grid background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZGVmcz4KPHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxwYXRoIGQ9Ik0gNTAgMCBMIDAgMCAwIDUwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiIHN0cm9rZS13aWR0aD0iMSIvPgo8L3BhdHRlcm4+CjwvZGVmcz4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIgLz4KPC9zdmc+')] opacity-20 pointer-events-none z-10"></div>

      {/* Vertical lines */}
      <div className="absolute inset-y-0 left-1/4 w-px bg-white/5 z-20"></div>
      <div className="absolute inset-y-0 right-1/4 w-px bg-white/5 z-20"></div>

      {/* Back to home button */}
      <div className="fixed top-24 left-8 z-30">
        <motion.a
          href="/"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-2 text-white/80 hover:text-white group transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transform group-hover:-translate-x-1 transition-transform"
          >
            <path d="M19 12H5"></path>
            <path d="M12 19l-7-7 7-7"></path>
          </svg>
          <span className="relative">
            Back to Home
            <span className="absolute bottom-0 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300"></span>
          </span>
        </motion.a>
      </div>

      <div className="container mx-auto px-6 relative z-30">
        {/* Header with animated text */}
        <motion.div
          ref={headerRef}
          style={{ y: headerY, opacity: headerOpacity }}
          className="mb-16 md:mb-24 text-center"
        >
          <h3 className="text-sm uppercase tracking-[0.2em] text-gray-500 mb-3">
            <SplitText>Privacy Settings</SplitText>
          </h3>

          <motion.h1
            className="text-5xl md:text-7xl font-bold playfair tracking-tighter mb-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 6, ease: [0.16, 1, 0.3, 1] }}
          >
            Cookie Policy
          </motion.h1>

          <motion.div
            className="h-px w-40 mx-auto bg-gradient-to-r from-purple-500 via-white to-blue-500 mb-8"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 4, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
          />

          <motion.p
            className="text-xl max-w-2xl mx-auto manrope text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Control how we use cookies to enhance your experience on the ATK
            website
          </motion.p>
        </motion.div>

        {/* Main content */}
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {/* Categories sidebar */}
            <motion.div variants={itemVariants}>
              <div className="bg-black/20 border border-white/10 p-6">
                <h3 className="text-xl font-bold mb-6 playfair">Categories</h3>

                <ul className="space-y-1">
                  {cookieCategories.map((category) => (
                    <li key={category.id}>
                      <button
                        className={`w-full text-left p-4 transition-colors ${
                          activeCategory === category.id
                            ? "bg-white/10 text-white"
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                        }`}
                        onClick={() => setActiveCategory(category.id)}
                        data-cursor="link"
                      >
                        <div className="flex justify-between items-center">
                          <span>{category.name}</span>
                          {category.required && (
                            <span className="text-xs uppercase bg-white/10 px-2 py-1 rounded-sm">
                              Required
                            </span>
                          )}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 pt-8 border-t border-white/10">
                  <p className="text-sm text-gray-400 mb-6">
                    This website uses cookies to enhance your browsing
                    experience. You can manage your preferences at any time.
                  </p>

                  <div className="flex flex-col space-y-3">
                    <MagneticButton
                      className="w-full bg-white text-black font-medium py-3 px-4 transition-all hover:bg-gray-200"
                      onClick={handleAcceptAll}
                    >
                      Accept All
                    </MagneticButton>

                    <MagneticButton
                      className="w-full bg-transparent border border-white text-white font-medium py-3 px-4 transition-all hover:bg-white/5"
                      onClick={handleSavePreferences}
                    >
                      Save Preferences
                    </MagneticButton>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Category details */}
            <motion.div variants={itemVariants} className="md:col-span-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-black/20 border border-white/10 p-8"
                >
                  {activeCategoryData && (
                    <>
                      <div className="flex justify-between items-center mb-8">
                        <h3 className="text-2xl font-bold playfair text-white">
                          {activeCategoryData.name} Cookies
                        </h3>

                        <div className="flex items-center">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={
                                cookieConsent[
                                  activeCategory as keyof typeof cookieConsent
                                ]
                              }
                              onChange={() =>
                                handleToggleChange(activeCategory)
                              }
                              disabled={activeCategoryData.required}
                              className="sr-only peer"
                            />
                            <div
                              className={`relative w-11 h-6 rounded-full peer-focus:ring-1 peer-focus:ring-white/30 ${
                                activeCategoryData.required
                                  ? "bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-50"
                                  : cookieConsent[
                                      activeCategory as keyof typeof cookieConsent
                                    ]
                                  ? "bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"
                                  : "bg-gray-700"
                              } peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all`}
                            ></div>
                          </label>
                        </div>
                      </div>

                      <p className="text-gray-300 mb-8">
                        {activeCategoryData.description}
                      </p>

                      {/* Cookies table */}
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-white/10">
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                                Name
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                                Purpose
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                                Duration
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                                Provider
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {activeCategoryData.cookies.map((cookie, index) => (
                              <tr
                                key={cookie.name}
                                className={
                                  index < activeCategoryData.cookies.length - 1
                                    ? "border-b border-white/5"
                                    : ""
                                }
                              >
                                <td className="py-4 px-4 text-white">
                                  {cookie.name}
                                </td>
                                <td className="py-4 px-4 text-gray-400">
                                  {cookie.purpose}
                                </td>
                                <td className="py-4 px-4 text-gray-400">
                                  {cookie.duration}
                                </td>
                                <td className="py-4 px-4 text-gray-400">
                                  {cookie.provider}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Category-specific details */}
                      <div className="mt-8 pt-8 border-t border-white/10">
                        <h4 className="text-lg font-bold mb-4">
                          {activeCategoryData.name === "Essential"
                            ? "Why are these cookies necessary?"
                            : `Why we use ${activeCategoryData.name.toLowerCase()} cookies`}
                        </h4>

                        <p className="text-gray-400">
                          {activeCategoryData.id === "essential" &&
                            "These cookies are essential for the website to function properly. They enable core functionality such as security, network management, and account access. The website cannot function properly without these cookies, and they can only be disabled by changing your browser settings."}
                          {activeCategoryData.id === "functional" &&
                            "Functional cookies enable us to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages. If you disable these cookies, some or all of these features may not function properly."}
                          {activeCategoryData.id === "analytics" &&
                            "Analytics cookies help us understand how visitors interact with our website. They help us measure the number of visitors and see how visitors move around our website when they are using it. This helps us improve our website. All information these cookies collect is aggregated and therefore anonymous."}
                          {activeCategoryData.id === "marketing" &&
                            "Marketing cookies track your online activity to help advertisers deliver more relevant advertising or to limit how many times you see an ad. These cookies can share that information with other organizations or advertisers. This is a type of 'behavioral advertising'."}
                        </p>
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </motion.div>

          {/* Additional information */}
          <motion.div
            className="mt-16 bg-black/20 border border-white/10 p-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl font-bold playfair mb-6">
              Additional Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-bold mb-3">
                  How to manage cookies
                </h4>
                <p className="text-gray-400 mb-4">
                  In addition to the controls we provide, you can choose to
                  enable or disable cookies in your browser settings. Most web
                  browsers automatically accept cookies, but you can modify your
                  browser settings to decline cookies if you prefer.
                </p>
                <p className="text-gray-400">
                  For more information about cookies and how to manage them,
                  visit{" "}
                  <a
                    href="https://www.allaboutcookies.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors underline"
                  >
                    www.allaboutcookies.org
                  </a>
                  .
                </p>
              </div>

              <div>
                <h4 className="text-lg font-bold mb-3">Privacy Policy</h4>
                <p className="text-gray-400 mb-4">
                  Our Privacy Policy explains how we collect and use information
                  from and about you when you visit our website, use our
                  services, or otherwise interact with us.
                </p>
                <p className="text-gray-400">
                  You can learn more by visiting our{" "}
                  <Link
                    href="/privacy"
                    className="text-blue-400 hover:text-blue-300 transition-colors underline"
                  >
                    Privacy Policy
                  </Link>{" "}
                  page.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10">
              <p className="text-sm text-gray-500">
                Last updated: March 12, 2025
              </p>
            </div>
          </motion.div>

          {/* Back to home link */}
          <div className="mt-16 text-center">
            <Link
              href="/"
              className="inline-flex items-center text-white hover:text-blue-400 transition-colors"
              data-cursor="magnetic"
            >
              <svg
                className="w-4 h-4 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 12H5M5 12L12 19M5 12L12 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Toast notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            className="fixed bottom-8 right-8 bg-white text-black px-6 py-4 rounded shadow-lg z-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-3 text-green-500"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 13L10 16L17 9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{toastMessage}</span>
              <button
                className="ml-4 text-gray-500 hover:text-gray-700"
                onClick={() => setShowToast(false)}
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default CookiesPage;
