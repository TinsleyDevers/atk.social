"use client";

import { useState, useEffect, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion";
import Image from "next/image";

interface PreloaderProps {
  onLoadingComplete?: () => void;
}

/**
 * Animated preloader component that displays a loading screen while the app initializes
 */
const Preloader: React.FC<PreloaderProps> = ({ onLoadingComplete }) => {
  // Core states
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  // Animation controls
  const overlayControls = useAnimation();
  const progressVal = useMotionValue(0);
  const progressOpacity = useTransform(progressVal, [0, 100], [1, 0]);

  // Words to display in rotation
  const words = ["Social", "Studios"];

  // Handle the word rotation animation
  useEffect(() => {
    const wordInterval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }, 1000);

    return () => clearInterval(wordInterval);
  }, [words.length]);

  // Handle the exit animation sequence
  const handleExit = useCallback(async () => {
    setIsExiting(true);

    await overlayControls.start({
      y: "-100%",
      transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] },
    });

    if (onLoadingComplete) {
      onLoadingComplete();
    }
  }, [overlayControls, onLoadingComplete]);

  // Main loading logic
  useEffect(() => {
    // Skip if already exiting
    if (isExiting) return;

    // Track page load status
    let pageLoaded = false;
    const markAsLoaded = () => {
      pageLoaded = true;
    };

    // Check if page is already loaded
    if (document.readyState === "complete") {
      markAsLoaded();
    } else {
      window.addEventListener("load", markAsLoaded);
    }

    // Create loading animation
    const simulateProgress = () => {
      let currentProgress = 0;
      let loadingSpeed = 1;

      const progressInterval = setInterval(() => {
        // Adjust speed based on actual load state
        if (pageLoaded && currentProgress < 70) {
          loadingSpeed = 2;
        } else if (!pageLoaded && currentProgress > 80) {
          loadingSpeed = 0.5;
        } else if (currentProgress > 80) {
          loadingSpeed = 0.7;
        } else if (currentProgress > 50) {
          loadingSpeed = 1.2;
        }

        // Calculate increment with natural slowdown
        let increment;
        if (currentProgress < 30) {
          increment = Math.random() * 2 + 1;
        } else if (currentProgress < 80) {
          increment = Math.random() * 1.5 + 0.4;
        } else {
          increment = Math.random() * 0.7 + 0.2;
        }

        // Apply speed modifier
        increment *= loadingSpeed;

        // Update progress
        currentProgress = Math.min(100, currentProgress + increment);
        setProgress(Math.floor(currentProgress));
        progressVal.set(Math.floor(currentProgress));

        // Complete at 100%
        if (currentProgress >= 100) {
          clearInterval(progressInterval);

          // Short delay before starting exit
          setTimeout(() => {
            handleExit();
          }, 800);
        }
      }, 50);

      return progressInterval;
    };

    // Slight delay before starting progress
    const initialDelay = setTimeout(() => {
      const progressInterval = simulateProgress();
      return () => clearInterval(progressInterval);
    }, 800);

    // Cleanup
    return () => {
      clearTimeout(initialDelay);
      window.removeEventListener("load", markAsLoaded);
    };
  }, [isExiting, progressVal, handleExit]);

  // Text animation variants
  const letterVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.04,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
    exit: (i: number) => ({
      y: -40,
      opacity: 0,
      transition: {
        delay: i * 0.01,
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <AnimatePresence>
      {!isExiting || progress < 100 ? (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {/* Background elements */}
          <div className="absolute inset-0 bg-[#050505] z-0">
            <div className="absolute inset-y-0 left-1/4 w-px bg-white/5"></div>
            <div className="absolute inset-y-0 right-1/4 w-px bg-white/5"></div>
          </div>

          {/* Slide-away overlay for exit animation */}
          <motion.div
            className="absolute inset-0 bg-black z-30"
            initial={{ y: "100%" }}
            animate={overlayControls}
          />

          {/* Main content container */}
          <div className="container relative z-20 px-6 text-center max-w-xl mx-auto">
            {/* Logo mark */}
            <motion.div
              className="mb-12 relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex justify-center items-center">
                <div className="relative w-20 h-20 mb-2">
                  <Image
                    src="/images/ATKLogoTransparent.png"
                    alt="ATK"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </motion.div>

            {/* Dynamic text animation */}
            <div className="h-20 mb-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentWordIndex}
                  className="flex justify-center"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {words[currentWordIndex].split("").map((letter, index) => (
                    <motion.span
                      key={`${letter}-${index}`}
                      variants={letterVariants}
                      custom={index}
                      className="inline-block text-5xl md:text-7xl playfair font-bold"
                    >
                      {letter}
                    </motion.span>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress bar */}
            <motion.div
              className="relative h-px w-full bg-white/10 max-w-sm mx-auto overflow-hidden"
              style={{ opacity: progressOpacity }}
            >
              <motion.div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500"
                style={{ width: `${progress}%` }}
              />
            </motion.div>

            {/* Progress percentage */}
            <motion.p
              className="mt-4 text-sm font-light tracking-widest text-white/60"
              style={{ opacity: progressOpacity }}
            >
              {progress}%
            </motion.p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default Preloader;
