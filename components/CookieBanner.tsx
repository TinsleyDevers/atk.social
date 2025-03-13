"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { hasCookie, setCookie, getCookie } from "cookies-next";

// Cookie utility functions
const COOKIE_CONSENT_KEY = "atk-cookie-consent";

// Function to load cookie preferences
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
    // If analytics is disabled, we might want to disable GA tracking
    if (!preferences.analytics && window.dataLayer) {
      // Push GA opt-out flags
      window.dataLayer.push(["ga-disable-tracking", true]);
    }

    // If marketing cookies are disabled, we might want to turn off ad cookies
    if (!preferences.marketing) {
      // Disable marketing/ad cookies if applicable
      // This is specific to each marketing service you use
    }
  }
};

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

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  // Add a state to track the actual preferences
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [preferences, setPreferences] = useState({
    essential: true,
    functional: false,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Load existing preferences and show banner if consent hasn't been given
    const checkCookieConsent = () => {
      const hasConsent = hasCookie(COOKIE_CONSENT_KEY);

      // Use the loadCookiePreferences function to get saved preferences
      const savedPreferences = loadCookiePreferences();
      setPreferences(savedPreferences);

      setIsVisible(!hasConsent);
    };

    // Check after a short delay to ensure page has loaded
    const timer = setTimeout(() => {
      checkCookieConsent();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleAcceptAll = () => {
    const allConsent = {
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
    };

    // Update state with new preferences
    setPreferences(allConsent);

    // Save to cookie
    saveCookiePreferences(allConsent);

    // Apply preferences
    applyPreferences(allConsent);

    // Hide banner
    setIsVisible(false);
  };

  const handleEssentialOnly = () => {
    const minimalConsent = {
      essential: true,
      functional: false,
      analytics: false,
      marketing: false,
    };

    // Update state with new preferences
    setPreferences(minimalConsent);

    // Save to cookie
    saveCookiePreferences(minimalConsent);

    // Apply preferences
    applyPreferences(minimalConsent);

    // Hide banner
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-t border-white/10"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="container mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2 playfair">
                  Cookie Preferences
                </h3>
                <p className="text-gray-400 text-sm">
                  We use cookies to enhance your experience on our website. You
                  can choose to accept all cookies or manage your preferences.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/cookies"
                  className="px-4 py-2 border border-white/20 text-white text-sm hover:bg-white/5 transition-colors"
                  data-cursor="magnetic"
                >
                  Manage Preferences
                </Link>

                <button
                  onClick={handleEssentialOnly}
                  className="px-4 py-2 border border-white/20 text-white text-sm hover:bg-white/5 transition-colors"
                  data-cursor="magnetic"
                >
                  Essential Only
                </button>

                <button
                  onClick={handleAcceptAll}
                  className="px-4 py-2 bg-white text-black text-sm hover:bg-gray-200 transition-colors"
                  data-cursor="magnetic"
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieBanner;
