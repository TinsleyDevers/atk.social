"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const EnhancedNavbar = () => {
  // State management
  // State management
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hoveringBrand, setHoveringBrand] = useState(false);

  // Refs for menu animation
  const menuRef = useRef<HTMLDivElement>(null);

  // NavItems
  const navItems = [
    { name: "HOME", href: "#home" },
    { name: "ABOUT", href: "#about" },
    { name: "ATK SOCIAL", href: "#social" },
    { name: "ATK STUDIOS", href: "#studios" },
    { name: "BRANDS", href: "#clients" },
    { name: "TEAM", href: "#team" },
    { name: "CONTACT", href: "#contact" },
  ];

  // Brand partners data
  const brands = [
    {
      id: 1,
      name: "Microsoft",
      logo: "/images/work/microsoftlogo.png",
      description: "Strategic partnership for digital experience design",
    },
    {
      id: 2,
      name: "Steam",
      logo: "/images/work/steamlogo.png",
      description: "Game distribution and community management",
    },
    {
      id: 3,
      name: "Apex Hosting",
      logo: "/images/work/apexhostinglogo.png",
      description: "Custom content creation and social media strategy",
    },
  ];

  const getDropdownPosition = (itemName: string) => {
    if (itemName === "CONTACT" || itemName === "TEAM") {
      return { right: 0, left: "auto", transform: "none" };
    }
    if (
      itemName === "BRANDS" ||
      itemName === "ATK SOCIAL" ||
      itemName === "ATK STUDIOS"
    ) {
      return { left: "auto", transform: "none" };
    }

    return {};
  };

  useEffect(() => {
    // Optimized scroll handler with requestAnimationFrame
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Get all sections
          const sections = document.querySelectorAll("section, footer");
          let currentSection = "home";
          let smallestDistance = Infinity;

          // Calculate current viewport position (middle of the screen)
          const viewportMiddle = window.scrollY + window.innerHeight / 2;

          // Find which section is closest to the middle of the viewport
          sections.forEach((section) => {
            // Add type assertions to access HTMLElement properties
            const sectionTop = (section as HTMLElement).offsetTop;
            const sectionHeight = (section as HTMLElement).offsetHeight;
            const sectionMiddle = sectionTop + sectionHeight / 2;
            const distance = Math.abs(viewportMiddle - sectionMiddle);

            // If this section is closer to the viewport middle than previous sections
            if (distance < smallestDistance) {
              smallestDistance = distance;
              // Special case for footer - map it to the last nav item
              if (section.tagName.toLowerCase() === "footer") {
                currentSection = "contact"; // Map footer to your last nav item
              } else {
                // Get section id or default to home
                currentSection = section.id || "home";
              }
            }
          });

          setActiveSection(currentSection);

          // Scroll progress for UI effects
          const totalHeight =
            document.documentElement.scrollHeight - window.innerHeight;
          const progress = window.scrollY / totalHeight;
          setScrollProgress(progress);

          // Determine if hero section is still visible
          const heroSection = document.getElementById("home");
          if (heroSection) {
            const heroRect = heroSection.getBoundingClientRect();
            setIsHeroVisible(heroRect.bottom > 0);
          }

          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial call to set correct section on load

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Menu animation variants
  const menuVariants = {
    closed: {
      opacity: 0,
      clipPath: "circle(0% at calc(100% - 35px) 35px)",
      transition: {
        duration: 0.7,
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.05,
        staggerDirection: -1,
        when: "afterChildren",
      },
    },
    open: {
      opacity: 1,
      clipPath: "circle(150% at calc(100% - 35px) 35px)",
      transition: {
        duration: 0.7,
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.1,
        delayChildren: 0.1,
        when: "beforeChildren",
      },
    },
  };

  // Menu item animation variants
  const itemVariants = {
    closed: {
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    },
  };

  // Brands dropdown animation variants
  const brandsDropdownVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    },
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
        scrolled ? "py-3 bg-black/90 backdrop-blur-md" : "py-6 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link href="#home">
          <motion.div
            className="text-2xl font-bold tracking-tighter relative flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            data-cursor="link"
            data-cursor-text="Home"
            data-cursor-rotate="true"
          >
            <div className="w-12 h-12 relative">
              <Image
                src="/images/ATKLogoTransparent.png"
                alt="ATK"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </div>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-4 lg:space-x-8">
          {navItems.map((item, i) => {
            // Determine section colors based on menu item
            const getSectionColors = () => {
              switch (item.name) {
                case "ATK SOCIAL":
                  return {
                    primary: "text-purple-400",
                    secondary: "text-purple-300",
                    border: "border-purple-500",
                    gradient: "from-purple-500 to-purple-300",
                    bg: "bg-purple-900/10",
                    activeBg: "bg-purple-500",
                  };
                case "ATK STUDIOS":
                  return {
                    primary: "text-blue-400",
                    secondary: "text-blue-300",
                    border: "border-blue-500",
                    gradient: "from-blue-500 to-blue-300",
                    bg: "bg-blue-900/10",
                    activeBg: "bg-blue-500",
                  };
                case "BRANDS":
                  return {
                    primary: "text-white",
                    secondary: "text-gray-200",
                    border: "border-white",
                    gradient: "from-white to-gray-300",
                    bg: "bg-white/10",
                    activeBg: "bg-white",
                  };
                case "TEAM":
                  return {
                    primary: "text-white",
                    secondary: "text-gray-200",
                    border: "border-white",
                    gradient: "from-white to-gray-300",
                    bg: "bg-white/10",
                    activeBg: "bg-white",
                  };
                case "CONTACT":
                  return {
                    primary: "text-indigo-400",
                    secondary: "text-indigo-300",
                    border: "border-indigo-500",
                    gradient: "from-indigo-500 to-indigo-300",
                    bg: "bg-indigo-900/10",
                    activeBg: "bg-indigo-500",
                  };
                default:
                  return {
                    primary: "text-white",
                    secondary: "text-gray-200",
                    border: "border-white",
                    gradient: "from-white to-gray-300",
                    bg: "bg-white/10",
                    activeBg: "bg-white",
                  };
              }
            };

            const colors = getSectionColors();

            // Determine if this is the active section
            const isActive = activeSection === item.href.substring(1);
            const isHovered = hoveredItem === item.name;

            return (
              <div
                key={i}
                className="relative"
                onMouseEnter={() => {
                  setHoveredItem(item.name);
                  if (item.name === "BRANDS") setHoveringBrand(true);
                }}
                onMouseLeave={() => {
                  setHoveredItem(null);
                  if (item.name === "BRANDS") setHoveringBrand(false);
                }}
              >
                <Link
                  href={item.href}
                  className={`text-sm tracking-wider transition-all duration-300 relative py-2 px-3 group overflow-hidden ${
                    isActive ? colors.primary : "text-gray-400 hover:text-white"
                  }`}
                  data-cursor="magnetic"
                  data-magnetic="true"
                >
                  {/* Hover background animation */}
                  <motion.div
                    className={`absolute inset-0 ${colors.bg} opacity-0 transition-opacity duration-300 -z-10`}
                    animate={{ opacity: isHovered && !isActive ? 0.1 : 0 }}
                  />

                  <span className="relative z-10">{item.name}</span>

                  {/* Active indicator with gradient */}
                  {isActive && (
                    <motion.span
                      className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r ${colors.gradient}`}
                      layoutId="activeSection"
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 30,
                      }}
                    />
                  )}

                  {/* Hover indicator with shimmer effect */}
                  {isHovered && !isActive && (
                    <>
                      <motion.span
                        className={`absolute bottom-0 left-0 w-full h-px ${colors.activeBg} opacity-50`}
                        initial={{ scaleX: 0, translateX: "-100%" }}
                        animate={{ scaleX: 1, translateX: "0%" }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      />
                      <motion.span
                        className="absolute inset-0 bg-white/5 -z-10"
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{ scaleX: 1, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                      <motion.div
                        className="absolute inset-0 -z-5 opacity-10"
                        animate={{
                          background: [
                            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
                            "linear-gradient(90deg, transparent 100%, rgba(255,255,255,0.1) 50%, transparent 0%)",
                          ],
                          left: ["-100%", "100%"],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.5,
                          ease: "linear",
                        }}
                      />
                    </>
                  )}
                </Link>

                {/* Menu dropdown container */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-black/90 backdrop-blur-md border border-white/10 z-50"
                      style={getDropdownPosition(item.name)}
                      variants={brandsDropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      {/* Brands dropdown content */}
                      {item.name === "BRANDS" && (
                        <div className="p-4">
                          <h4 className="text-xs uppercase tracking-wider text-gray-400 mb-3">
                            Brand Partners
                          </h4>
                          {brands.map((brand) => (
                            <div
                              key={brand.id}
                              className="mb-4 last:mb-0 group"
                            >
                              <div className="flex items-center">
                                <div className="w-8 h-8 relative mr-3 bg-white/5 flex items-center justify-center p-1">
                                  <Image
                                    src={brand.logo}
                                    alt={brand.name}
                                    width={24}
                                    height={24}
                                    className="object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                                  />
                                </div>
                                <div>
                                  <h5 className="text-sm text-white group-hover:text-white transition-colors duration-300">
                                    {brand.name}
                                  </h5>
                                  <p className="text-xs text-gray-500">
                                    {brand.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                          <div className="mt-3 pt-3 border-t border-white/10">
                            <Link
                              href="#clients"
                              className="text-xs text-white hover:text-gray-300 flex items-center"
                            >
                              View all partners
                              <svg
                                className="w-3 h-3 ml-1"
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
                            </Link>
                          </div>
                        </div>
                      )}

                      {/* ATK SOCIAL dropdown */}
                      {item.name === "ATK SOCIAL" && (
                        <div className="p-4">
                          <h4 className="text-xs uppercase tracking-wider text-gray-400 mb-3">
                            Content Creation
                          </h4>
                          {[
                            {
                              title: "Social Media Strategy",
                              desc: "Platform-specific content strategies",
                            },
                            {
                              title: "Influencer Marketing",
                              desc: "Authentic brand partnerships",
                            },
                            {
                              title: "Brand Development",
                              desc: "Visual identity and storytelling",
                            },
                          ].map((service, idx) => (
                            <div key={idx} className="mb-4 last:mb-0 group">
                              <div className="flex items-center">
                                <div className="w-8 h-8 relative mr-3 bg-purple-900/20 border border-purple-900/20 flex items-center justify-center">
                                  <svg
                                    className="w-4 h-4 text-purple-400"
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
                                </div>
                                <div>
                                  <h5 className="text-sm text-white group-hover:text-purple-300 transition-colors duration-300">
                                    {service.title}
                                  </h5>
                                  <p className="text-xs text-gray-500">
                                    {service.desc}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                          <div className="mt-3 pt-3 border-t border-white/10">
                            <Link
                              href="#social"
                              className="text-xs text-purple-400 hover:text-purple-300 flex items-center"
                            >
                              Explore ATK Social
                              <svg
                                className="w-3 h-3 ml-1"
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
                            </Link>
                          </div>
                        </div>
                      )}

                      {/* ATK STUDIOS dropdown */}
                      {item.name === "ATK STUDIOS" && (
                        <div className="p-4">
                          <h4 className="text-xs uppercase tracking-wider text-gray-400 mb-3">
                            Game Development
                          </h4>
                          {[
                            {
                              title: "Game Design",
                              desc: "Gameplay & narrative systems",
                            },
                            {
                              title: "Interactive Experiences",
                              desc: "Immersive digital worlds",
                            },
                            {
                              title: "3D Development",
                              desc: "Cutting-edge graphics & animation",
                            },
                          ].map((service, idx) => (
                            <div key={idx} className="mb-4 last:mb-0 group">
                              <div className="flex items-center">
                                <div className="w-8 h-8 relative mr-3 bg-blue-900/20 border border-blue-900/20 flex items-center justify-center">
                                  <svg
                                    className="w-4 h-4 text-blue-400"
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
                                </div>
                                <div>
                                  <h5 className="text-sm text-white group-hover:text-blue-300 transition-colors duration-300">
                                    {service.title}
                                  </h5>
                                  <p className="text-xs text-gray-500">
                                    {service.desc}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                          <div className="mt-3 pt-3 border-t border-white/10">
                            <Link
                              href="#studios"
                              className="text-xs text-blue-400 hover:text-blue-300 flex items-center"
                            >
                              Explore ATK Studios
                              <svg
                                className="w-3 h-3 ml-1"
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
                            </Link>
                          </div>
                        </div>
                      )}

                      {/* TEAM dropdown */}
                      {item.name === "TEAM" && (
                        <div className="p-4">
                          <h4 className="text-xs uppercase tracking-wider text-gray-400 mb-3">
                            Our Team
                          </h4>
                          {[
                            {
                              title: "Leadership",
                              desc: "Experienced industry professionals",
                            },
                            {
                              title: "Creators",
                              desc: "Content specialists & designers",
                            },
                            {
                              title: "Developers",
                              desc: "Interactive experience engineers",
                            },
                          ].map((category, idx) => (
                            <div key={idx} className="mb-4 last:mb-0 group">
                              <div className="flex items-center">
                                <div className="w-8 h-8 relative mr-3 bg-white/10 border border-white/10 flex items-center justify-center">
                                  <svg
                                    className="w-4 h-4 text-white"
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
                                </div>
                                <div>
                                  <h5 className="text-sm text-white group-hover:text-white transition-colors duration-300">
                                    {category.title}
                                  </h5>
                                  <p className="text-xs text-gray-500">
                                    {category.desc}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                          <div className="mt-3 pt-3 border-t border-white/10">
                            <Link
                              href="#team"
                              className="text-xs text-white hover:text-gray-300 flex items-center"
                            >
                              Meet our team
                              <svg
                                className="w-3 h-3 ml-1"
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
                            </Link>
                          </div>
                        </div>
                      )}

                      {/* CONTACT dropdown */}
                      {item.name === "CONTACT" && (
                        <div className="p-4 relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-indigo-900/10 opacity-50"></div>

                          <div className="relative z-10">
                            <h4 className="text-xs uppercase tracking-wider text-gray-400 mb-3">
                              Get In Touch
                            </h4>

                            <div className="flex items-center mb-4">
                              <div className="w-8 h-8 relative mr-3 bg-indigo-900/20 border border-indigo-900/20 flex items-center justify-center">
                                <svg
                                  className="w-4 h-4 text-indigo-400"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M17 20.5H7C4 20.5 2 19 2 15.5V8.5C2 5 4 3.5 7 3.5H17C20 3.5 22 5 22 8.5V15.5C22 19 20 20.5 17 20.5Z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeMiterlimit="10"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M17 9L13.87 11.5C12.84 12.32 11.15 12.32 10.12 11.5L7 9"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeMiterlimit="10"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                              <Link
                                href="mailto:info@atkgroup.com"
                                className="text-sm text-white hover:text-indigo-300 transition-colors duration-300"
                              >
                                info@atkgroup.com
                              </Link>
                            </div>

                            <div className="mt-3 pt-3 border-t border-white/10">
                              <Link
                                href="#contact"
                                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center"
                              >
                                Contact Us
                                <svg
                                  className="w-3 h-3 ml-1"
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
                              </Link>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="flex md:hidden flex-col justify-center items-center w-10 h-10 z-50"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          <span
            className={`w-6 h-0.5 bg-white block transition-all duration-300 ${
              isOpen ? "rotate-45 translate-y-1.5" : ""
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-white block my-1.5 transition-all duration-300 ${
              isOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-white block transition-all duration-300 ${
              isOpen ? "-rotate-45 -translate-y-1.5" : ""
            }`}
          />
        </button>
      </div>

      {/* Scroll Progress Indicator - hidden on hero section */}
      {!isHeroVisible && (
        <motion.div
          className="absolute bottom-0 left-0 h-[1px] bg-white origin-left"
          style={{
            scaleX: scrollProgress,
            opacity: isHeroVisible ? 0 : 1,
          }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black z-40 flex flex-col justify-center items-center md:hidden"
            ref={menuRef}
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            <nav className="flex flex-col items-center space-y-8">
              {navItems.map((item, i) => (
                <motion.div key={i} variants={itemVariants}>
                  <Link
                    href={item.href}
                    className={`text-2xl font-medium transition-colors ${
                      activeSection === item.href.substring(1)
                        ? "text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Brands section in mobile menu */}
            <motion.div
              className="absolute bottom-40 left-0 w-full px-8"
              variants={itemVariants}
            >
              <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-3 text-center">
                Brand Partners
              </h4>
              <div className="flex justify-center space-x-4">
                {brands.map((brand) => (
                  <div
                    key={brand.id}
                    className="w-12 h-12 bg-white/5 rounded-sm flex items-center justify-center"
                  >
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      width={28}
                      height={28}
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Social Links in Mobile Menu */}
            <motion.div
              className="absolute bottom-20 left-0 w-full flex justify-center"
              variants={itemVariants}
            >
              <div className="flex space-x-8">
                <a
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-white/20 text-gray-400 hover:text-white hover:border-white/50 transition-all"
                  aria-label="Twitter"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-white/20 text-gray-400 hover:text-white hover:border-white/50 transition-all"
                  aria-label="Instagram"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="2"
                      y="2"
                      width="20"
                      height="20"
                      rx="5"
                      ry="5"
                    ></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-white/20 text-gray-400 hover:text-white hover:border-white/50 transition-all"
                  aria-label="LinkedIn"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default EnhancedNavbar;
