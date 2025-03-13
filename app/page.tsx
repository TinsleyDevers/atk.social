"use client";

import { useState, useEffect } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";

import Preloader from "@/components/Preloader";
import Cursor from "@/components/Cursor";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import AtkSocial from "@/components/AtkSocial";
import AtkStudios from "@/components/AtkStudios";
import Brands from "@/components/Brands";
import Team from "@/components/Team";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Track scroll position to determine if at top
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsAtTop(scrollPosition < 50); // Consider "at top" if less than 50px scrolled
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Initial check
    handleScroll();

    // More efficient approach with Intersection Observer API
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

    document.querySelectorAll(".reveal").forEach((el) => {
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const { scrollYProgress } = useScroll();
  const progressHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <>
      <AnimatePresence mode="wait">{loading && <Preloader />}</AnimatePresence>

      <Cursor />

      {/* Progress indicator that's hidden when at the top */}
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
        <AtkSocial />
        <AtkStudios />
        <Brands />
        <Team />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
