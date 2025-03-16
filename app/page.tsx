"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// Components
import Preloader from "@/components/Preloader";
import Cursor from "@/components/Cursor";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Brands from "@/components/Brands";
import Team from "@/components/Team";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  // State to control preloader
  const [loading, setLoading] = useState(true);

  // State to track if page is scrolled from the top
  const [isAtTop, setIsAtTop] = useState(true);

  // Handle preloader completion
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY < 50);
    };

    // Add scroll listener
    window.addEventListener("scroll", handleScroll);

    // Initial check
    handleScroll();

    // Set up intersection observer for reveal animations
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all elements with the "reveal" class
    document.querySelectorAll(".reveal").forEach((el) => {
      observer.observe(el);
    });

    // Cleanup
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Scroll progress for progress indicator
  const { scrollYProgress } = useScroll();
  const progressHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <>
      {loading && <Preloader onLoadingComplete={() => setLoading(false)} />}

      <Cursor />

      {/* Progress indicator (only shown when scrolled) */}
      {!isAtTop && (
        <motion.div
          className="fixed top-0 left-0 w-1 h-full bg-white z-50 origin-top"
          style={{ scaleY: progressHeight }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}

      <Navbar />

      <main>
        <Hero isLoading={loading} />
        <About />
        <Brands />
        <Team />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
