"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

// Add proper typing for component props
interface CharacterRevealProps {
  children: string;
  delay?: number;
}

// Split text component for character-by-character animation
const CharacterReveal = ({ children, delay = 0 }: CharacterRevealProps) => {
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
      y: 20,
      opacity: 0,
      rotateX: 90,
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
      style={{ display: "inline-block" }}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
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

// Add proper typing for component props
interface LineRevealProps {
  className: string;
}

// Line reveal animation
const LineReveal = ({ className }: LineRevealProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <div className="overflow-hidden" ref={ref}>
      <motion.div
        className={className}
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        style={{ originX: 0 }}
      />
    </div>
  );
};

// Define type for statsValues
interface StatsValues {
  projects: number;
  clients: number;
  years: number;
  countries: number;
  [key: string]: number; // Add index signature
}

// Define type for division content
interface DivisionContent {
  title: string;
  description: string;
  features: string[];
  accentColor: string;
  gradientBg: string;
  textAccent: string;
  borderAccent: string;
}

// Define type for divisions
interface Divisions {
  social: DivisionContent;
  studios: DivisionContent;
  [key: string]: DivisionContent; // Add index signature
}

const About = () => {
  const sectionRef = useRef(null);
  const statsRef = useRef(null);
  const titleRef = useRef(null);
  const [activeTab, setActiveTab] = useState<"social" | "studios">("social");

  // Animation for counting stats
  const isStatsInView = useInView(statsRef, { once: true, amount: 0.5 });
  const [countCompleted, setCountCompleted] = useState(false);
  const [statsValues, setStatsValues] = useState<StatsValues>({
    projects: 0,
    clients: 0,
    years: 0,
    countries: 0,
  });

  useEffect(() => {
    const finalStats: StatsValues = {
      projects: 150,
      clients: 42,
      years: 5,
      countries: 12,
    };
    if (isStatsInView && !countCompleted) {
      const interval = setInterval(() => {
        setStatsValues((prev) => {
          const newValues = { ...prev };
          let completed = true;

          Object.keys(finalStats).forEach((key) => {
            if (prev[key] < finalStats[key]) {
              newValues[key] = Math.min(
                prev[key] + Math.ceil(finalStats[key] / 30),
                finalStats[key]
              );
              completed = false;
            }
          });

          if (completed) {
            clearInterval(interval);
            setCountCompleted(true);
          }

          return newValues;
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [isStatsInView, countCompleted]);

  // Animation variants
  const cardVariants = {
    initial: { y: 50, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    whileHover: {
      y: -5,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const statsVariants = {
    initial: { y: 30, opacity: 0 },
    animate: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.1 * i,
      },
    }),
  };

  // Divisions details
  const divisions: Divisions = {
    social: {
      title: "Content Creation",
      description:
        "Our content creation division produces captivating digital experiences across multiple platforms, connecting brands with audiences through authentic storytelling.",
      features: [
        "Social Media Strategy",
        "Influencer Marketing",
        "Brand Development",
        "Content Production",
        "Audience Engagement",
      ],
      accentColor: "from-purple-400 to-purple-600",
      gradientBg: "bg-gradient-to-br from-purple-900/20 to-transparent",
      textAccent: "text-purple-400",
      borderAccent: "border-purple-500/30",
    },
    studios: {
      title: "Game Development",
      description:
        "Our game development team crafts immersive digital worlds and interactive experiences, pushing the boundaries of gameplay and narrative design.",
      features: [
        "Interactive Experiences",
        "Game Design",
        "3D Modeling",
        "Character Animation",
        "Narrative Design",
      ],
      accentColor: "from-blue-400 to-blue-600",
      gradientBg: "bg-gradient-to-br from-blue-900/20 to-transparent",
      textAccent: "text-blue-400",
      borderAccent: "border-blue-500/30",
    },
  };

  const activeTabContent = divisions[activeTab];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="min-h-screen py-32 md:py-40 relative overflow-hidden bg-black"
    >
      {/* Noise texture overlay */}
      <div className="absolute inset-0 noise-texture opacity-30 z-10"></div>

      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-white/10 z-20"></div>
      <div className="absolute -top-96 right-1/4 w-[600px] h-[600px] bg-white/2 rounded-full blur-[120px] opacity-30"></div>
      <div className="absolute -bottom-96 left-1/4 w-[600px] h-[600px] bg-white/2 rounded-full blur-[120px] opacity-20"></div>

      {/* Vertical lines */}
      <div className="absolute inset-y-0 left-1/5 w-px bg-white/5 z-20"></div>
      <div className="absolute inset-y-0 right-1/5 w-px bg-white/5 z-20"></div>

      <div className="container mx-auto px-6 relative z-30">
        {/* Main heading with character animation */}
        <div ref={titleRef} className="max-w-6xl mx-auto mb-20 relative">
          <motion.h2
            className="text-6xl md:text-8xl font-bold playfair tracking-tighter mb-8 leading-none"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            <CharacterReveal>About ATK</CharacterReveal>
          </motion.h2>

          <LineReveal className="h-0.5 w-24 bg-white mb-8" />

          <motion.p
            className="text-xl md:text-2xl max-w-3xl manrope text-gray-300 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            ATK is a creative powerhouse combining content creation and game
            development under one roof. We bridge the gap between entertainment
            and interactive experiences.
          </motion.p>
        </div>

        {/* Stats section */}
        <div
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 mb-24 max-w-5xl mx-auto"
        >
          {[
            {
              label: "Projects",
              value: statsValues.projects,
              key: "projects",
              icon: (
                <svg
                  className="w-6 h-6 mb-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 9V6.5C2 4.01 4.01 2 6.5 2H9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15 2H17.5C19.99 2 22 4.01 22 6.5V9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 16V17.5C22 19.99 19.99 22 17.5 22H16"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 22H6.5C4.01 22 2 19.99 2 17.5V15"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10.5 7V11L13 9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7 13.5V15.5C7 16.6 7.4 17 8.5 17H11.5C12.6 17 13 16.6 13 15.5V13.5C13 12.4 12.6 12 11.5 12H8.5C7.4 12 7 12.4 7 13.5Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17 13H15.5C14.4 13 14 13.4 14 14.5V15.5C14 16.6 14.4 17 15.5 17H17C18.1 17 18.5 16.6 18.5 15.5V14.5C18.5 13.4 18.1 13 17 13Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ),
            },
            {
              label: "Clients",
              value: statsValues.clients,
              key: "clients",
              icon: (
                <svg
                  className="w-6 h-6 mb-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.16 10.87C9.06 10.86 8.94 10.86 8.83 10.87C6.45 10.79 4.56 8.84 4.56 6.44C4.56 3.99 6.54 2 9 2C11.45 2 13.44 3.99 13.44 6.44C13.43 8.84 11.54 10.79 9.16 10.87Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16.41 4C18.35 4 19.91 5.57 19.91 7.5C19.91 9.39 18.41 10.93 16.54 11C16.46 10.99 16.37 10.99 16.28 11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4.16 14.56C1.74 16.18 1.74 18.82 4.16 20.43C6.91 22.27 11.42 22.27 14.17 20.43C16.59 18.81 16.59 16.17 14.17 14.56C11.43 12.73 6.92 12.73 4.16 14.56Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M18.34 20C19.06 19.85 19.74 19.56 20.3 19.13C21.86 17.96 21.86 16.03 20.3 14.86C19.75 14.44 19.08 14.16 18.37 14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ),
            },
            {
              label: "Years",
              value: statsValues.years,
              key: "years",
              icon: (
                <svg
                  className="w-6 h-6 mb-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7.99998 3H8.99998C7.04998 8.84 7.04998 15.16 8.99998 21H7.99998"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15 3C16.95 8.84 16.95 15.16 15 21"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3 16V15C8.84 16.95 15.16 16.95 21 15V16"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3 9.0001C8.84 7.0501 15.16 7.0501 21 9.0001"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ),
            },
            {
              label: "Countries",
              value: statsValues.countries,
              key: "countries",
              icon: (
                <svg
                  className="w-6 h-6 mb-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7.99998 3H8.99998C7.04998 8.84 7.04998 15.16 8.99998 21H7.99998"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15 3C16.95 8.84 16.95 15.16 15 21"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3 16V15C8.84 16.95 15.16 16.95 21 15V16"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3 9.0001C8.84 7.0501 15.16 7.0501 21 9.0001"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ),
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.key}
              custom={i}
              variants={statsVariants}
              initial="initial"
              animate={isStatsInView ? "animate" : "initial"}
              className="flex flex-col items-center justify-center p-6 bg-white/2 backdrop-blur-lg border border-white/5 relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 left-0 w-0 h-0 border-t border-l border-white/20 group-hover:w-full group-hover:h-full group-hover:opacity-100 opacity-0 transition-all duration-500"></div>
              <div className="absolute bottom-0 right-0 w-0 h-0 border-b border-r border-white/20 group-hover:w-full group-hover:h-full group-hover:opacity-100 opacity-0 transition-all duration-500"></div>

              <div className="text-white/80">{stat.icon}</div>
              <div className="text-4xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm uppercase tracking-wider text-gray-400">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Divisions section with interactive tabs */}
        <div className="max-w-6xl mx-auto pt-10">
          {/* Tab controls */}
          <div className="flex flex-col md:flex-row justify-center mb-16 space-y-4 md:space-y-0 md:space-x-8">
            <motion.button
              className={`relative px-6 py-3 text-lg uppercase tracking-wider ${
                activeTab === "social" ? "text-white" : "text-gray-500"
              } transition-colors duration-300 overflow-hidden group`}
              onClick={() => setActiveTab("social")}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
              data-cursor="link"
              data-cursor-text="Explore"
              data-cursor-rotate="true"
            >
              <span className="relative z-10">ATK Social</span>
              {activeTab === "social" && (
                <motion.div
                  className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-purple-400 via-purple-600 to-purple-400"
                  layoutId="tabIndicator"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>

            <motion.button
              className={`relative px-6 py-3 text-lg uppercase tracking-wider ${
                activeTab === "studios" ? "text-white" : "text-gray-500"
              } transition-colors duration-300 overflow-hidden group`}
              onClick={() => setActiveTab("studios")}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
              data-cursor="link"
              data-cursor-text="Discover"
              data-cursor-rotate="true"
            >
              <span className="relative z-10">ATK Studios</span>
              {activeTab === "studios" && (
                <motion.div
                  className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400"
                  layoutId="tabIndicator"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          </div>

          {/* Tab content */}
          <div className="relative">
            <motion.div
              className={`grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 relative ${activeTabContent.gradientBg} p-10 border border-white/5`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              key={activeTab}
            >
              {/* Division image/graphic */}
              <motion.div
                className="relative"
                variants={cardVariants}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.3 }}
              >
                <div className="aspect-[4/3] w-full relative overflow-hidden rounded-sm">
                  <div
                    className={`absolute inset-0 ${activeTabContent.gradientBg} z-20 opacity-10`}
                  ></div>
                  <div className="absolute inset-0 bg-white/5 backdrop-blur-md border border-white/10 z-10"></div>

                  <div className="absolute inset-0 flex items-center justify-center z-30">
                    <div className="text-center">
                      <div
                        className={`w-16 h-16 mx-auto mb-5 relative ${activeTabContent.borderAccent} border rounded-full flex items-center justify-center`}
                      >
                        {activeTab === "social" ? (
                          <svg
                            className="w-8 h-8 text-purple-400"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M17 9C19.2091 9 21 7.20914 21 5C21 2.79086 19.2091 1 17 1C14.7909 1 13 2.79086 13 5C13 7.20914 14.7909 9 17 9Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M7 15C9.20914 15 11 13.2091 11 11C11 8.79086 9.20914 7 7 7C4.79086 7 3 8.79086 3 11C3 13.2091 4.79086 15 7 15Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M17 23C19.2091 23 21 21.2091 21 19C21 16.7909 19.2091 15 17 15C14.7909 15 13 16.7909 13 19C13 21.2091 14.7909 23 17 23Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M10.5 12.5L13.5 17.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M13.5 6.5L10.5 9.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-8 h-8 text-blue-400"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M8 2V5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeMiterlimit="10"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M16 2V5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeMiterlimit="10"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M3.5 9.09H20.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeMiterlimit="10"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeMiterlimit="10"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M11.9955 13.7H12.0045"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M8.29431 13.7H8.30329"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M8.29431 16.7H8.30329"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>

                      <h3
                        className={`text-3xl font-bold playfair mb-3 ${activeTabContent.textAccent}`}
                      >
                        {activeTabContent.title}
                      </h3>

                      <div className="grid grid-cols-2 gap-4 text-sm text-left max-w-xs mx-auto">
                        {activeTabContent.features.map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <svg
                              className={`w-4 h-4 ${activeTabContent.textAccent}`}
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M8.91003 19.9201L15.43 13.4001C16.2 12.6301 16.2 11.3701 15.43 10.6001L8.91003 4.08008"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeMiterlimit="10"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <span className="text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Division description */}
              <motion.div
                className="flex flex-col justify-center"
                variants={cardVariants}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.3 }}
              >
                <h3
                  className={`text-4xl font-bold playfair mb-6 ${activeTabContent.textAccent}`}
                >
                  {activeTab === "social" ? "ATK Social" : "ATK Studios"}
                </h3>

                <LineReveal
                  className={`h-0.5 w-16 bg-gradient-to-r ${activeTabContent.accentColor} mb-6`}
                />

                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  {activeTabContent.description}
                </p>

                <motion.a
                  href={activeTab === "social" ? "/social" : "/studio"}
                  className={`inline-flex items-center space-x-2 group w-fit ${activeTabContent.textAccent}`}
                  whileHover="whileHover"
                  variants={cardVariants}
                  data-cursor="magnetic"
                >
                  <span>
                    Explore{" "}
                    {activeTab === "social" ? "ATK Social" : "ATK Studios"}
                  </span>
                  <span className="relative">
                    <svg
                      className="w-6 h-6 transform group-hover:translate-x-1 transition-transform"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14.4301 5.93005L20.5001 12.0001L14.4301 18.0701"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3.5 12H20.33"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span
                      className={`absolute bottom-0 left-0 w-full h-px bg-gradient-to-r ${activeTabContent.accentColor} transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300`}
                    ></span>
                  </span>
                </motion.a>
              </motion.div>

              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-white/20"></div>
              <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-white/20"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-white/20"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-white/20"></div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Company values section */}
      <motion.div
        className="mt-32 max-w-6xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex flex-col md:flex-row gap-16">
          <div className="md:w-1/3">
            <motion.h3
              className="text-3xl font-bold playfair tracking-tighter mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              Our Approach
            </motion.h3>

            <LineReveal className="h-px w-12 bg-white mb-6" />

            <motion.p
              className="text-gray-400"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              We believe in pushing boundaries and creating experiences that
              leave lasting impressions. Our multidisciplinary team works
              collaboratively to deliver exceptional results.
            </motion.p>
          </div>

          <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Innovation",
                description:
                  "We constantly push boundaries and explore new technologies to create groundbreaking experiences that engage and inspire.",
                icon: (
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.47 11.42L2.73 9.68L9.69 2.72L11.43 4.46L4.47 11.42Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12.9502 5.95L10.9102 3.91C10.4202 3.42 10.4202 2.6 10.9102 2.12L11.3002 1.73C11.7902 1.24 12.6102 1.24 13.1002 1.73L14.3002 2.93C14.7902 3.42 14.7902 4.24 14.3002 4.72L13.9102 5.11C13.4202 5.6 12.6002 5.6 12.1102 5.11"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5.95 12.9501L3.91 10.9101C3.42 10.4201 2.6 10.4201 2.12 10.9101L1.73 11.3001C1.24 11.7901 1.24 12.6101 1.73 13.1001L2.93 14.3001C3.42 14.7901 4.24 14.7901 4.72 14.3001L5.11 13.9101C5.6 13.4201 5.6 12.6001 5.11 12.1101"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14.0498 20.01L9.9898 15.95"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16.95 22.01L15.05 20.01"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M21.9998 18.95C21.9998 18.95 19.0298 22.8 15.0498 20.01"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M22 12.99V7.01C22 5.34 20.66 4 19 4H13"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10.76 6.29C7.4 7.22 5 10.31 5 14C5 18.42 8.58 22 13 22"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ),
                delay: 0,
              },
              {
                title: "Quality",
                description:
                  "Every project is handled with meticulous attention to detail, ensuring the highest standard of quality in everything we produce.",
                icon: (
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ),
                delay: 0.1,
              },
              {
                title: "Creativity",
                description:
                  "Our team thrives on creative thinking, bringing fresh perspectives and unique ideas to every challenge.",
                icon: (
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.90039 7.56023C9.21039 3.96023 11.0604 2.49023 15.1104 2.49023H15.2404C19.7104 2.49023 21.5004 4.28023 21.5004 8.75023V15.2702C21.5004 19.7402 19.7104 21.5302 15.2404 21.5302H15.1104C11.0904 21.5302 9.24039 20.0802 8.91039 16.5402"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15 12H3.62"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5.85 8.65039L2.5 12.0004L5.85 15.3504"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ),
                delay: 0.2,
              },
              {
                title: "Collaboration",
                description:
                  "We believe in the power of working together, fostering partnerships with clients and within our team to achieve exceptional results.",
                icon: (
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18 7.16C17.94 7.15 17.87 7.15 17.81 7.16C16.43 7.11 15.33 5.98 15.33 4.58C15.33 3.15 16.48 2 17.91 2C19.34 2 20.49 3.16 20.49 4.58C20.48 5.98 19.38 7.11 18 7.16Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16.9699 14.44C18.3399 14.67 19.8499 14.43 20.9099 13.72C22.3199 12.78 22.3199 11.24 20.9099 10.3C19.8399 9.59004 18.3099 9.35003 16.9399 9.59003"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5.97 7.16C6.03 7.15 6.1 7.15 6.16 7.16C7.54 7.11 8.64 5.98 8.64 4.58C8.64 3.15 7.49 2 6.06 2C4.63 2 3.48 3.16 3.48 4.58C3.49 5.98 4.59 7.11 5.97 7.16Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7 14.44C5.63 14.67 4.12 14.43 3.06 13.72C1.65 12.78 1.65 11.24 3.06 10.3C4.13 9.59004 5.66 9.35003 7.03 9.59003"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 14.63C11.94 14.62 11.87 14.62 11.81 14.63C10.43 14.58 9.32996 13.45 9.32996 12.05C9.32996 10.62 10.48 9.47 11.91 9.47C13.34 9.47 14.49 10.63 14.49 12.05C14.48 13.45 13.38 14.59 12 14.63Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9.08997 17.78C7.67997 18.72 7.67997 20.26 9.08997 21.2C10.69 22.27 13.31 22.27 14.91 21.2C16.32 20.26 16.32 18.72 14.91 17.78C13.32 16.72 10.69 16.72 9.08997 17.78Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ),
                delay: 0.3,
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                className="bg-white/5 border border-white/10 p-6 relative group overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: value.delay }}
                whileHover={{ y: -5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="text-white mb-4">{value.icon}</div>
                <h4 className="text-xl font-bold mb-2">{value.title}</h4>
                <p className="text-gray-400 text-sm">{value.description}</p>

                {/* Corner accents on hover */}
                <div className="absolute top-0 left-0 w-0 h-0 border-t border-l border-white/20 group-hover:w-12 group-hover:h-12 transition-all duration-300"></div>
                <div className="absolute bottom-0 right-0 w-0 h-0 border-b border-r border-white/20 group-hover:w-12 group-hover:h-12 transition-all duration-300"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default About;
