"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion";
import Image from "next/image";

const Preloader = ({
  onLoadingComplete,
}: {
  onLoadingComplete?: () => void;
}) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(1);
  const progressControls = useAnimation();
  const overlayControls = useAnimation();
  const progressVal = useMotionValue(0);
  const progressOpacity = useTransform(progressVal, [0, 100], [1, 0]);
  const logoRef = useRef<HTMLDivElement>(null);
  const [exitAnimationComplete, setExitAnimationComplete] = useState(false);

  // Setup for the dynamic text elements
  // Use useMemo to prevent the array from being recreated on each render
  const words = useMemo(() => ["Social", "Studios"], []);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  // Word rotation in a separate useEffect
  useEffect(() => {
    const wordInterval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }, 1000);

    return () => clearInterval(wordInterval);
  }, [words.length]);

  // Handle the exit animation in its own useEffect
  useEffect(() => {
    if (phase === 2) {
      const animateExit = async () => {
        await overlayControls.start({
          y: "-100%",
          transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] },
        });

        setExitAnimationComplete(true);
      };

      animateExit();
    }
  }, [phase, overlayControls]);

  // Call the onLoadingComplete callback when exit animation is done
  useEffect(() => {
    if (exitAnimationComplete && onLoadingComplete) {
      onLoadingComplete();
    }
  }, [exitAnimationComplete, onLoadingComplete]);

  // Main loading progress useEffect
  useEffect(() => {
    // Only run this effect once
    if (phase !== 1) return;

    // Track real page loading status
    let pageLoaded = false;
    const markAsLoaded = () => {
      pageLoaded = true;
    };

    // Listen for page load events
    if (document.readyState === "complete") {
      markAsLoaded();
    } else {
      window.addEventListener("load", markAsLoaded);
    }

    // Start the progress animation with aesthetic timing
    let progressInterval: ReturnType<typeof setInterval>;

    const startLoading = () => {
      let currentProgress = 0;
      let loadingSpeed = 1; // Initial loading speed

      progressInterval = setInterval(() => {
        // Adjust loading speed based on progress and actual page load
        if (pageLoaded && currentProgress < 70) {
          // If page is actually loaded but our animation is behind, speed up a bit
          loadingSpeed = 2;
        } else if (!pageLoaded && currentProgress > 80) {
          // If real page isn't ready but animation is getting ahead, slow down
          loadingSpeed = 0.5;
        } else if (currentProgress > 80) {
          // Slow down as we approach completion for a nicer effect
          loadingSpeed = 0.7;
        } else if (currentProgress > 50) {
          // Medium progress speed
          loadingSpeed = 1.2;
        }

        // Calculate a smooth increment that starts faster and slows down
        let increment;
        if (currentProgress < 30) {
          // Faster at the beginning (creates a nice initial movement)
          increment = Math.random() * 2 + 1;
        } else if (currentProgress < 80) {
          // Steady pace through the middle
          increment = Math.random() * 1.5 + 0.4;
        } else {
          // Very slow at the end (builds anticipation)
          increment = Math.random() * 0.7 + 0.2;
        }

        // Apply loading speed modifier
        increment *= loadingSpeed;

        // Update progress
        currentProgress = Math.min(100, currentProgress + increment);
        setProgress(Math.floor(currentProgress));
        progressVal.set(Math.floor(currentProgress));

        // If we reach 100%
        if (currentProgress >= 100) {
          clearInterval(progressInterval);

          // Ensure we display 100% for a moment before transitioning
          setTimeout(() => {
            // If the actual page is ready, or we've waited long enough, proceed
            if (pageLoaded || currentProgress >= 100) {
              setPhase(2); // Move to exit phase
            }
          }, 800); // Show 100% for 800ms before exit animation
        }
      }, 50); // Update more frequently for smoother animation
    };

    // Start with a brief delay to allow the entrance animation
    const preloaderTimeout = setTimeout(() => {
      startLoading();
    }, 800);

    return () => {
      clearTimeout(preloaderTimeout);
      clearInterval(progressInterval);
      window.removeEventListener("load", markAsLoaded);
    };
  }, [phase, progressVal]); // Removed dependencies that could cause re-renders

  // Text character split animation variant
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

  // Split the current word into characters for animation
  const currentWord = words[currentWordIndex];
  const letters = currentWord.split("");

  return (
    <AnimatePresence>
      {(phase === 1 || phase === 2) && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {/* Ambient background elements */}
          <div className="absolute inset-0 bg-[#050505] z-0">
            {/* Vertical accent lines */}
            <div className="absolute inset-y-0 left-1/4 w-px bg-white/5"></div>
            <div className="absolute inset-y-0 right-1/4 w-px bg-white/5"></div>
          </div>

          {/* Slide-away overlay for the exit animation */}
          <motion.div
            className="absolute inset-0 bg-black z-30"
            initial={{ y: "100%" }}
            animate={overlayControls}
          />

          {/* Main content container */}
          <div className="container relative z-20 px-6 text-center max-w-xl mx-auto">
            {/* Logo mark */}
            <motion.div
              ref={logoRef}
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
                  transition={{ staggerChildren: 0.05 }}
                >
                  {letters.map((letter, index) => (
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
                initial={{ width: 0 }}
                animate={progressControls}
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
      )}
    </AnimatePresence>
  );
};

export default Preloader;
