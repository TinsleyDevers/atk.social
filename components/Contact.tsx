import React, { useState, useRef, ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";

const Contact = () => {
  // Refs for scroll animations
  const sectionRef = useRef(null);
  const [activeTab, setActiveTab] = useState("general"); // 'general', 'studios', 'social'
  const [hoverItem, setHoverItem] = useState<string | null>(null);

  // Scroll-based animations
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.8, 1]);
  const y = useTransform(scrollYProgress, [0, 0.2], [100, 0]);

  // Apply spring physics for smooth animations
  const springConfig = { stiffness: 100, damping: 25, mass: 0.5 };
  const smoothOpacity = useSpring(opacity, springConfig);
  const smoothScale = useSpring(scale, springConfig);
  const smoothY = useSpring(y, springConfig);

  // Get colors based on active tab
  const getColors = () => {
    switch (activeTab) {
      case "studios":
        return {
          primary: "from-blue-400 to-blue-600",
          secondary: "bg-blue-500/10",
          border: "border-blue-500/30",
          text: "text-blue-400",
          hover: "group-hover:text-blue-300",
          glow: "bg-blue-500/5",
          gradientBorder: "border-blue-500/20",
        };
      case "social":
        return {
          primary: "from-purple-400 to-purple-600",
          secondary: "bg-purple-500/10",
          border: "border-purple-500/30",
          text: "text-purple-400",
          hover: "group-hover:text-purple-300",
          glow: "bg-purple-500/5",
          gradientBorder: "border-purple-500/20",
        };
      default:
        return {
          primary: "from-white/60 to-white/80",
          secondary: "bg-white/5",
          border: "border-white/20",
          text: "text-white",
          hover: "group-hover:text-gray-200",
          glow: "bg-white/5",
          gradientBorder: "border-white/10",
        };
    }
  };

  const colors = getColors();

  // Email options
  const emailOptions = [
    {
      id: "general",
      email: "hello@atkgroup.com",
      title: "General Inquiries",
      description: "For all general inquiries and information",
      icon: (
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
          <path d="M12 8v4" />
          <path d="M12 16h.01" />
        </svg>
      ),
    },
    {
      id: "social",
      email: "social@atkgroup.com",
      title: "ATK Social",
      description: "For content creation and social media inquiries",
      icon: (
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
          <path d="M6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
          <path d="M18 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
          <path d="M8.59 13.51 15.42 17.49" />
          <path d="M15.41 6.51 8.59 10.49" />
        </svg>
      ),
    },
    {
      id: "studios",
      email: "studios@atkgroup.com",
      title: "ATK Studios",
      description: "For game development and interactive experiences",
      icon: (
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 6H7c-4 0-4 1.5-4 4v4c0 2.5 0 4 4 4h10c4 0 4-1.5 4-4v-4c0-2.5 0-4-4-4Z" />
          <path d="M17 10h-2v4h2" />
          <path d="M13 10H7v4h6" />
        </svg>
      ),
    },
  ];

  // Social links with hover effects
  const socialLinks = [
    {
      id: "twitter",
      url: "https://twitter.com/atkgroup",
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
        </svg>
      ),
      label: "Twitter",
    },
    {
      id: "instagram",
      url: "https://instagram.com/atkgroup",
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
      label: "Instagram",
    },
    {
      id: "linkedin",
      url: "https://linkedin.com/company/atkgroup",
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect width="4" height="12" x="2" y="9" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
      label: "LinkedIn",
    },
    {
      id: "discord",
      url: "https://discord.gg/atkgroup",
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M8.5 12H5m11 0h-3.5M9 12a3 3 0 1 0 6 0 3 3 0 0 0-6 0Zm-6.5 4.5c0 2.35 3.5 4.3 7.5 4.3s7.5-1.95 7.5-4.3v-9c0-2.35-3.5-4.3-7.5-4.3s-7.5 1.95-7.5 4.3v9Z" />
        </svg>
      ),
      label: "Discord",
    },
  ];

  // 3D floating blocks

  // Magnetic button that moves toward cursor
  const MagneticButton = ({
    children,
    className,
  }: {
    children: ReactNode;
    className?: string;
  }) => {
    const buttonRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      setPosition({
        x: (e.clientX - centerX) * 0.2,
        y: (e.clientY - centerY) * 0.2,
      });
    };

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 });
    };

    return (
      <motion.div
        ref={buttonRef}
        className={`${className} inline-block`}
        animate={{ x: position.x, y: position.y }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        data-cursor="magnetic"
      >
        {children}
      </motion.div>
    );
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="min-h-screen py-24 relative overflow-hidden bg-black"
    >
      {/* Background elements */}
      {/* Background elements */}
      <div className="absolute inset-0 noise-texture opacity-30 z-10"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-white/20 via-white/30 to-white/20 z-20"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-white/20 via-white/30 to-white/20 z-20"></div>

      {/* Grid patterns for visual texture */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZGVmcz4KPHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxwYXRoIGQ9Ik0gNTAgMCBMIDAgMCAwIDUwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wMikiIHN0cm9rZS13aWR0aD0iMSIvPgo8L3BhdHRlcm4+CjwvZGVmcz4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIgLz4KPC9zdmc+')] opacity-20 z-10"></div>

      {/* Ambient light effects */}
      <div className="absolute -top-96 -left-96 w-[800px] h-[800px] bg-gradient-to-br from-white/5 to-transparent rounded-full blur-[150px] opacity-20 z-5"></div>
      <div className="absolute -bottom-96 -right-96 w-[800px] h-[800px] bg-gradient-to-br from-white/5 to-transparent rounded-full blur-[150px] opacity-20 z-5"></div>

      <div className="container mx-auto px-6 relative z-30">
        <motion.div
          className="mb-16 text-center"
          style={{
            opacity: smoothOpacity,
            scale: smoothScale,
            y: smoothY,
          }}
        >
          <h2 className="text-6xl md:text-8xl font-bold playfair tracking-tighter mb-6 relative">
            <span className="relative inline-block">
              <span className="relative z-10">Connect</span>
              <motion.span
                className={`absolute -bottom-3 left-0 w-full h-1 bg-gradient-to-r ${colors.primary}`}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 1,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.2,
                }}
                style={{ originX: 0 }}
              />
            </span>
          </h2>

          <p className="text-xl max-w-2xl mx-auto manrope text-gray-300 relative">
            <motion.span
              className="inline-block"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Let&apos;s create something extraordinary together.
            </motion.span>
          </p>
        </motion.div>

        {/* Main contact section */}
        <div className="max-w-6xl mx-auto">
          {/* Segmented control for switching between contact types */}
          <motion.div
            className="flex justify-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-black/30 backdrop-blur-sm border border-white/10 p-1 inline-flex rounded-sm">
              {emailOptions.map((option) => (
                <button
                  key={option.id}
                  className={`px-5 py-3 relative ${
                    activeTab === option.id ? "text-white" : "text-gray-400"
                  } transition-colors`}
                  onClick={() => setActiveTab(option.id)}
                >
                  <span className="relative z-10">{option.title}</span>
                  {activeTab === option.id && (
                    <motion.div
                      className={`absolute inset-0 ${colors.secondary} z-0`}
                      layoutId="activeTab"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
          {/* Contact showcase */}
          <motion.div
            className="mb-24"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="relative bg-black/20 backdrop-blur-md border border-white/10 overflow-hidden"
              >
                {/* Background gradient based on active tab */}
                <div
                  className={`absolute inset-0 ${colors.glow} opacity-30 z-0`}
                ></div>

                {/* Content */}
                <div className="relative z-10 p-12 md:p-16 lg:p-20">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    {/* Left side - Text info */}
                    <div>
                      <motion.div
                        className={`inline-flex items-center space-x-3 mb-6 ${colors.text}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                      >
                        {/* Use optional chaining */}
                        {
                          emailOptions.find((option) => option.id === activeTab)
                            ?.icon
                        }
                        <span className="text-sm uppercase tracking-wider font-medium">
                          {activeTab === "general"
                            ? "Contact Us"
                            : `ATK ${
                                activeTab.charAt(0).toUpperCase() +
                                activeTab.slice(1)
                              }`}
                        </span>
                      </motion.div>

                      <motion.h3
                        className="text-4xl md:text-5xl font-bold playfair mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                      >
                        Let&apos;s start a
                        <span className={`${colors.text} ml-3`}>
                          conversation
                        </span>
                      </motion.h3>

                      <motion.div
                        className={`h-1 w-16 bg-gradient-to-r ${colors.primary} mb-8`}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        style={{ originX: 0 }}
                      />

                      <motion.p
                        className="text-lg text-gray-300 mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                      >
                        {activeTab === "studios" &&
                          "Have a game or interactive project in mind? Let's discuss your vision and how we can bring it to life."}
                        {activeTab === "social" &&
                          "Ready to elevate your social media presence? Reach out to discuss strategies tailored to your brand."}
                        {activeTab === "general" &&
                          "Have a project or idea? We'd love to hear from you and explore how we can collaborate."}
                      </motion.p>

                      {/* Email button */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.5 }}
                      >
                        <MagneticButton className="inline-block">
                          <a
                            href={`mailto:${
                              emailOptions.find(
                                (option) => option.id === activeTab
                              )?.email || "hello@atkgroup.com"
                            }`}
                            className={`group flex items-center space-x-3 ${colors.text} hover:opacity-80 transition-opacity`}
                            data-cursor="text"
                            data-cursor-text="Email"
                          >
                            <div
                              className={`w-12 h-12 rounded-full ${colors.secondary} border ${colors.border} flex items-center justify-center`}
                            >
                              <svg
                                className="w-5 h-5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <rect
                                  width="20"
                                  height="16"
                                  x="2"
                                  y="4"
                                  rx="2"
                                />
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                              </svg>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-lg font-medium">
                                {emailOptions.find(
                                  (option) => option.id === activeTab
                                )?.email || "hello@atkgroup.com"}
                              </span>
                              <span className="text-sm text-gray-400">
                                Click to send an email
                              </span>
                            </div>

                            <svg
                              className="w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-2"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                          </a>
                        </MagneticButton>
                      </motion.div>
                    </div>

                    {/* Right side - Visual element */}
                    <div className="hidden md:block">
                      <motion.div
                        className="relative aspect-square"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                      >
                        <div
                          className={`absolute inset-0 ${colors.secondary} backdrop-blur-lg border ${colors.border} bg-opacity-30 rounded-sm overflow-hidden`}
                        >
                          {/* Abstract decorative patterns based on active tab */}
                          {activeTab === "studios" && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <motion.div
                                className="absolute w-40 h-40 rounded-full border border-blue-500/20"
                                animate={{
                                  scale: [1, 1.1, 1],
                                  rotate: [0, 90, 0],
                                  opacity: [0.3, 0.5, 0.3],
                                }}
                                transition={{
                                  duration: 10,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                              />

                              <motion.div
                                className="absolute w-60 h-60 border border-blue-500/10"
                                style={{ borderRadius: "30%" }}
                                animate={{
                                  rotate: [0, 360],
                                  borderRadius: ["30%", "40%", "30%"],
                                }}
                                transition={{
                                  duration: 20,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                              />

                              <motion.div
                                className="absolute w-32 h-32"
                                style={{ borderRadius: "60%" }}
                                animate={{ rotate: [360, 0] }}
                                transition={{
                                  duration: 30,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                              >
                                <div
                                  className="w-full h-full border border-blue-500/30"
                                  style={{ borderRadius: "60%" }}
                                />
                              </motion.div>

                              <motion.div
                                className="w-20 h-20 bg-blue-500/5 backdrop-blur-lg"
                                animate={{
                                  rotate: [0, 180, 0],
                                }}
                                transition={{
                                  duration: 10,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                              />
                            </div>
                          )}

                          {activeTab === "social" && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <motion.div
                                className="absolute grid grid-cols-3 gap-3"
                                animate={{ rotate: [0, 10, 0, -10, 0] }}
                                transition={{
                                  duration: 10,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                              >
                                {Array.from({ length: 9 }).map((_, i) => (
                                  <motion.div
                                    key={i}
                                    className={`w-8 h-8 bg-purple-500/${
                                      5 + i * 3
                                    } rounded-sm`}
                                    initial={{ opacity: 0.5 }}
                                    animate={{
                                      opacity: [0.3, 0.6, 0.3],
                                      scale: [1, 1.1, 1],
                                    }}
                                    transition={{
                                      duration: 3 + Math.random() * 2,
                                      delay: i * 0.2,
                                      repeat: Infinity,
                                    }}
                                  />
                                ))}
                              </motion.div>

                              <motion.div
                                className="absolute w-60 h-60 border border-purple-500/10 rounded-full"
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 8, repeat: Infinity }}
                              />
                            </div>
                          )}

                          {activeTab === "general" && (
                            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                              {/* Main ATK logo indicator */}
                              <div className="relative w-56 h-56">
                                <motion.div
                                  className="absolute inset-0 w-full h-full rounded-full border border-white/20"
                                  animate={{
                                    scale: [1, 1.05, 1],
                                    rotate: 360,
                                  }}
                                  transition={{
                                    scale: {
                                      duration: 4,
                                      repeat: Infinity,
                                      repeatType: "reverse",
                                    },
                                    rotate: {
                                      duration: 30,
                                      repeat: Infinity,
                                      ease: "linear",
                                    },
                                  }}
                                />

                                {/* Subtle background elements */}
                                <motion.div
                                  className="absolute inset-0 m-auto w-32 h-32 bg-white/5 backdrop-blur-sm rounded-full"
                                  animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.3, 0.5, 0.3],
                                  }}
                                  transition={{
                                    duration: 6,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                  }}
                                />
                              </div>
                            </div>
                          )}

                          {/* Corner accents */}
                          <div className="absolute top-0 left-0 w-10 h-10 border-t border-l border-white/20 z-10"></div>
                          <div className="absolute top-0 right-0 w-10 h-10 border-t border-r border-white/20 z-10"></div>
                          <div className="absolute bottom-0 left-0 w-10 h-10 border-b border-l border-white/20 z-10"></div>
                          <div className="absolute bottom-0 right-0 w-10 h-10 border-b border-r border-white/20 z-10"></div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Decorative corner elements */}
                <div className="absolute top-0 left-0 w-20 h-20 border-t border-l border-white/10 pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-20 h-20 border-t border-r border-white/10 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 border-b border-l border-white/10 pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-20 h-20 border-b border-r border-white/10 pointer-events-none"></div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
          {/* Social links with hover effects */}
          <motion.div
            className="mb-20 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h3 className="text-xl font-medium mb-8">Connect with us</h3>

            <div className="flex justify-center space-x-8">
              {socialLinks.map((social, index) => (
                <MagneticButton key={social.id} className="inline-block">
                  <motion.a
                    href={social.url}
                    className="group relative"
                    data-cursor="text"
                    data-cursor-text={social.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    onMouseEnter={() => setHoverItem(social.id)}
                    onMouseLeave={() => setHoverItem(null)}
                  >
                    <div className="relative">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          hoverItem === social.id
                            ? "bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-blue-500/20 border-white/20"
                            : "bg-black/30 border-white/10"
                        } border transition-all duration-300`}
                      >
                        <div
                          className={`${
                            hoverItem === social.id
                              ? "text-white"
                              : "text-gray-400"
                          } transition-colors duration-300`}
                        >
                          {social.icon}
                        </div>
                      </div>

                      <AnimatePresence>
                        {hoverItem === social.id && (
                          <motion.div
                            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium tracking-wide"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                          >
                            {social.label}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.a>
                </MagneticButton>
              ))}
            </div>
          </motion.div>
          Location section
          <motion.div
            className="text-center mb-32"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                {
                  title: "New York",
                  address: "123 Lorem Ipsum, NY 10001",
                  icon: (
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  ),
                },
                {
                  title: "Los Angeles",
                  address: "456 Lorem Ipsum, LA 90001",
                  icon: (
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  ),
                },
                {
                  title: "London",
                  address: "789 Lorem Ipsum, London W1A 1AB",
                  icon: (
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  ),
                },
              ].map((location, index) => (
                <motion.div
                  key={location.title}
                  className="bg-black/20 backdrop-blur-sm p-6 relative overflow-hidden group border border-white/10"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-blue-600/5 rounded-full filter blur-xl opacity-70 group-hover:opacity-100 transition-opacity"></div>

                  <div className="flex flex-col items-center relative z-10">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-3 text-gray-300">
                      {location.icon}
                    </div>
                    <h4 className="text-lg font-medium text-white mb-1">
                      {location.title}
                    </h4>
                    <p className="text-sm text-gray-400">{location.address}</p>
                  </div>

                  {/* Border animation on hover */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-0 left-0 w-0 h-0 border-t border-l border-white/20 group-hover:w-full group-hover:h-full transition-all duration-700"></div>
                    <div className="absolute bottom-0 right-0 w-0 h-0 border-b border-r border-white/20 group-hover:w-full group-hover:h-full transition-all duration-700"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          {/* Final CTA */}
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h3 className="text-3xl md:text-4xl font-bold playfair mb-8 leading-tight">
              <span className="block">
                Ready to embark on a creative journey?
              </span>
              <span className={`${colors.text}`}>
                Let&apos;s build something great.
              </span>
            </h3>

            <MagneticButton>
              <a
                href="#contact"
                className="group px-10 py-4 bg-transparent border border-white text-white font-medium relative overflow-hidden inline-block uppercase tracking-wider text-sm"
                data-cursor="text"
                data-cursor-text="Connect"
                data-cursor-rotate="true"
              >
                <span className="relative z-10 transition-transform duration-500 group-hover:translate-y-[-150%] inline-block">
                  Reach Out to Us
                </span>
                <span className="absolute inset-0 flex items-center justify-center text-white transition-transform duration-500 translate-y-[150%] group-hover:translate-y-0">
                  Get in touch
                </span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
              </a>
            </MagneticButton>
          </motion.div>
        </div>
      </div>

      {/* Marquee banner */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <div className="py-4 bg-gradient-to-r from-white/5 via-white/10 to-white/5 border-t border-b border-white/5 overflow-hidden">
          <div className="whitespace-nowrap inline-flex animate-marquee">
            {Array(2)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="inline-flex items-center gap-8">
                  {[
                    "CREATE",
                    "IMMERSE",
                    "TRANSFORM",
                    "CONNECT",
                    "INNOVATE",
                    "EXPERIENCE",
                    "DESIGN",
                    "DEVELOP",
                  ].map((text, index) => (
                    <span
                      key={index}
                      className="text-2xl font-extralight text-white/20 mx-8"
                    >
                      {text}
                    </span>
                  ))}
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
