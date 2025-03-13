"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import { motion } from "framer-motion";

interface SplitTextProps {
  children: ReactNode;
  delay?: number;
}

const SplitText = ({ children, delay = 0.3 }: SplitTextProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  const createSplitText = (text: string | ReactNode) => {
    if (!text) return [];

    const textContent = text.toString();

    return textContent.split("").map((char, index) => (
      <motion.span
        key={index}
        className="split-text-char inline-block"
        initial={{ y: 50, opacity: 0 }}
        animate={isVisible ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
        transition={{
          duration: 0.5,
          ease: "easeOut",
          delay: delay + index * 0.03,
        }}
      >
        {char === " " ? "\u00A0" : char}
      </motion.span>
    ));
  };

  return (
    <span ref={ref} className={`split-text ${isVisible ? "visible" : ""}`}>
      {createSplitText(children)}
    </span>
  );
};

export default SplitText;
