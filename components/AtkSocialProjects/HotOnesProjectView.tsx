"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  AnimatePresence,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";

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

// 3D Tilt Card component with parallax hover effects
const TiltCard = ({
  children,
  className,
  strength = 5,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !isHovered) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate rotation based on mouse position relative to card center
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * strength;
    const rotateX = ((centerY - e.clientY) / (rect.height / 2)) * strength;

    // Calculate position for parallax effect inside card
    const moveX = ((e.clientX - centerX) / (rect.width / 2)) * -15;
    const moveY = ((e.clientY - centerY) / (rect.height / 2)) * -15;

    setRotation({ x: rotateX, y: rotateY });
    setPosition({ x: moveX, y: moveY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setPosition({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`${className} perspective-1000`}
      animate={{
        rotateX: rotation.x,
        rotateY: rotation.y,
        transformStyle: "preserve-3d",
      }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ x: position.x, y: position.y }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      >
        {children}
      </motion.div>

      {/* Shine effect */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          style={{
            background: `radial-gradient(circle at ${rotation.y + 50}% ${
              50 - rotation.x
            }%, rgba(255, 255, 255, 0.8), transparent 60%)`,
            mixBlendMode: "overlay",
          }}
        />
      )}
    </motion.div>
  );
};

// Video player component with custom controls
const VideoPlayer = ({ videoSrc }: { videoSrc: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative aspect-video w-full overflow-hidden group">
      <video
        ref={videoRef}
        src={videoSrc}
        className="w-full h-full object-cover"
        loop
        muted
        onClick={handlePlayPause}
      />

      {/* Custom play/pause button */}
      <div
        className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        onClick={handlePlayPause}
      >
        <MagneticButton>
          <motion.div
            className="w-16 h-16 rounded-full bg-purple-600/30 backdrop-blur-sm border border-purple-400/50 flex items-center justify-center cursor-none group"
            whileHover={{ scale: 1.1 }}
            data-cursor="text"
            data-cursor-text={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg
                className="w-6 h-6 text-white relative z-10"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 9V15M14 9V15M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 text-white relative z-10"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.5 8.64L15.51 12.18C15.66 12.26 15.79 12.37 15.88 12.51C15.96 12.65 16 12.82 16 12.99C16 13.16 15.96 13.33 15.88 13.47C15.79 13.61 15.66 13.72 15.51 13.8L8.5 17.34C8.34 17.43 8.17 17.47 8 17.46C7.83 17.46 7.66 17.4 7.51 17.29C7.36 17.19 7.23 17.04 7.14 16.87C7.05 16.7 7 16.5 7 16.3V9.7C7 9.5 7.05 9.3 7.14 9.13C7.23 8.96 7.36 8.81 7.51 8.71C7.66 8.6 7.83 8.54 8 8.54C8.17 8.53 8.34 8.57 8.5 8.66V8.64Z"
                  fill="currentColor"
                />
              </svg>
            )}
          </motion.div>
        </MagneticButton>
      </div>

      {/* Video timeline overlay */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-purple-900/30">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 to-purple-300"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isPlaying ? 1 : 0 }}
          transition={{ duration: 30, ease: "linear", repeat: Infinity }}
          style={{ originX: 0 }}
        />
      </div>
    </div>
  );
};

// Gallery component for project images
const ProjectGallery = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="relative overflow-hidden rounded-sm">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className="aspect-video relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src={images[currentIndex]}
            alt={`Project image ${currentIndex + 1}`}
            fill
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <motion.button
          className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center"
          onClick={handlePrev}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg
            className="w-6 h-6 text-white"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 19L8 12L15 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.button>

        <motion.button
          className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center"
          onClick={handleNext}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg
            className="w-6 h-6 text-white"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 5L16 12L9 19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.button>
      </div>

      {/* Pagination indicators */}
      <div className="absolute bottom-4 left-0 w-full flex justify-center gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex ? "bg-purple-500" : "bg-white/50"
            } transition-colors duration-300`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

const YouTubeEmbed = ({ youtubeUrl }: { youtubeUrl: string }) => {
  // Extract video ID from various YouTube URL formats
  const getYouTubeVideoId = (url: string) => {
    const regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : null;
  };

  const videoId = getYouTubeVideoId(youtubeUrl);

  if (!videoId) return <div>Invalid YouTube URL</div>;

  return (
    <div className="aspect-video w-full overflow-hidden group">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

// Main component
const HotOnesProjectView = () => {
  const sectionRef = useRef(null);
  const statsRef = useRef(null);

  // Project data
  const project = {
    title: "Hot Ones Event",
    client: "heyaddi",
    date: "November 2023",
    description:
      "A live-streamed event capturing the heat and reactions of participants as they take on the Hot Ones challenge, featuring custom question development, branded set design, and multi-camera production.",
    image: "/images/atksocial/hotonesevent.png",
    video: "https://youtu.be/nfd24vgLRtM?si=6FLWzKj6z6XtGAj-",
    overview:
      "ATK Social partnered with heyaddi to create an engaging Hot Ones-style interview series for their creator community. This format, inspired by the popular YouTube show, features interviews conducted while participants eat increasingly spicy wings. The unique interview style generated authentic moments and reactions from talent while discussing their content creation journey.",
    challenge:
      "The primary challenge was to balance production quality with authentic reactions. We needed to design a set that felt professional yet approachable, develop questions that would elicit genuine responses, and manage the technical aspects of a multi-camera livestream setup with real-time reactions.",
    solution:
      "Our team developed a comprehensive production plan including a custom set design featuring branded elements, a careful hot sauce progression that challenged participants without overwhelming them, and a professional multi-camera setup to capture all reactions. We integrated live audience interaction through a custom chat interface that allowed viewers to submit questions during the stream.",
    results:
      "The event generated over 150,000 unique viewers across YouTube and Twitch platforms during the live broadcast, with an additional 230,000 views on highlight clips shared across social media platforms. Audience engagement metrics showed a 43% increase in comment activity compared to previous creator events, and the format has been adopted as a recurring quarterly feature for the heyaddi creator community.",
    services: [
      "Content Strategy",
      "Set Design",
      "Live Streaming",
      "Video Production",
      "Social Media Promotion",
      "Talent Coordination",
    ],
    stats: {
      "Live Viewers": "150K+",
      "Engagement Rate": "43%",
      "Social Shares": "12K",
      "Platform Reach": "4",
    },
    team: [
      {
        name: "Sarah Mitchell",
        role: "Production Director",
        avatar: "/images/placeholder.png",
      },
      {
        name: "David Wong",
        role: "Technical Director",
        avatar: "/images/placeholder.png",
      },
      {
        name: "Jessica Reynolds",
        role: "Content Strategist",
        avatar: "/images/placeholder.png",
      },
    ],
    testimonial: {
      quote:
        "ATK Social transformed our creator event into something truly special. The Hot Ones format brought out authentic moments from our talent that we couldn't have captured any other way. The production quality was outstanding, and the audience response exceeded all expectations.",
      author: "heyaddi",
      role: "Content Creator",
    },
    galleryImages: [
      "/images/atksocial/hotonesevent.png",
      "/images/placeholder.png",
      "/images/placeholder.png",
      "/images/placeholder.png",
    ],
  };

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
      id="project-view"
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

      {/* Tech-inspired background elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZGVmcz4KPHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPGNpcmNsZSBjeD0iMCIgY3k9IjAiIHI9IjAuNSIgZmlsbD0icmdiYSgxMjgsMCwyNTUsMC4wMykiLz4KPC9wYXR0ZXJuPgo8L2RlZnM+CjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiIC8+Cjwvc3ZnPg==')] opacity-40 pointer-events-none z-10"></div>

      {/* Vertical lines for structure */}
      <div className="absolute inset-y-0 left-1/4 w-px bg-white/5 z-20"></div>
      <div className="absolute inset-y-0 right-1/4 w-px bg-white/5 z-20"></div>

      <div className="container mx-auto px-6 relative z-30">
        {/* Back button */}
        <div className="mb-12">
          <MagneticButton>
            <Link
              href="#social"
              className="inline-flex items-center text-gray-400 hover:text-white transition-colors group"
              data-cursor="link"
            >
              <svg
                className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300"
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
              <span>Back to Projects</span>
            </Link>
          </MagneticButton>
        </div>

        {/* Project header */}
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="mb-16"
            style={{ y: smoothY, opacity: smoothOpacity }}
          >
            {/* Client name */}
            <div className="mb-4 text-purple-400 text-sm uppercase tracking-widest flex items-center">
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse mr-2"></div>
              <span>{project.client}</span>
            </div>

            {/* Project title with staggered reveal */}
            <div className="overflow-hidden">
              <h2 className="text-7xl md:text-9xl font-bold playfair tracking-tighter mb-6 text-white">
                <TextReveal>{project.title}</TextReveal>
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

            <p className="text-xl md:text-2xl max-w-3xl manrope text-gray-300 leading-relaxed">
              {project.description}
            </p>
          </motion.div>

          {/* Main project content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-32">
            {/* Left side - Media showcase */}
            <div>
              {/* Video player */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <TiltCard
                  className="relative overflow-hidden rounded-sm"
                  strength={4}
                >
                  {project.video.includes("youtu") ? (
                    <YouTubeEmbed youtubeUrl={project.video} />
                  ) : (
                    <VideoPlayer videoSrc={project.video} />
                  )}
                </TiltCard>
              </motion.div>

              {/* Image gallery */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h3 className="text-xl font-semibold mb-4">Project Gallery</h3>
                <ProjectGallery images={project.galleryImages} />
              </motion.div>
            </div>

            {/* Right side - Project details */}
            <div>
              {/* Project overview */}
              <motion.div
                className="mb-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h3 className="text-2xl font-bold playfair mb-4 text-purple-400">
                  Overview
                </h3>
                <p className="text-gray-300">{project.overview}</p>
              </motion.div>

              {/* Challenge and solution */}
              <motion.div
                className="mb-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                <h3 className="text-2xl font-bold playfair mb-4 text-purple-400">
                  Challenge
                </h3>
                <p className="text-gray-300 mb-8">{project.challenge}</p>

                <h3 className="text-2xl font-bold playfair mb-4 text-purple-400">
                  Solution
                </h3>
                <p className="text-gray-300">{project.solution}</p>
              </motion.div>

              {/* Services provided */}
              <motion.div
                className="mb-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h3 className="text-2xl font-bold playfair mb-4 text-purple-400">
                  Services
                </h3>

                <div className="flex flex-wrap gap-3">
                  {project.services.map((service, index) => (
                    <span
                      key={index}
                      className="text-sm px-3 py-1.5 bg-purple-900/20 text-purple-300 border border-purple-900/30"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Project stats */}
              <motion.div
                className="mb-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                ref={statsRef}
              >
                <h3 className="text-2xl font-bold playfair mb-1 text-purple-400">
                  Results
                </h3>
                <h3 className="text-sm font-bold playfair mb-4 text-gray-500">
                  will probably remove or comment this out
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(project.stats).map(
                    ([label, value], index) => (
                      <motion.div
                        key={index}
                        className="bg-purple-900/10 border border-purple-900/30 px-4 py-3 relative overflow-hidden group"
                        whileHover={{ y: -3 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="text-purple-400 text-xs uppercase tracking-wider mb-1">
                          {label}
                        </div>
                        <div className="text-white font-bold">{value}</div>
                        <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500 group-hover:w-full transition-all duration-300"></div>
                      </motion.div>
                    )
                  )}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Team section */}
          <motion.div
            className="mb-24"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-3xl font-bold playfair mb-8 text-center">
              Project Team
            </h3>

            <div className="flex flex-wrap justify-center gap-8">
              {project.team.map((member, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="w-20 h-20 rounded-full overflow-hidden mb-4 bg-purple-900/20 border border-purple-900/30">
                    <Image
                      src={member.avatar}
                      alt={member.name}
                      width={80}
                      height={80}
                      className="object-cover"
                    />
                  </div>
                  <h4 className="text-lg font-medium text-white mb-1">
                    {member.name}
                  </h4>
                  <p className="text-sm text-purple-300">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Testimonial */}
          <motion.div
            className="max-w-4xl mx-auto mb-24 relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="p-12 md:p-16 bg-gradient-to-br from-purple-900/10 to-transparent border border-purple-900/20 relative">
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-10 h-10 border-t border-l border-purple-500/30"></div>
              <div className="absolute top-0 right-0 w-10 h-10 border-t border-r border-purple-500/30"></div>
              <div className="absolute bottom-0 left-0 w-10 h-10 border-b border-l border-purple-500/30"></div>
              <div className="absolute bottom-0 right-0 w-10 h-10 border-b border-r border-purple-500/30"></div>

              {/* Quote mark */}
              <svg
                className="w-12 h-12 text-purple-500/20 absolute top-8 left-8"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M11.3 6.22a1 1 0 0 0-1.6 1.16L11 10H8a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2v-9a1 1 0 0 0-.6-.92A6.25 6.25 0 0 0 11.3 6.22ZM20.1 5a1 1 0 0 0-1.95.32l.5 3L16 9.8a2 2 0 0 0-1 1.74v2.92a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2v-4a2 2 0 0 0-1.23-1.84A6.25 6.25 0 0 0 20.1 5Z" />
              </svg>

              <div className="relative z-10 text-center">
                <blockquote className="text-2xl playfair italic text-white/80 mb-8 leading-relaxed">
                  &quot;{project.testimonial.quote}&quot;
                </blockquote>

                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <h4 className="font-medium text-white">
                      {project.testimonial.author}
                    </h4>
                    <p className="text-sm text-purple-300">
                      {project.testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Project outcome */}
          <motion.div
            className="mb-24"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-3xl font-bold playfair mb-8 text-center">
              Outcome
            </h3>

            <div className="text-center max-w-3xl mx-auto text-gray-300">
              <p className="mb-8">{project.results}</p>

              <div className="max-w-md mx-auto p-6 bg-gradient-to-br from-purple-900/10 to-transparent border border-purple-900/20 rounded-sm">
                <h4 className="text-xl font-bold playfair mb-4 text-purple-400">
                  Key Achievements
                </h4>
                <ul className="space-y-4 text-left">
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-purple-500 mt-0.5 mr-3 flex-shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.5 12.5L10.5 14.5L15.5 9.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>
                      Increased audience engagement by 43% compared to previous
                      creator events
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-purple-500 mt-0.5 mr-3 flex-shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.5 12.5L10.5 14.5L15.5 9.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>
                      Generated over 150,000 unique viewers across platforms
                      during the live broadcast
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-purple-500 mt-0.5 mr-3 flex-shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.5 12.5L10.5 14.5L15.5 9.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>
                      Format adopted as recurring quarterly feature for the
                      client&apos;s creator community
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Related projects */}
          <motion.div
            className="mb-24"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-3xl font-bold playfair mb-8 text-center">
              Related Projects
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Brand Story Series",
                  description:
                    "Documentary-style content highlighting brand journeys and founder stories.",
                  image: "/images/placeholder.png",
                },
                {
                  title: "TikTok Growth Strategy",
                  description:
                    "Viral content strategy that increased engagement by 300% and follower growth by 200K.",
                  image: "/images/placeholder.png",
                },
                {
                  title: "Social Rebrand",
                  description:
                    "Complete social media identity revamp with cohesive visual language across all platforms.",
                  image: "/images/placeholder.png",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="relative group overflow-hidden"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out scale-100 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                  </div>
                  <div className="absolute bottom-0 left-0 p-4">
                    <h4 className="text-xl font-bold text-white mb-2">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-300">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Next steps CTA */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-3xl font-bold playfair mb-6">
              Ready for your own ATK Social project?
            </h3>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
              Let&apos;s create an engaging experience that connects with your
              audience and elevates your brand.
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              <MagneticButton>
                <Link
                  href="#contact"
                  className="group px-8 py-3 bg-transparent border border-purple-500 text-white font-medium uppercase tracking-wider text-sm relative overflow-hidden inline-block"
                  data-cursor="text"
                  data-cursor-text="Connect"
                  data-cursor-rotate="true"
                >
                  <span className="relative z-10 transition-transform duration-500 group-hover:translate-y-[-150%] inline-block">
                    Get in Touch
                  </span>
                  <span className="absolute inset-0 flex items-center justify-center text-white transition-transform duration-500 translate-y-[150%] group-hover:translate-y-0">
                    Let&apos;s Talk
                  </span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500 group-hover:w-full transition-all duration-300 ease-in-out"></span>
                </Link>
              </MagneticButton>

              <MagneticButton>
                <Link
                  href="#social"
                  className="group px-8 py-3 border border-white/30 text-white font-medium uppercase tracking-wider text-sm relative overflow-hidden inline-block hover:border-white/50 transition-colors"
                  data-cursor="magnetic"
                >
                  <span className="relative z-10">View More Projects</span>
                </Link>
              </MagneticButton>
            </div>
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
                    "CONTENT CREATION",
                    "LIVE PRODUCTION",
                    "STREAMING",
                    "HOT ONES FORMAT",
                    "INTERVIEW SERIES",
                    "BRAND COLLABORATION",
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

export default HotOnesProjectView;
