"use client";

import { useRef, useState, useMemo } from "react";
import { motion, AnimatePresence, useInView, Variants } from "framer-motion";
import Image from "next/image";

// Types for brand partnerships
interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
  company: string;
  image?: string;
}

interface BrandPartner {
  id: number;
  name: string;
  logo: string;
  description: string;
  category: "social" | "studios" | "both";
  testimonial?: Testimonial;
  featured?: boolean;
}

interface CategoryFilter {
  key: "all" | "social" | "studios" | "both";
  label: string;
}

// Text reveal component
const TextReveal = ({
  children,
  delay = 0,
}: {
  children: string;
  delay?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <span ref={ref} className="block overflow-hidden relative">
      <motion.span
        className="block"
        initial={{ y: 100 }}
        animate={isInView ? { y: 0 } : { y: 100 }}
        transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1],
          delay: delay,
        }}
      >
        {children}
      </motion.span>
    </span>
  );
};

// Magnetic component for hover effects
const MagneticElement = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!elementRef.current) return;

    const rect = elementRef.current.getBoundingClientRect();
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
  };

  return (
    <motion.div
      ref={elementRef}
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

// Brand Logo Card component
const BrandCard = ({
  brand,
  onClick,
}: {
  brand: BrandPartner & { isActive?: boolean };
  onClick: () => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Get category color styles
  const getCategoryStyle = () => {
    switch (brand.category) {
      case "social":
        return {
          borderColor: "border-purple-500/20",
          hoverBorderColor: "group-hover:border-purple-500/40",
          glowColor: "bg-purple-600/5",
        };
      case "studios":
        return {
          borderColor: "border-blue-500/20",
          hoverBorderColor: "group-hover:border-blue-500/40",
          glowColor: "bg-blue-600/5",
        };
      case "both":
        // Use standard Tailwind classes instead of custom gradient classes
        return {
          borderColor:
            "border-transparent bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-[1px]",
          hoverBorderColor:
            "group-hover:from-purple-500/30 group-hover:to-blue-500/30",
          glowColor: "bg-gradient-to-br from-purple-600/5 to-blue-600/5",
        };
    }
  };

  const styles = getCategoryStyle();

  return (
    <motion.div
      className={`relative group ${
        brand.category === "both"
          ? "p-[1px] bg-gradient-to-br from-purple-500/20 to-blue-500/20"
          : `border ${styles.borderColor}`
      } transition-all duration-300 hover:bg-black/50`}
      variants={cardVariants}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      data-cursor="view"
      whileHover={{
        y: -5,
        transition: { duration: 0.3 },
      }}
    >
      {brand.category === "both" && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-50 group-hover:opacity-80 transition-opacity duration-300"></div>
      )}

      <div className="relative bg-black p-8 md:p-12 flex flex-col items-center justify-center cursor-none w-full h-full">
        {/* Rest of the card content */}
        <div
          className={`absolute -bottom-20 -right-20 w-64 h-64 ${styles.glowColor} rounded-full filter blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-500`}
        ></div>

        {/* Original corner decorations */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute top-0 left-0 w-5 h-px bg-white/30"></div>
          <div className="absolute top-0 left-0 w-px h-5 bg-white/30"></div>
          <div className="absolute top-0 right-0 w-5 h-px bg-white/30"></div>
          <div className="absolute top-0 right-0 w-px h-5 bg-white/30"></div>
          <div className="absolute bottom-0 left-0 w-5 h-px bg-white/30"></div>
          <div className="absolute bottom-0 left-0 w-px h-5 bg-white/30"></div>
          <div className="absolute bottom-0 right-0 w-5 h-px bg-white/30"></div>
          <div className="absolute bottom-0 right-0 w-px h-5 bg-white/30"></div>
        </div>

        <div className="relative w-full h-24 flex items-center justify-center mb-6">
          <Image
            src={brand.logo}
            alt={brand.name}
            width={160}
            height={80}
            className="object-contain transition-all duration-500 filter grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100"
          />
        </div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 10,
          }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-lg font-medium text-white mb-2">{brand.name}</h3>
          <p className="text-sm text-gray-400">{brand.description}</p>

          {/* Category indicator */}
          <div className="mt-4 flex justify-center">
            {brand.category === "social" && (
              <span className="text-xs py-1 px-2 bg-purple-900/20 text-purple-300 border border-purple-500/30">
                ATK Social
              </span>
            )}
            {brand.category === "studios" && (
              <span className="text-xs py-1 px-2 bg-blue-900/20 text-blue-300 border border-blue-500/30">
                ATK Studios
              </span>
            )}
            {brand.category === "both" && (
              <div className="flex space-x-2">
                <span className="text-xs py-1 px-2 bg-purple-900/20 text-purple-300 border border-purple-500/30">
                  ATK Social
                </span>
                <span className="text-xs py-1 px-2 bg-blue-900/20 text-blue-300 border border-blue-500/30">
                  ATK Studios
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Featured testimonial component
const FeaturedTestimonial = ({ testimonial }: { testimonial: Testimonial }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      className="relative border border-white/10 p-12 md:p-16 bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-10 h-10 border-t border-l border-white/20 -translate-x-px -translate-y-px"></div>
      <div className="absolute top-0 right-0 w-10 h-10 border-t border-r border-white/20 translate-x-px -translate-y-px"></div>
      <div className="absolute bottom-0 left-0 w-10 h-10 border-b border-l border-white/20 -translate-x-px translate-y-px"></div>
      <div className="absolute bottom-0 right-0 w-10 h-10 border-b border-r border-white/20 translate-x-px translate-y-px"></div>

      <div className="flex flex-col items-center text-center">
        <svg
          className="w-12 h-12 text-white/10 mb-8"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M11.3 6.22a1 1 0 0 0-1.6 1.16L11 10H8a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2v-9a1 1 0 0 0-.6-.92A6.25 6.25 0 0 0 11.3 6.22ZM20.1 5a1 1 0 0 0-1.95.32l.5 3L16 9.8a2 2 0 0 0-1 1.74v2.92a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2v-4a2 2 0 0 0-1.23-1.84A6.25 6.25 0 0 0 20.1 5Z" />
        </svg>

        <blockquote className="text-2xl playfair italic text-white/80 mb-8 leading-relaxed">
          &quot;{testimonial.quote}&quot;
        </blockquote>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-white/10">
            <Image
              src={testimonial.image || "images/placeholder.png"}
              alt={testimonial.author}
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
          <div className="text-left">
            <h4 className="font-medium text-white">{testimonial.author}</h4>
            <p className="text-sm text-white/60">
              {testimonial.role}, {testimonial.company}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// Detail modal component for brand details
const BrandDetailModal = ({
  brand,
  onClose,
}: {
  brand: BrandPartner | null;
  onClose: () => void;
}) => {
  // If no brand, don't render
  if (!brand) return null;

  // Get color scheme based on category
  const getColorScheme = () => {
    switch (brand.category) {
      case "social":
        return {
          accent: "from-purple-400 via-purple-600 to-purple-400",
          bgGlow: "bg-purple-900/10",
          border: "border-purple-500/30",
        };
      case "studios":
        return {
          accent: "from-blue-400 via-blue-600 to-blue-400",
          bgGlow: "bg-blue-900/10",
          border: "border-blue-500/30",
        };
      case "both":
        return {
          accent: "from-purple-400 via-blue-600 to-purple-400",
          bgGlow: "bg-gradient-to-br from-purple-900/10 to-blue-900/10",
          border:
            "border-transparent bg-gradient-to-br from-purple-500/20 to-blue-500/20 p-[1px]",
        };
    }
  };

  const colorScheme = getColorScheme();

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative bg-black/90 border border-white/10 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Ambient light */}
          <div
            className={`absolute -top-40 -left-40 w-80 h-80 ${colorScheme.bgGlow} rounded-full filter blur-3xl opacity-30`}
          ></div>

          {/* Close button */}
          <button
            className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center border border-white/20 bg-black/50 z-10 hover:border-white/40 transition-colors"
            onClick={onClose}
          >
            <svg
              className="w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Logo section */}
            <div className="bg-black/80 p-12 flex flex-col items-center justify-center relative">
              <div className="mb-6 relative">
                {/* Border frame */}
                <div className="absolute inset-0 border border-white/10 -m-3"></div>

                <div className="w-48 h-32 flex items-center justify-center">
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    width={160}
                    height={80}
                    className="object-contain"
                  />
                </div>
              </div>

              <h2 className="text-2xl font-bold mb-2 text-white">
                {brand.name}
              </h2>
              <p className="text-gray-400 text-center">{brand.description}</p>

              {/* Category indicators */}
              <div className="mt-6 flex justify-center space-x-3">
                {(brand.category === "social" || brand.category === "both") && (
                  <div
                    className={`py-1.5 px-4 bg-purple-900/20 border ${colorScheme.border} flex items-center space-x-2`}
                  >
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    <span className="text-xs uppercase tracking-wider text-purple-300">
                      ATK Social
                    </span>
                  </div>
                )}

                {(brand.category === "studios" ||
                  brand.category === "both") && (
                  <div className="py-1.5 px-4 bg-blue-900/20 border border-blue-500/30 flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span className="text-xs uppercase tracking-wider text-blue-300">
                      ATK Studios
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Testimonial section */}
            {brand.testimonial && (
              <div className="p-12 flex items-center">
                <div>
                  <h3 className="text-xl font-medium mb-6 text-white">
                    Client Success Story
                  </h3>

                  <div
                    className={`h-0.5 w-12 bg-gradient-to-r ${colorScheme.accent} mb-8`}
                  ></div>

                  <blockquote className="text-lg italic text-gray-300 mb-8">
                    &quot;{brand.testimonial.quote}&quot;
                  </blockquote>

                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 mr-3">
                      <Image
                        src={
                          brand.testimonial.image ||
                          "/images/placeholders/48.png"
                        }
                        alt={brand.testimonial.author}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-white text-sm">
                        {brand.testimonial.author}
                      </h4>
                      <p className="text-xs text-white/60">
                        {brand.testimonial.role}, {brand.testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-white/10 p-6 flex justify-between items-center">
            <p className="text-sm text-gray-400">View our client portfolio</p>

            <MagneticElement>
              <button
                className="px-4 py-2 border border-white/20 hover:border-white/40 text-sm text-white transition-colors flex items-center space-x-2"
                onClick={onClose}
              >
                <span>Back to Brands</span>
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 19L8 12L15 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </MagneticElement>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Main component
const Brands = () => {
  // state and refs
  const sectionRef = useRef<HTMLElement>(null);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "social" | "studios" | "both"
  >("all");
  const [selectedBrand, setSelectedBrand] = useState<BrandPartner | null>(null);

  // Filter options
  const filters: CategoryFilter[] = [
    { key: "all", label: "All Partners" },
    { key: "social", label: "ATK Social" },
    { key: "studios", label: "ATK Studios" },
    { key: "both", label: "Both Divisions" },
  ];

  // Brand partners data
  const brandPartners = useMemo(
    () => [
      {
        id: 1,
        name: "Microsoft",
        logo: "/images/work/microsoftlogo.png",
        description: "Strategic partnership for digital experience design",
        category: "social",
        featured: true,
        testimonial: {
          id: 1,
          quote:
            "ATK Studios transformed our approach to interactive experiences with their innovative development solutions. Their team delivered beyond our expectations, creating immersive environments that truly engage our audience.",
          author: "Sarah Johnson",
          role: "Digital Innovation Director",
          company: "Microsoft",
          image: "/images/placeholder.png",
        },
      },
      {
        id: 2,
        name: "Steam",
        logo: "/images/work/steamlogo.png",
        description: "Game distribution and community management",
        category: "studios",
      },
      {
        id: 3,
        name: "Apex Hosting",
        logo: "/images/work/apexhostinglogo.png",
        description: "Custom content creation and social media strategy",
        category: "social",
      },
      {
        id: 4,
        name: "Epic Gams",
        logo: "/images/work/epicgameslogo.png",
        description: "Game development tools and Unreal Engine expertise",
        category: "studios",
      },
      // {
      //   id: 5,
      //   name: "Twitch",
      //   logo: "/images/placeholder.png",
      //   description: "Creator content strategy and platform integration",
      //   category: "social",
      // },
      // {
      //   id: 6,
      //   name: "Amazon",
      //   logo: "/images/placeholder.png",
      //   description: "Game development tools and Unreal Engine expertise",
      //   category: "studios",
      // },
      // {
      //   id: 7,
      //   name: "EA Sports",
      //   logo: "/images/placeholder.png",
      //   description: "Interactive sports experiences and content creation",
      //   category: "both",
      // },
      // {
      //   id: 8,
      //   name: "Bandai Namco",
      //   logo: "/images/placeholder.png",
      //   description: "Character design and social media engagement",
      //   category: "social",
      // },
    ],
    []
  );

  const brandsWithActiveState = useMemo(() => {
    return brandPartners.map((brand) => {
      const brandWithActive: BrandPartner & { isActive: boolean } = {
        ...brand,
        category: brand.category as "social" | "studios" | "both",
        isActive: activeFilter === "all" || brand.category === activeFilter,
      };
      return brandWithActive;
    });
  }, [activeFilter, brandPartners]);

  // Handle filter change
  const handleFilterChange = (
    filterType: "all" | "social" | "studios" | "both"
  ) => {
    setActiveFilter(filterType);
  };

  // Find featured testimonial
  const featuredBrand = brandPartners.find(
    (brand) => brand.featured && brand.testimonial
  );
  const featuredTestimonial = featuredBrand?.testimonial;

  return (
    <section
      id="clients"
      ref={sectionRef}
      className="py-32 md:py-40 relative overflow-hidden bg-black"
    >
      {/* Background elements */}
      <div className="absolute inset-0 noise-texture opacity-30"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-white/10"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-white/10"></div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="mb-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h3 className="text-sm uppercase tracking-[0.2em] text-gray-500 mb-3">
            Partners in Excellence
          </h3>

          <div className="overflow-hidden">
            <h2 className="text-5xl md:text-7xl font-bold playfair tracking-tighter mb-8">
              <TextReveal>Our Clients</TextReveal>
            </h2>
          </div>

          <div className="h-px w-20 bg-white/40 mx-auto mb-8"></div>

          <p className="text-xl max-w-2xl mx-auto manrope text-gray-300">
            Collaborating with forward-thinking brands to create exceptional
            experiences
          </p>
        </motion.div>

        {/* Filter tabs */}
        <div className="mb-16 flex flex-wrap justify-center gap-3">
          {filters.map((filter) => (
            <motion.button
              key={filter.key}
              className={`px-4 py-2 text-sm border ${
                activeFilter === filter.key
                  ? "border-white text-white"
                  : "border-white/20 text-gray-400 hover:border-white/40 hover:text-white"
              } transition-colors`}
              onClick={() => handleFilterChange(filter.key)}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              {filter.label}
            </motion.button>
          ))}
        </div>

        {/* Brand grid */}
        <div className="max-w-6xl mx-auto mb-24">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-2"
            layout
            transition={{
              layout: {
                type: "spring",
                bounce: 0.2,
                duration: 0.6,
              },
            }}
          >
            {brandsWithActiveState.map((brand) => (
              <motion.div
                key={brand.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: brand.isActive ? 1 : 0,
                  scale: brand.isActive ? 1 : 0.8,
                  // This makes inactive brands take no space in the layout
                  width: brand.isActive ? "auto" : 0,
                  height: brand.isActive ? "auto" : 0,
                  margin: brand.isActive ? "inherit" : 0,
                  // Hide from screen readers when inactive
                  visibility: brand.isActive ? "visible" : "hidden",
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  opacity: { duration: 0.3 },
                  scale: { duration: 0.3 },
                  layout: {
                    type: "spring",
                    bounce: 0.2,
                    duration: 0.6,
                  },
                }}
                style={{
                  // Only active items participate in the grid
                  display: brand.isActive ? "block" : "none",
                }}
                className={brand.isActive ? "" : "absolute pointer-events-none"}
              >
                <BrandCard
                  brand={brand}
                  onClick={() => setSelectedBrand(brand)}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Featured testimonial */}
        {featuredTestimonial && (
          <div className="mt-20 max-w-4xl mx-auto">
            <FeaturedTestimonial testimonial={featuredTestimonial} />
          </div>
        )}

        {/* CTA section */}
        <motion.div
          className="mt-32 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h3 className="text-2xl font-bold mb-6 playfair">
            Ready to join them?
          </h3>

          <MagneticElement>
            <a
              href="#contact"
              className="group px-10 py-4 bg-transparent border border-white text-white font-medium relative overflow-hidden inline-block uppercase tracking-wider text-sm"
              data-cursor="text"
              data-cursor-text="Connect"
              data-cursor-rotate="true"
            >
              <span className="relative z-10 transition-transform duration-500 group-hover:translate-y-[-150%] inline-block">
                Let&apos;s work together
              </span>
              <span className="absolute inset-0 flex items-center justify-center text-white transition-transform duration-500 translate-y-[150%] group-hover:translate-y-0">
                Get in touch
              </span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
            </a>
          </MagneticElement>
        </motion.div>
      </div>

      {/* Brand detail modal */}
      <BrandDetailModal
        brand={selectedBrand}
        onClose={() => setSelectedBrand(null)}
      />
    </section>
  );
};

export default Brands;
