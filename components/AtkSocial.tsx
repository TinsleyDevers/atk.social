"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";
import Image from "next/image";

// Project definition
interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  video?: string;
  client?: string;
  tags: string[];
  featured?: boolean;
}

// Dynamic text reveal component for headings
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

// Magnetic button component for interactive elements
const MagneticButton = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
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

// Parallax image component
const ParallaxImage = ({
  src,
  alt,
  className,
  strength = 100,
}: {
  src: string;
  alt: string;
  className?: string;
  strength?: number;
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, strength]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 1]);

  return (
    <motion.div
      ref={ref}
      className={`${className} overflow-hidden relative`}
      style={{ y }}
    >
      <motion.div style={{ scale }} className="w-full h-full">
        <Image
          src={src.startsWith("/") ? src : "/images/placeholder.jpg"}
          alt={alt}
          fill
          className="object-cover"
          data-cursor-image="true"
        />
      </motion.div>
    </motion.div>
  );
};

// Horizontal scroll project gallery TODO: IMPLEMENT DRAG SCROLLING FOR
const HorizontalGallery = ({ projects }: { projects: Project[] }) => {
  const galleryRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (galleryRef.current) {
        const scrollWidth = galleryRef.current.scrollWidth;
        const clientWidth = galleryRef.current.clientWidth;
        setWidth(scrollWidth - clientWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const { scrollYProgress } = useScroll({
    target: galleryRef,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0.15, 0.85], [0, -width]);
  const smoothX = useSpring(x, { damping: 15, stiffness: 100 });

  return (
    <div className="relative h-[70vh] overflow-hidden my-24" ref={galleryRef}>
      <motion.div
        className="absolute top-0 left-0 h-full flex items-center"
        style={{ x: smoothX }}
      >
        <div className="flex gap-6 pl-[10vw]">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center opacity-60">
        <p className="text-sm uppercase tracking-widest mb-3">
          Scroll to explore
        </p>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-5 h-9 border border-white/50 rounded-full flex justify-center pt-1"
        >
          <motion.div
            className="w-1 h-2 bg-white rounded-full"
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        </motion.div>
      </div>
    </div>
  );
};

// Project card component with hover effects
const ProjectCard = ({ project }: { project: Project }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative h-[500px] w-[450px] flex-shrink-0 cursor-none group"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      data-cursor="view"
      data-cursor-text="View"
      data-cursor-rotate="true"
    >
      {/* Image container with parallax effect */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        animate={{
          scale: isHovered ? 0.95 : 1,
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <Image
          src={
            project.image.startsWith("/")
              ? project.image
              : "/images/placeholder.png"
          }
          alt={project.title}
          fill
          className="object-cover transition-transform duration-700 ease-out scale-100 group-hover:scale-105"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70 z-10" />

        {/* Border frame animation */}
        <motion.div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <motion.div
            className="absolute top-4 left-4 w-12 h-12 border-t border-l border-white/20"
            animate={
              isHovered ? { width: 72, height: 72 } : { width: 48, height: 48 }
            }
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.div
            className="absolute top-4 right-4 w-12 h-12 border-t border-r border-white/20"
            animate={
              isHovered ? { width: 72, height: 72 } : { width: 48, height: 48 }
            }
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.div
            className="absolute bottom-4 left-4 w-12 h-12 border-b border-l border-white/20"
            animate={
              isHovered ? { width: 72, height: 72 } : { width: 48, height: 48 }
            }
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.div
            className="absolute bottom-4 right-4 w-12 h-12 border-b border-r border-white/20"
            animate={
              isHovered ? { width: 72, height: 72 } : { width: 48, height: 48 }
            }
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </motion.div>
      </motion.div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 w-full p-8 z-20 text-white">
        <motion.h3
          className="text-2xl font-bold playfair mb-2"
          animate={{ y: isHovered ? -8 : 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {project.title}
        </motion.h3>

        <motion.p
          className="text-white/75 text-sm max-w-xs mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 20,
          }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {project.description}
        </motion.p>

        {/* Tags */}
        <motion.div
          className="flex flex-wrap gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 10,
          }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          {project.tags.map((tag, index) => (
            <span
              key={index}
              className="text-xs px-2 py-1 bg-purple-900/30 text-purple-300 border border-purple-900/40"
            >
              {tag}
            </span>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

// Featured project component with larger display
const FeaturedProject = ({ project }: { project: Project }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-32"
      initial={{ opacity: 0, y: 100 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Left side - Image */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <ParallaxImage
          src={
            project.image.startsWith("/")
              ? project.image
              : "/images/placeholder.png"
          }
          alt={project.title}
          className="w-full h-full"
          strength={-50}
        />

        {/* Client label */}
        {project.client && (
          <div className="absolute top-6 left-6 bg-black/70 backdrop-blur-sm py-2 px-3 text-xs uppercase tracking-wider text-white/70">
            {project.client}
          </div>
        )}
      </div>

      {/* Right side - Content */}
      <div className="flex flex-col justify-center">
        <div className="mb-2 text-purple-400 text-sm uppercase tracking-widest">
          Featured Project
        </div>

        <h3 className="text-4xl md:text-5xl playfair font-bold mb-6 text-white">
          {project.title}
        </h3>

        <div className="h-0.5 w-16 bg-purple-500 mb-8"></div>

        <p className="text-gray-300 text-lg mb-6 leading-relaxed">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-3 mb-8">
          {project.tags.map((tag, index) => (
            <span
              key={index}
              className="text-xs px-3 py-1.5 bg-purple-900/20 text-purple-300 border border-purple-900/30"
            >
              {tag}
            </span>
          ))}
        </div>

        <MagneticButton>
          <a
            href="#contact"
            className="inline-flex items-center group"
            data-cursor="text"
            data-cursor-text="View"
          >
            <span className="text-white mr-2 text-lg hover:text-purple-300 transition-colors">
              View Project
            </span>
            <span className="relative w-10 h-px bg-white/30 overflow-hidden">
              <span className="absolute inset-0 w-full h-full bg-purple-400 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></span>
            </span>
          </a>
        </MagneticButton>
      </div>
    </motion.div>
  );
};

// Main component
const AtkSocial = () => {
  const sectionRef = useRef(null);

  // Project data
  const projects: Project[] = [
    {
      id: 1,
      title: "Influencer Campaign",
      description:
        "Multi-platform content series featuring lifestyle influencers across Instagram, TikTok, and YouTube.",
      image: "/images/placeholder.png",
      client: "Fashion Brand",
      tags: ["Content Creation", "Social Media", "Influencer Marketing"],
      featured: true,
    },
    {
      id: 2,
      title: "Brand Story Series",
      description:
        "Documentary-style content highlighting brand journeys and founder stories.",
      image: "/images/placeholder.png",
      tags: ["Video Production", "Storytelling", "Brand Development"],
    },
    {
      id: 3,
      title: "TikTok Growth Strategy",
      description:
        "Viral content strategy that increased engagement by 300% and follower growth by 200K.",
      image: "/images/placeholder.png",
      client: "Tech Startup",
      tags: ["TikTok", "Growth Strategy", "Viral Content"],
    },
    {
      id: 4,
      title: "Social Rebrand",
      description:
        "Complete social media identity revamp with cohesive visual language across all platforms.",
      image: "/images/placeholder.png",
      tags: ["Brand Identity", "Visual Strategy", "Social Design"],
    },
    {
      id: 5,
      title: "Community Building",
      description:
        "Developed engaged community around niche interest with custom content strategy.",
      image: "/images/placeholder.png",
      tags: ["Community", "Engagement", "Content Strategy"],
    },
  ];

  // Filter featured project
  const featuredProject = projects.find((project) => project.featured);
  const galleryProjects = projects.filter((project) => !project.featured);

  // Scroll-triggered animations
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  // Apply spring physics for smooth animations
  const smoothY = useSpring(y, { damping: 15, stiffness: 100 });
  const smoothOpacity = useSpring(opacity, { damping: 15, stiffness: 100 });

  return (
    <section
      id="social"
      ref={sectionRef}
      className="min-h-screen py-32 md:py-40 relative overflow-hidden bg-black"
    >
      {/* Background elements */}
      <div className="absolute inset-0 noise-texture opacity-30 z-10"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-purple-900/30 z-20"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-purple-900/30 z-20"></div>

      {/* Ambient light effects */}
      <div className="absolute -top-96 -left-96 w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-[150px] opacity-30"></div>
      <div className="absolute -bottom-96 -right-96 w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-[150px] opacity-30"></div>

      {/* Vertical lines for structure */}
      <div className="absolute inset-y-0 left-1/4 w-px bg-white/5 z-20"></div>
      <div className="absolute inset-y-0 right-1/4 w-px bg-white/5 z-20"></div>

      <div className="container mx-auto px-6 relative z-30">
        {/* Hero heading */}
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="mb-20"
            style={{ y: smoothY, opacity: smoothOpacity }}
          >
            {/* Animated text with staggered reveal */}
            <div className="overflow-hidden">
              <h2 className="text-7xl md:text-9xl font-bold playfair tracking-tighter mb-3 text-purple-400">
                <TextReveal>ATK</TextReveal>
              </h2>
            </div>
            <div className="overflow-hidden">
              <h2 className="text-7xl md:text-9xl font-bold playfair tracking-tighter mb-8 text-white">
                <TextReveal delay={0.1}>Social</TextReveal>
              </h2>
            </div>

            <motion.div
              className="h-0.5 w-24 bg-gradient-to-r from-purple-500 to-purple-300 mb-8"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
              style={{ originX: 0 }}
            />

            <p className="text-xl md:text-2xl max-w-2xl manrope text-gray-300 leading-relaxed">
              Our content creation group delivers engaging experiences across
              platforms, connecting brands with audiences through authentic
              storytelling and innovation.
            </p>
          </motion.div>

          {/* Featured project */}
          {featuredProject && <FeaturedProject project={featuredProject} />}

          {/* Horizontal scrolling project gallery */}
          <HorizontalGallery projects={galleryProjects} />

          {/* Services section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-32">
            {[
              {
                title: "Content Creation",
                description:
                  "Creating compelling, platform-optimized content that resonates with target audiences and drives engagement.",
                icon: (
                  <svg
                    className="w-10 h-10 text-purple-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22 9V15C22 16.1 21.1 17 20 17H19V19C19 19.55 18.55 20 18 20H17C16.45 20 16 19.55 16 19V17H8V19C8 19.55 7.55 20 7 20H6C5.45 20 5 19.55 5 19V17H4C2.9 17 2 16.1 2 15V9C2 7.9 2.9 7 4 7H5V5C5 4.45 5.45 4 6 4H7C7.55 4 8 4.45 8 5V7H16V5C16 4.45 16.45 4 17 4H18C18.55 4 19 4.45 19 5V7H20C21.1 7 22 7.9 22 9Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ),
              },
              {
                title: "Social Strategy",
                description:
                  "Developing comprehensive social media strategies that align with business goals and brand identity.",
                icon: (
                  <svg
                    className="w-10 h-10 text-purple-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 12.98V15C2 20 4 22 9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M11.17 12L10.7 11.3L7.5 14.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16.5 9.5L14.99 11.01L14 12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14.5 9.5H16.5V11.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ),
              },
              {
                title: "Influencer Marketing",
                description:
                  "Identifying and partnering with authentic voices to amplify brand messages to relevant audiences.",
                icon: (
                  <svg
                    className="w-10 h-10 text-purple-400"
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
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                className="bg-black/50 backdrop-blur-sm border border-purple-900/20 p-8 relative overflow-hidden group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 30px -15px rgba(139, 92, 246, 0.15)",
                }}
              >
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-600/5 rounded-full filter blur-xl opacity-70 group-hover:opacity-100 transition-opacity"></div>

                <div className="relative z-10">
                  <div className="mb-6">{service.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    {service.title}
                  </h3>
                  <p className="text-gray-400">{service.description}</p>

                  {/* Corner accents on hover */}
                  <div className="absolute top-0 left-0 w-0 h-0 border-t border-l border-purple-500/30 group-hover:w-16 group-hover:h-16 transition-all duration-300"></div>
                  <div className="absolute bottom-0 right-0 w-0 h-0 border-b border-r border-purple-500/30 group-hover:w-16 group-hover:h-16 transition-all duration-300"></div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Call to action */}
          <motion.div
            className="mt-20 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-3xl md:text-4xl font-bold playfair mb-6">
              Ready to transform your digital presence?
            </h3>
            <p className="text-gray-400 max-w-xl mx-auto mb-10">
              Connect with our team to discuss how we can help elevate your
              brand through strategic content creation and social media
              expertise.
            </p>

            <MagneticButton>
              <a
                href="#contact"
                className="group px-10 py-4 bg-transparent border border-purple-500 text-white font-medium uppercase tracking-wider text-sm relative overflow-hidden inline-block"
                data-cursor="text"
                data-cursor-text="Contact"
                data-cursor-rotate="true"
              >
                <span className="relative z-10 transition-transform duration-500 group-hover:translate-y-[-150%] inline-block">
                  Work with ATK Social
                </span>
                <span className="absolute inset-0 flex items-center justify-center text-white transition-transform duration-500 translate-y-[150%] group-hover:translate-y-0">
                  Get in Touch
                </span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500 group-hover:w-full transition-all duration-300 ease-in-out"></span>
              </a>
            </MagneticButton>
          </motion.div>
        </div>
      </div>

      {/* Marquee banner */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <div className="py-4 bg-purple-900/5 border-t border-b border-purple-500/10 overflow-hidden">
          <div className="whitespace-nowrap inline-flex animate-marquee">
            {Array(2)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="inline-flex items-center gap-8">
                  {[
                    "STORYTELLING",
                    "CONTENT CREATION",
                    "SOCIAL MEDIA",
                    "BRAND DEVELOPMENT",
                    "INFLUENCER MARKETING",
                    "VIRAL STRATEGIES",
                  ].map((text, index) => (
                    <span
                      key={index}
                      className="text-xl font-light text-purple-300/50 mx-8"
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

export default AtkSocial;
