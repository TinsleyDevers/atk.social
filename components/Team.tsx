"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useInView, Variants } from "framer-motion";
import Image from "next/image";

// Team member defs
interface SocialLink {
  platform: string;
  url: string;
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  longBio?: string;
  skills?: string[];
  image: string;
  social: SocialLink[];
  featured?: boolean;
}

// Text reveal component for titles
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

// Magnetic element component
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

// Social icon components
const SocialIcon = ({ platform }: { platform: string }) => {
  switch (platform.toLowerCase()) {
    case "twitter":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
        </svg>
      );
    case "linkedin":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
          <rect x="2" y="9" width="4" height="12"></rect>
          <circle cx="4" cy="4" r="2"></circle>
        </svg>
      );
    case "github":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
        </svg>
      );
    case "instagram":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      );
    default:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
      );
  }
};

// Team member card component
const TeamMemberCard = ({
  member,
  onSelect,
}: {
  member: TeamMember;
  onSelect: (member: TeamMember) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  // Transform images on mouse move for parallax effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const moveX = (mouseX - rect.width / 2) / 30;
    const moveY = (mouseY - rect.height / 2) / 30;

    imageRef.current.style.transform = `translateX(${moveX}px) translateY(${moveY}px)`;
  };

  // Reset image position when mouse leaves
  const handleMouseLeave = () => {
    if (imageRef.current) {
      imageRef.current.style.transform = "translateX(0) translateY(0)";
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className="group aspect-[3/4] cursor-none"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(member)}
      data-cursor="view"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onSelect(member);
        }
      }}
      aria-label={`View ${member.name}'s profile`}
    >
      <div className="relative h-full w-full overflow-hidden bg-black/50">
        {/* Loading skeleton */}
        {isLoading && (
          <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900 animate-pulse">
            <div className="absolute bottom-0 left-0 w-full p-8">
              <div className="h-8 w-48 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 w-32 bg-gray-700 rounded mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-700 rounded"></div>
                <div className="h-4 w-3/4 bg-gray-700 rounded"></div>
                <div className="h-4 w-1/2 bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        )}

        <div
          ref={imageRef}
          className="absolute inset-0 transition-transform duration-500 ease-out"
        >
          <Image
            src={imageError ? "/images/placeholder.png" : member.image}
            alt={`${member.name} - ${member.role}`}
            fill
            className={`object-cover transition-all duration-700 scale-110 group-hover:scale-105 opacity-90 group-hover:opacity-100 ${
              isLoading ? "opacity-0" : "opacity-100"
            }`}
            sizes="(max-width: 768px) 100vw, 33vw"
            priority
            loading="eager"
            quality={90}
            onError={() => setImageError(true)}
            onLoadingComplete={() => setIsLoading(false)}
          />
        </div>

        {/* gradient overlay */}
        <div className="absolute -inset-4 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 z-10"></div>

        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 w-full p-8 z-20">
          <h3 className="text-3xl font-bold playfair mb-2 text-white">
            {member.name}
          </h3>
          <p className="text-sm uppercase tracking-wider text-white/70 mb-4">
            {member.role}
          </p>

          {/* Bio preview with animated reveal */}
          <motion.p
            className="text-white/80 text-sm mb-5 line-clamp-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              height: isHovered ? "auto" : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            {member.bio}
          </motion.p>

          {/* Social icons */}
          <motion.div
            className="flex space-x-4 mt-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              y: isHovered ? 0 : 10,
            }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {member.social.map((link, index) => (
              <a
                key={index}
                href={link.url}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                onClick={(e) => e.stopPropagation()}
                data-cursor="text"
                data-cursor-text={link.platform}
                aria-label={`${member.name}'s ${link.platform} profile`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <SocialIcon platform={link.platform} />
              </a>
            ))}
          </motion.div>
        </div>

        {/* Frame animation on hover */}
        <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute top-4 left-4 w-12 h-12 border-t border-l border-white/20"></div>
          <div className="absolute top-4 right-4 w-12 h-12 border-t border-r border-white/20"></div>
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b border-l border-white/20"></div>
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b border-r border-white/20"></div>
        </div>
      </div>
    </motion.div>
  );
};

// Team member detail modal
const TeamMemberModal = ({
  member,
  onClose,
}: {
  member: TeamMember | null;
  onClose: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Store the currently focused element
    previousActiveElement.current = document.activeElement as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.focus();
    }

    // Return focus to the previous element when the modal is closed
    return () => {
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, []);

  // Focus trap effect
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    };

    modal.addEventListener("keydown", handleTabKey);
    return () => modal.removeEventListener("keydown", handleTabKey);
  }, []);

  if (!member) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`modal-title-${member.id}`}
      >
        <motion.div
          ref={modalRef}
          className="relative bg-black/90 border border-white/10 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          tabIndex={-1}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              onClose();
            }
          }}
        >
          {/* Close button */}
          <button
            className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center border border-white/20 bg-black/50 z-10 hover:border-white/40 transition-colors"
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg
              className="w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
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

          <div className="grid grid-cols-1 md:grid-cols-7 bg-black border border-white/10">
            {/* Image column */}
            <div className="md:col-span-3 relative aspect-[3/4] md:aspect-auto overflow-hidden">
              {/* Loading skeleton */}
              {isLoading && (
                <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900 animate-pulse">
                  <div className="absolute bottom-0 left-0 w-full p-8">
                    <div className="h-8 w-48 bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 w-32 bg-gray-700 rounded mb-4"></div>
                    <div className="flex space-x-4">
                      <div className="w-8 h-8 rounded-full bg-gray-700"></div>
                      <div className="w-8 h-8 rounded-full bg-gray-700"></div>
                      <div className="w-8 h-8 rounded-full bg-gray-700"></div>
                    </div>
                  </div>
                </div>
              )}

              <Image
                src={
                  imageError
                    ? "/images/placeholder.png"
                    : member.image.startsWith("/")
                    ? member.image
                    : "/images/placeholder.png"
                }
                alt={`${member.name} - ${member.role}`}
                fill
                className={`object-cover transition-all duration-700 ${
                  isLoading ? "opacity-0" : "opacity-100"
                }`}
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
                loading="eager"
                quality={90}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/images/placeholder.png";
                  setImageError(true);
                }}
                onLoadingComplete={() => setIsLoading(false)}
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent md:bg-gradient-to-t md:from-black md:via-black/20 md:to-transparent"></div>

              {/* Info overlay for mobile */}
              <div className="absolute bottom-0 left-0 w-full p-8 md:hidden">
                <h2
                  id={`modal-title-${member.id}`}
                  className="text-3xl font-bold mb-2 playfair"
                >
                  {member.name}
                </h2>
                <p className="text-sm uppercase tracking-wider text-white/70 mb-6">
                  {member.role}
                </p>

                <div className="flex space-x-4">
                  {member.social.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                      data-cursor="magnetic"
                      aria-label={`${member.name}'s ${link.platform} profile`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <SocialIcon platform={link.platform} />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Content column */}
            <div className="md:col-span-4 p-8 md:p-12 flex flex-col">
              {/* Info for desktop */}
              <div className="hidden md:block mb-8">
                <h2
                  id={`modal-title-desktop-${member.id}`}
                  className="text-4xl font-bold mb-2 playfair"
                >
                  {member.name}
                </h2>
                <p className="text-sm uppercase tracking-wider text-white/70 mb-6">
                  {member.role}
                </p>

                <div className="flex space-x-4">
                  {member.social.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                      data-cursor="magnetic"
                      aria-label={`${member.name}'s ${link.platform} profile`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <SocialIcon platform={link.platform} />
                    </a>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="w-16 h-0.5 bg-white/20 mb-8"></div>

              {/* Full bio */}
              <div className="text-gray-300 space-y-4 mb-8">
                <p>{member.longBio || member.bio}</p>
                {member.longBio && <p>{member.bio}</p>}
              </div>

              {/* Skills */}
              {member.skills && (
                <div className="mt-auto">
                  <h3 className="text-lg font-medium mb-4">Expertise</h3>
                  <div className="flex flex-wrap gap-3">
                    {member.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="text-xs px-3 py-1 bg-white/5 border border-white/10 text-white/70"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-white/10 p-6 flex justify-between items-center">
            <p className="text-sm text-gray-400">View our team</p>

            <MagneticElement>
              <button
                className="px-4 py-2 border border-white/20 hover:border-white/40 text-sm text-white transition-colors flex items-center space-x-2"
                onClick={onClose}
                aria-label="Back to team"
              >
                <span>Back to Team</span>
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
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

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// Main component
const Team = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Team members data
  const team: TeamMember[] = [
    {
      id: 1,
      name: "Addi",
      role: "Co-founder, Content Creation",
      bio: "Creative content strategist with expertise in audience growth and engagement across multiple platforms.",
      longBio:
        "As the creative force behind ATK's content strategy, Addi brings innovative approaches to storytelling and audience development. With a background in digital content creation and social media optimization, he crafts compelling narratives that resonate with audiences while building strong community engagement. His expertise in content ecosystems helps brands find their authentic voice in crowded digital landscapes.",
      skills: [
        "Content Strategy",
        "Social Media Management",
        "Audience Development",
        "Creative Direction",
        "Digital Storytelling",
      ],
      image: "/images/team/addi.png",
      social: [
        {
          platform: "twitter",
          url: "#",
        },
        {
          platform: "linkedin",
          url: "#",
        },
        {
          platform: "instagram",
          url: "#",
        },
      ],
      featured: true,
    },
    {
      id: 2,
      name: "Tinsley",
      role: "Co-founder, Developer",
      bio: "Lead developer with a passion for creating immersive digital experiences.",
      longBio:
        "As a visionary developer and co-founder, Tinsley drives the technical direction of ATK with expertise in interactive web experiences and game development. With a background in both front-end technologies and game engines, he bridges the gap between compelling visuals and engaging functionality.",
      skills: [
        "Web Development",
        "Game Design",
        "React",
        "Three.js",
        "Unreal Engine",
      ],
      image: "/images/team/tinsley.png",
      social: [
        {
          platform: "twitter",
          url: "#",
        },
        {
          platform: "linkedin",
          url: "https://www.linkedin.com/in/tinsley-devers-40820a1b9/",
        },
        {
          platform: "github",
          url: "https://github.com/TinsleyDevers",
        },
      ],
      featured: true,
    },
    {
      id: 3,
      name: "Kai",
      role: "Co-founder, Business Operations",
      bio: "Driving business strategy and growth with a focus on building lasting partnerships.",
      longBio:
        "Kai orchestrates the business operations at ATK, bringing strategic vision and relationship-building expertise to the team. With a background in digital marketing and business development, he identifies growth opportunities and ensures seamless collaboration between creative and technical departments.",
      skills: [
        "Business Strategy",
        "Client Relations",
        "Digital Marketing",
        "Content Strategy",
        "Project Management",
      ],
      image: "/images/team/kai.png",
      social: [
        {
          platform: "twitter",
          url: "#",
        },
        {
          platform: "linkedin",
          url: "#",
        },
        {
          platform: "instagram",
          url: "#",
        },
      ],
      featured: true,
    },
  ];

  // Sort team members to put featured ones first
  const sortedTeam = [...team].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  return (
    <section
      id="team"
      ref={sectionRef}
      className="py-32 md:py-40 relative overflow-hidden bg-black"
    >
      {/* Background elements */}
      <div className="absolute inset-0 noise-texture opacity-30"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-white/10"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-white/10"></div>

      {/* Vertical design elements */}
      <div className="absolute top-0 left-1/3 w-px h-full bg-white/5"></div>
      <div className="absolute top-0 right-1/3 w-px h-full bg-white/5"></div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="mb-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h3 className="text-sm uppercase tracking-[0.2em] text-gray-500 mb-3">
            The Creators
          </h3>

          <div className="overflow-hidden">
            <h2 className="text-5xl md:text-7xl font-bold playfair tracking-tighter mb-8">
              <TextReveal>Our Team</TextReveal>
            </h2>
          </div>

          <div className="h-px w-20 bg-white/40 mx-auto mb-8"></div>

          <p className="text-xl max-w-2xl mx-auto manrope text-gray-300">
            Meet the creative minds behind ATK&apos;s innovative projects and
            experiences
          </p>
        </motion.div>

        {/* Team members grid with uniform sizes */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {sortedTeam.map((member) => (
            <motion.div key={member.id} variants={itemVariants}>
              <TeamMemberCard member={member} onSelect={setSelectedMember} />
            </motion.div>
          ))}
        </motion.div>

        {/* Join the team CTA */}
        <motion.div
          className="mt-32 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h3 className="text-3xl font-bold mb-6 playfair">Join our team</h3>
          <p className="text-lg text-gray-400 max-w-xl mx-auto mb-10">
            We&apos;re always looking for talented individuals who are
            passionate about creating exceptional digital experiences
          </p>

          <MagneticElement>
            <a
              href="#contact"
              className="group px-10 py-4 bg-transparent border border-white text-white font-medium uppercase tracking-wider text-sm relative overflow-hidden inline-block"
              data-cursor="text"
              data-cursor-text="Explore"
              data-cursor-rotate="true"
            >
              <span className="relative z-10 transition-transform duration-500 group-hover:translate-y-[-150%] inline-block">
                View Open Positions
              </span>
              <span className="absolute inset-0 flex items-center justify-center text-white transition-transform duration-500 translate-y-[150%] group-hover:translate-y-0">
                Join Us
              </span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
            </a>
          </MagneticElement>
        </motion.div>
      </div>

      {/* Team member detail modal */}
      <TeamMemberModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </section>
  );
};

export default Team;
