"use client";

import { useState, useRef, ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Image from "next/image";

// Performance-optimized magnetic element for interactive UI elements
const MagneticElement = ({
  children,
  strength = 25,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();

    const x = (clientX - (left + width / 2)) / strength;
    const y = (clientY - (top + height / 2)) / strength;

    setPosition({ x, y });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 350, damping: 15, mass: 0.1 }}
      className={className}
      data-cursor="magnetic"
    >
      {children}
    </motion.div>
  );
};

// Main Contact component
const Contact = () => {
  const [activeTab, setActiveTab] = useState("atk");
  const [letterHover, setLetterHover] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll-based animations
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const yOffset = useTransform(scrollYProgress, [0, 0.2], [100, 0]);

  // Brand colors based on active tab
  const getBrandColors = (brand: string) => {
    switch (brand) {
      case "social":
        return {
          primary: "text-purple-400",
          secondary: "text-purple-300",
          gradient: "from-purple-500/20 to-purple-800/20",
          border: "border-purple-500/30",
          glow: "bg-purple-500/10",
          hover: "hover:text-purple-300",
          accent: "bg-purple-500",
        };
      case "studios":
        return {
          primary: "text-blue-400",
          secondary: "text-blue-300",
          gradient: "from-blue-500/20 to-blue-800/20",
          border: "border-blue-500/30",
          glow: "bg-blue-500/10",
          hover: "hover:text-blue-300",
          accent: "bg-blue-500",
        };
      default:
        return {
          primary: "text-white",
          secondary: "text-gray-300",
          gradient: "from-white/10 to-white/5",
          border: "border-white/20",
          glow: "bg-white/5",
          hover: "hover:text-gray-100",
          accent: "bg-white",
        };
    }
  };

  const colors = getBrandColors(activeTab);

  // Contact options for each brand
  const contactOptions = [
    {
      id: "atk",
      title: "ATK",
      email: "hello@atkgroup.com",
      description: "For general inquiries and information",
    },
    {
      id: "social",
      title: "ATK SOCIAL",
      email: "social@atkgroup.com",
      description: "Content creation and social media",
    },
    {
      id: "studios",
      title: "ATK STUDIOS",
      email: "studios@atkgroup.com",
      description: "Game development and interactive experiences",
    },
  ];

  // Split text for animated typography
  const splitText = (text: string) => {
    return text.split("").map((char, index) => (
      <motion.span
        key={`${char}-${index}`}
        className={`inline-block transition-colors duration-300 ${
          letterHover === index ? colors.secondary : colors.primary
        }`}
        onMouseEnter={() => setLetterHover(index)}
        onMouseLeave={() => setLetterHover(null)}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.4,
          ease: [0.2, 0.65, 0.3, 0.9],
          delay: index * 0.03,
        }}
      >
        {char === " " ? "\u00A0" : char}
      </motion.span>
    ));
  };

  // Ensure smooth tab transitions
  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.2, 0.65, 0.3, 0.9] },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3, ease: [0.2, 0.65, 0.3, 0.9] },
    },
  };

  return (
    <motion.section
      id="contact"
      ref={sectionRef}
      className="relative py-32 md:py-40 overflow-hidden bg-black"
      style={{ opacity, y: yOffset }}
    >
      {/* Abstract background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className={`absolute top-20 left-1/4 w-96 h-96 rounded-full ${colors.glow} opacity-40 blur-3xl`}
        ></div>
        <div
          className={`absolute bottom-20 right-1/4 w-64 h-64 rounded-full ${colors.glow} opacity-30 blur-3xl`}
        ></div>
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute inset-y-0 right-1/4 w-px bg-white/5"></div>
          <div className="absolute inset-y-0 left-1/4 w-px bg-white/5"></div>
          <div className="absolute inset-x-0 top-1/4 h-px bg-white/5"></div>
          <div className="absolute inset-x-0 bottom-1/4 h-px bg-white/5"></div>
        </motion.div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Typography hero element */}
        <div className="mb-20 text-center">
          <motion.h2
            className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-6 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="sr-only">GET IN TOUCH</span>
            <div className="flex justify-center flex-wrap">
              {splitText("GET IN TOUCH")}
            </div>
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-white/60 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Choose your area of interest below and reach out via email.
          </motion.p>
        </div>

        {/* Tabs navigation */}
        <div className="flex justify-center mb-12 space-x-4 md:space-x-8">
          {contactOptions.map((option) => {
            const isActive = activeTab === option.id;
            const tabColors = getBrandColors(option.id);

            return (
              <MagneticElement key={option.id} strength={30}>
                <button
                  className={`relative px-6 py-3 rounded-sm text-sm uppercase tracking-wider transition-all duration-300 ${
                    isActive ? tabColors.primary : "text-gray-500"
                  } ${tabColors.hover}`}
                  onClick={() => setActiveTab(option.id)}
                  data-cursor="magnetic"
                >
                  <span className="relative z-10">{option.title}</span>

                  {isActive && (
                    <motion.div
                      className={`absolute inset-0 ${tabColors.glow} rounded-sm`}
                      layoutId="activeBrand"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </button>
              </MagneticElement>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {contactOptions.map((option) => {
              if (activeTab !== option.id) return null;
              const tabColors = getBrandColors(option.id);

              return (
                <motion.div
                  key={option.id}
                  className={`p-8 md:p-12 border ${tabColors.border} rounded-sm bg-gradient-to-br ${tabColors.gradient}`}
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="mb-8 md:mb-0">
                      <h3
                        className={`text-2xl md:text-3xl font-bold mb-2 ${tabColors.primary}`}
                      >
                        {option.title}
                      </h3>
                      <p className="text-white/60 mb-6">{option.description}</p>

                      <div className="inline-block">
                        <MagneticElement strength={20} className="group">
                          <a
                            href={`mailto:${option.email}`}
                            className={`text-xl md:text-2xl ${tabColors.primary} group-hover:underline cursor-none`}
                            data-cursor="link"
                            data-cursor-text="Email"
                          >
                            {option.email}
                          </a>
                        </MagneticElement>
                      </div>
                    </div>

                    <div className="w-20 h-20 md:w-24 md:h-24 relative opacity-90">
                      <Image
                        src="/images/ATKLogoTransparent.png"
                        alt="ATK Logo"
                        width={96}
                        height={96}
                        className="object-contain"
                      />
                      <div
                        className={`absolute bottom-0 left-0 right-0 h-1 ${tabColors.accent}`}
                        style={{ width: "40%", marginLeft: "30%" }}
                      ></div>
                    </div>
                  </div>

                  {/* Social links */}
                  <div className="mt-12 pt-6 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-white/40">Connect with us</p>
                      <div className="flex space-x-4">
                        {["Twitter", "Instagram", "LinkedIn"].map(
                          (platform) => (
                            <MagneticElement key={platform} strength={40}>
                              <a
                                href="#"
                                className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all duration-300"
                                data-cursor="link"
                                data-cursor-text={platform}
                                aria-label={platform}
                              >
                                {platform === "Twitter" && (
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="1.5"
                                      d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"
                                    ></path>
                                  </svg>
                                )}
                                {platform === "Instagram" && (
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <rect
                                      width="20"
                                      height="20"
                                      x="2"
                                      y="2"
                                      rx="5"
                                      ry="5"
                                    ></rect>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                    <line
                                      x1="17.5"
                                      y1="6.5"
                                      x2="17.51"
                                      y2="6.5"
                                    ></line>
                                  </svg>
                                )}
                                {platform === "LinkedIn" && (
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                    <rect
                                      x="2"
                                      y="9"
                                      width="4"
                                      height="12"
                                    ></rect>
                                    <circle cx="4" cy="4" r="2"></circle>
                                  </svg>
                                )}
                              </a>
                            </MagneticElement>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
};

export default Contact;
