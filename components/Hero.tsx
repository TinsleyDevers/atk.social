"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";

// Define prop types for components
interface SplitTextRevealProps {
  children: string;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: string | number | React.CSSProperties | undefined;
}

// Character-by-character text animation component
const SplitTextReveal = ({
  children,
  delay = 0,
  className = "",
  ...props
}: SplitTextRevealProps) => {
  const characters = Array.from(children);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: delay,
      },
    },
  };

  const childVariants = {
    hidden: {
      y: 30,
      opacity: 0,
      rotateX: 20,
    },
    visible: {
      y: 0,
      opacity: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.span
      className={`inline-block ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      {...props}
    >
      {characters.map((char, index) => (
        <motion.span
          key={index}
          variants={childVariants}
          style={{ display: "inline-block", willChange: "transform" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
};

interface LineRevealProps {
  className?: string;
  delay?: number;
}

// Line reveal animation
const LineReveal = ({ className, delay = 0.2 }: LineRevealProps) => {
  return (
    <motion.div
      className={className}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay }}
      style={{ originX: 0 }}
    />
  );
};

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  href: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
  [key: string]:
    | ReactNode
    | string
    | number
    | React.CSSProperties
    | ((e: React.MouseEvent) => void)
    | undefined;
}

// Magnetic element component for interactive buttons
const MagneticButton = ({
  children,
  className,
  href,
  ...props
}: MagneticButtonProps) => {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
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
    setIsHovered(false);
  };

  return (
    <motion.a
      ref={buttonRef}
      href={href}
      className={`${className} ${isHovered ? "hovered" : ""}`}
      animate={{
        x: position.x,
        y: position.y,
        scale: isHovered ? 1.05 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 15,
        mass: 0.1,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      data-cursor="magnetic"
      {...props}
    >
      {children}
    </motion.a>
  );
};

interface HeroProps {
  isLoading: boolean;
}

// Hero component with preloader integration
const Hero = ({ isLoading }: HeroProps) => {
  const sectionRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  // State to track if we're on the client side
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Scroll-based animations
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Use a fixed opacity of 1 for initial render, then control with scroll
  const scrollOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Transform values for parallax effects
  const textY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const smoothTextY = useSpring(textY, { damping: 15, stiffness: 100 });

  // Get window dimensions on client side
  useEffect(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Set initial size
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Wait for preloader to finish
  useEffect(() => {
    if (!isLoading) {
      // Small delay after preloader to ensure smooth transition
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // Force visibility after animation completes
  useEffect(() => {
    if (isReady) {
      const timer = setTimeout(() => {
        setHasAnimated(true);
      }, 2000); // Wait for animations to complete

      return () => clearTimeout(timer);
    }
  }, [isReady]);

  // Variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.5,
        when: "beforeChildren",
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      className="h-screen w-full relative flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Background ambient effect */}
      <div className="absolute inset-0 bg-black z-10">
        <div className="absolute inset-0 opacity-20 noise-texture"></div>
        <div className="absolute inset-0 z-20">
          <div className="absolute -top-96 right-1/4 w-[800px] h-[800px] bg-white/2 rounded-full blur-[150px] opacity-20"></div>
          <div className="absolute -bottom-96 left-1/4 w-[800px] h-[800px] bg-white/2 rounded-full blur-[150px] opacity-20"></div>

          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/1 rounded-full blur-[120px]"
            animate={{
              opacity: [0.05, 0.1, 0.05],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </div>

      {/* Grid lines */}
      <div className="absolute inset-0 grid grid-cols-4 z-20 pointer-events-none">
        <div className="border-l border-white/5 h-full"></div>
        <div className="border-l border-white/5 h-full"></div>
        <div className="border-l border-white/5 h-full"></div>
        <div className="border-l border-r border-white/5 h-full"></div>
      </div>

      {/* Horizontal lines */}
      <div className="absolute top-[200px] left-0 w-full h-px bg-white/5 z-20"></div>
      <div className="absolute bottom-[200px] left-0 w-full h-px bg-white/5 z-20"></div>

      {/* Main content container */}
      <div className="container mx-auto px-6 relative z-30">
        <AnimatePresence>
          {isReady && (
            <motion.div
              className={`flex flex-col items-center justify-center text-center ${
                hasAnimated ? "opacity-100" : ""
              }`}
              style={{
                y: smoothTextY,
                opacity: hasAnimated ? scrollOpacity : 1, // Start with 1, then use scroll after animations
              }}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              onAnimationComplete={() => setHasAnimated(true)}
            >
              {/* Main hero heading with animated text */}
              <div className="overflow-hidden mb-8 w-full">
                <h1 className="flex flex-col items-center text-center">
                  <div className="overflow-hidden mb-3">
                    <SplitTextReveal
                      className="text-7xl md:text-9xl font-bold playfair tracking-tighter"
                      delay={0.5}
                    >
                      Create
                    </SplitTextReveal>
                  </div>

                  <div className="overflow-hidden mb-3">
                    <SplitTextReveal
                      className="text-7xl md:text-9xl font-bold playfair tracking-tighter text-outline"
                      delay={0.8}
                    >
                      Immerse
                    </SplitTextReveal>
                  </div>

                  <div className="overflow-hidden">
                    <SplitTextReveal
                      className="text-7xl md:text-9xl font-bold playfair tracking-tighter"
                      delay={1.1}
                    >
                      Transform
                    </SplitTextReveal>
                  </div>
                </h1>
              </div>

              {/* Animated line */}
              <LineReveal className="h-px w-40 bg-white/40 mb-8" delay={1.4} />

              {/* Tagline */}
              <motion.p
                className="text-xl text-gray-300 mt-2 max-w-lg"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 1.6 }}
              >
                Content creation and game development converge to create
                extraordinary experiences
              </motion.p>

              {/* Call to action buttons */}
              <motion.div
                className="mt-12 flex flex-wrap justify-center gap-6"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 1.8 }}
              >
                <MagneticButton
                  href="#social"
                  className="px-8 py-3 bg-white text-black font-medium transition-all relative overflow-hidden group"
                >
                  <span className="relative z-10">ATK Social</span>
                  <span className="absolute inset-0 bg-white transform-gpu origin-bottom duration-300 ease-out group-hover:scale-y-0"></span>
                  <span className="absolute inset-0 bg-gray-100 transform-gpu origin-top scale-y-0 duration-300 ease-out group-hover:scale-y-100"></span>
                </MagneticButton>

                <MagneticButton
                  href="#studios"
                  className="px-8 py-3 border border-white text-white font-medium transition-all duration-300 relative overflow-hidden group"
                >
                  <span className="relative z-10">ATK Studios</span>
                  <span className="absolute inset-0 bg-transparent transform-gpu origin-left duration-300 ease-out group-hover:bg-white/10"></span>
                </MagneticButton>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Hero;
