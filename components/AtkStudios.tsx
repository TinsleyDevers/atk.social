"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";
import Image from "next/image";

// Game project type definition
interface Game {
  id: number;
  title: string;
  description: string;
  image: string;
  video?: string;
  client?: string;
  platform?: string;
  tags: string[];
  featured?: boolean;
  status?: string;
  details?: {
    role?: string;
    scope?: string;
    timeline?: string;
  };
  stats?: {
    [key: string]: string | number;
  };
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

// 3D Tilt Card component with improved hover effects
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

      {/* Enhanced shine effect */}
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

// Featured game component with interactive elements - updated for unannounced title
const FeaturedGame = ({ game }: { game: Game }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [showVideo, setShowVideo] = useState(false);

  return (
    <motion.div
      ref={ref}
      className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-32"
      initial={{ opacity: 0, y: 100 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Left side - Interactive game teaser with "Classified" overlay */}
      <TiltCard className="relative overflow-hidden rounded-sm" strength={7}>
        <div className="aspect-video bg-black/50 overflow-hidden relative">
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
            {!showVideo ? (
              <>
                <div className="relative mb-4">
                  <motion.div
                    className="w-20 h-20 rounded-full border-4 border-blue-500/30 flex items-center justify-center"
                    animate={{
                      boxShadow: [
                        "0 0 0 0px rgba(59, 130, 246, 0.3)",
                        "0 0 0 10px rgba(59, 130, 246, 0)",
                      ],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                    }}
                  >
                    <MagneticButton>
                      <motion.div
                        className="w-14 h-14 rounded-full bg-blue-500/30 backdrop-blur-sm border border-blue-400/50 flex items-center justify-center cursor-none group"
                        whileHover={{ scale: 1.1 }}
                        onClick={() => setShowVideo(true)}
                        data-cursor="text"
                        data-cursor-text="Play"
                      >
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
                      </motion.div>
                    </MagneticButton>
                  </motion.div>
                </div>
                <motion.div
                  className="text-lg uppercase tracking-[0.3em] text-blue-300 font-bold mb-2"
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Teaser Trailer
                </motion.div>
              </>
            ) : (
              <div className="relative w-full h-full bg-black flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-lg text-center text-blue-300 px-6"
                >
                  <svg
                    className="w-16 h-16 text-blue-500/50 mx-auto mb-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10.75 13.73L14.26 11.26C14.68 10.96 14.68 10.3 14.26 10L10.75 7.53C10.26 7.18 9.6 7.52 9.6 8.1V13.16C9.6 13.74 10.26 14.08 10.75 13.73Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="uppercase tracking-[0.2em] font-bold mb-2">
                    Classified
                  </div>
                  <p className="text-sm text-blue-300/70">
                    Trailer coming soon. Sign up for early access.
                  </p>
                </motion.div>
              </div>
            )}
          </div>

          {/* Background image with blur and overlay */}
          <div className="absolute inset-0 z-10">
            <Image
              src={
                game.image.startsWith("/")
                  ? game.image
                  : "/images/placeholder.png"
              }
              alt={game.title}
              fill
              className="object-cover filter blur-sm brightness-50"
            />

            {/* Top-secret overlay effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-blue-900/40 via-transparent to-blue-900/40 z-10"
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%"],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "linear",
              }}
            />

            {/* Digital scan lines */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZGVmcz4KPHBhdHRlcm4gaWQ9InNjYW5saW5lcyIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iNCIgeD0iMCIgeT0iMCI+CjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC4wMykiLz4KPHJlY3QgeD0iMCIgeT0iMiIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMSIgZmlsbD0icmdiYSgwLDAsMCwwLjAzKSIvPgo8L3BhdHRlcm4+CjwvZGVmcz4KPHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNzY2FubGluZXMpIi8+Cjwvc3ZnPg==')] opacity-20 z-15" />

            {/* Restricted access overlay */}
            <div className="absolute inset-0 flex items-center justify-center z-15">
              <motion.div
                className="w-full h-full flex flex-col items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.1 }}
              >
                <svg
                  className="absolute w-64 h-64 text-blue-500/10"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" />
                  <path
                    d="M12 14.5C11.337 14.5 10.7011 14.2366 10.2322 13.7678C9.76339 13.2989 9.5 12.663 9.5 12C9.5 11.337 9.76339 10.7011 10.2322 10.2322C10.7011 9.76339 11.337 9.5 12 9.5C12.663 9.5 13.2989 9.76339 13.7678 10.2322C14.2366 10.7011 14.5 11.337 14.5 12C14.5 12.663 14.2366 13.2989 13.7678 13.7678C13.2989 14.2366 12.663 14.5 12 14.5ZM12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
            </div>
          </div>

          {/* Top secret text overlays */}
          <div className="absolute top-0 left-0 m-4 z-20">
            <div className="bg-blue-900/30 backdrop-blur-sm px-3 py-1 rounded-sm border border-blue-500/20 flex items-center">
              <div className="w-2 h-2 rounded-full bg-blue-500/70 mr-2 animate-pulse"></div>
              <span className="text-xs font-mono text-blue-300 uppercase">
                Confidential
              </span>
            </div>
          </div>
          <div className="absolute top-0 right-0 m-4 z-20">
            <div className="bg-blue-900/30 backdrop-blur-sm px-3 py-1 rounded-sm border border-blue-500/20">
              <span className="text-xs font-mono text-blue-300">
                {game.status}
              </span>
            </div>
          </div>
        </div>
      </TiltCard>

      {/* Right side - Game info */}
      <div className="flex flex-col justify-center">
        <div className="mb-1 text-blue-400 text-sm uppercase tracking-widest flex items-center">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse mr-2"></div>
          <span>Coming Soon</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-5xl md:text-6xl font-bold playfair mb-6 text-white">
            <span className="text-outline">{game.title.split(" ")[0]}</span>{" "}
            <span className="text-blue-400">{game.title.split(" ")[1]}</span>
          </h3>
        </motion.div>

        <motion.div
          className="h-0.5 w-16 bg-gradient-to-r from-blue-500 to-blue-300 mb-8"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{ originX: 0 }}
        />

        <p className="text-gray-300 text-lg mb-8 leading-relaxed">
          {game.description}
        </p>

        {/* Game stats in a visually appealing layout */}
        {game.stats && (
          <motion.div
            className="grid grid-cols-2 gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {Object.entries(game.stats).map(([label, value], index) => (
              <motion.div
                key={index}
                className="bg-blue-900/10 border border-blue-900/30 px-4 py-3 relative overflow-hidden group"
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="text-blue-400 text-xs uppercase tracking-wider mb-1">
                  {label}
                </div>
                <div className="text-white font-bold">{value}</div>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className="flex flex-wrap gap-3 mb-8">
          {game.tags.map((tag, index) => (
            <motion.span
              key={index}
              className="text-xs px-3 py-1.5 bg-blue-900/20 text-blue-300 border border-blue-900/30"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
            >
              {tag}
            </motion.span>
          ))}
        </div>

        {/* Sign up call to action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <MagneticButton>
            <a
              href="#contact"
              className="group px-10 py-4 bg-gradient-to-r from-blue-600/20 to-blue-800/20 border border-blue-500/30 text-white font-medium tracking-wider text-sm relative overflow-hidden inline-flex items-center"
              data-cursor="text"
              data-cursor-text="Sign up"
            >
              <span className="mr-3 relative z-10">
                Sign up for Early Access
              </span>
              <svg
                className="w-5 h-5 text-blue-400 relative z-10 transform group-hover:translate-x-1 transition-transform duration-300"
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
              <span className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-blue-800/10 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></span>
            </a>
          </MagneticButton>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Game features component with animated reveals
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const GameFeatures = ({ game }: { game: Game }) => {
  return (
    <motion.div
      className="max-w-5xl mx-auto mb-32 py-12 px-12 border border-blue-900/30 bg-blue-900/5 relative overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZGVmcz4KPHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxwYXRoIGQ9Ik0gMjAgMCBMIDAgMCAwIDIwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMCwxMDAsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz4KPC9wYXR0ZXJuPgo8L2RlZnM+CjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiIC8+Cjwvc3ZnPg==')] opacity-30 z-0"></div>

      <div className="absolute top-0 left-0 w-24 h-24 border-t border-l border-blue-400/20"></div>
      <div className="absolute bottom-0 right-0 w-24 h-24 border-b border-r border-blue-400/20"></div>

      <div className="relative z-10">
        <h3 className="text-3xl font-bold playfair text-blue-400 mb-8">
          Game Features
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: "Competitive 1v1 Battles",
              description:
                "Fast-paced, tactical head-to-head combat with unique balancing mechanisms to ensure fair, skill-based gameplay.",
              icon: (
                <svg
                  className="w-8 h-8 text-blue-400 mb-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.6398 17.52C10.9498 17.83 11.4598 17.83 11.7698 17.52L20.4698 8.83C20.7798 8.52 20.7798 8.01 20.4698 7.7L18.2998 5.53C17.9898 5.22 17.4798 5.22 17.1698 5.53L11.1998 11.5L6.8298 7.13C6.5198 6.82 6.0098 6.82 5.6998 7.13L3.5298 9.3C3.2198 9.61 3.2198 10.12 3.5298 10.43L10.6398 17.52Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 22H22"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ),
            },
            {
              title: "Advanced Weaponry",
              description:
                "Strategic arsenal with weapons and abilities that encourage varied playstyles and counter strategies.",
              icon: (
                <svg
                  className="w-8 h-8 text-blue-400 mb-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.3398 17.8101H13.6598"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3.5 18V7C3.5 3 4.5 2 8.5 2H15.5C19.5 2 20.5 3 20.5 7V17C20.5 17.14 20.5 17.28 20.49 17.42"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6.35 10.76L9.65 12.64C11.03 13.43 12.97 13.43 14.35 12.64L17.65 10.76"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5 22C6.65685 22 8 20.6569 8 19C8 17.3431 6.65685 16 5 16C3.34315 16 2 17.3431 2 19C2 20.6569 3.34315 22 5 22Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ),
            },
            {
              title: "Dynamic Arenas",
              description:
                "Battle across tactically diverse environments with interactive elements that enable strategic positioning and gameplay mechanics.",
              icon: (
                <svg
                  className="w-8 h-8 text-blue-400 mb-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 22H22"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2.94995 22.0001L2.99995 9.97006C2.99995 9.36006 3.28995 8.78009 3.76995 8.40009L10.77 2.95006C11.49 2.39006 12.5 2.39006 13.23 2.95006L20.23 8.39009C20.72 8.77009 21 9.35006 21 9.97006V22.0001"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13 17H11C10.17 17 9.5 17.67 9.5 18.5V22H14.5V18.5C14.5 17.67 13.83 17 13 17Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9.5 13.75H7.5C6.95 13.75 6.5 13.3 6.5 12.75V11.25C6.5 10.7 6.95 10.25 7.5 10.25H9.5C10.05 10.25 10.5 10.7 10.5 11.25V12.75C10.5 13.3 10.05 13.75 9.5 13.75Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16.5 13.75H14.5C13.95 13.75 13.5 13.3 13.5 12.75V11.25C13.5 10.7 13.95 10.25 14.5 10.25H16.5C17.05 10.25 17.5 10.7 17.5 11.25V12.75C17.5 13.3 17.05 13.75 16.5 13.75Z"
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
              title: "Strategic Depth",
              description:
                "Layer your approach with tactical decisions about loadouts, ability timing, and map control that reward skillful play.",
              icon: (
                <svg
                  className="w-8 h-8 text-blue-400 mb-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.30078 14.2998L9.30078 9.2998L14.3008 7.2998L16.3008 12.2998L11.3008 14.2998"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ),
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="bg-black/30 backdrop-blur-sm border border-blue-900/20 p-6 relative overflow-hidden group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-600/5 rounded-full filter blur-xl opacity-70 group-hover:opacity-100 transition-opacity"></div>

              <div className="relative z-10">
                {feature.icon}
                <h4 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h4>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Futuristic development roadmap component
const DevelopmentRoadmap = () => {
  return (
    <motion.div
      className="max-w-5xl mx-auto mb-32"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="text-center mb-16">
        <motion.h3
          className="text-4xl font-bold playfair mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Development Roadmap
        </motion.h3>
        <motion.div
          className="h-px w-20 bg-blue-500 mx-auto mb-8"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
        <p className="text-gray-300 max-w-2xl mx-auto">
          Track our progress as we move toward the official launch.
        </p>
      </div>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-blue-900/30"></div>

        {/* Roadmap milestones */}
        {[
          {
            title: "Closed Development",
            description:
              "Initial testing with a small group of friends and devs to refine core gameplay mechanics and weapon balance.",
            status: "In Progress",
            icon: (
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.25 11H14.75"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M12 13.75V8.25"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M3.62001 8.49C5.59001 -0.169998 18.42 -0.159997 20.38 8.5C21.53 13.58 18.37 17.88 15.6 20.54C13.59 22.48 10.41 22.48 8.39001 20.54C5.63001 17.88 2.47001 13.57 3.62001 8.49Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ),
            date: "Current Phase",
          },
          {
            title: "Beta Testing",
            description:
              "Expanding player base and testing matchmaking systems, with focus on technical stability and performance.",
            status: "Coming Soon",
            icon: (
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.55 21.67C18.84 20.54 22 16.64 22 12C22 6.48 17.56 2 12 2C5.33 2 2 7.56 2 7.56M2 7.56V3M2 7.56H6.44"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12C2 17.52 6.48 22 12 22"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="3 3"
                />
              </svg>
            ),
            date: "Q3 2025",
          },
          {
            title: "Launch",
            description:
              "Official release across platforms with ranked mode, battle pass, and seasonal content roadmap.",
            status: "Planned (TBD)",
            icon: (
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.5 12H14.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12.5 15L15.5 12L12.5 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ),
            date: "Q4 2025",
          },
        ].map((milestone, index) => (
          <motion.div
            key={index}
            className={`flex items-center mb-12 ${
              index % 2 === 0 ? "flex-row" : "flex-row-reverse"
            }`}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
          >
            {/* Content */}
            <div
              className={`w-5/12 ${
                index % 2 === 0 ? "text-right pr-8" : "text-left pl-8"
              }`}
            >
              <h4 className="text-xl font-bold text-white mb-1">
                {milestone.title}
              </h4>
              <div
                className={`text-sm text-blue-400 mb-2 inline-flex items-center ${
                  index % 2 === 0 ? "justify-end" : "justify-start"
                }`}
              >
                <span>{milestone.date}</span>
                <div
                  className={`w-2 h-2 rounded-full ${
                    milestone.status === "In Progress"
                      ? "bg-green-500 animate-pulse"
                      : "bg-blue-500"
                  } mx-2`}
                ></div>
                <span className="text-xs uppercase tracking-wider">
                  {milestone.status}
                </span>
              </div>
              <p className="text-gray-400">{milestone.description}</p>
            </div>

            {/* Center icon */}
            <div className="w-2/12 flex justify-center">
              <div className="w-12 h-12 rounded-full bg-black border-2 border-blue-500 flex items-center justify-center relative z-10 text-blue-400">
                {milestone.icon}
              </div>
            </div>

            {/* Empty space for alignment */}
            <div className="w-5/12"></div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Enhanced call-to-action with newsletter signup
const EnhancedCTA = () => {
  return (
    <motion.div
      className="max-w-5xl mx-auto mb-20 relative overflow-hidden border border-blue-500/20 p-16"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      {/* Background effects */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px]"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px]"></div>

      {/* Diagonal pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZGVmcz4KPHBhdHRlcm4gaWQ9ImRpYWdvbmFsIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgo8bGluZSB4MT0iMCIgeTE9IjAiIHgyPSIwIiB5Mj0iMTAiIHN0cm9rZT0icmdiYSg2MCwxMzAsMjQ2LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz4KPC9wYXR0ZXJuPgo8L2RlZnM+CjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZGlhZ29uYWwpIi8+Cjwvc3ZnPg==')] opacity-30"></div>

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-blue-500/20"></div>
      <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-blue-500/20"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 border-b border-l border-blue-500/20"></div>
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-blue-500/20"></div>

      <div className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-4xl md:text-5xl font-bold playfair text-white mb-6">
            Join the Battlefield
          </h3>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            Sign up for exclusive updates, early access opportunities, and
            behind-the-scenes content as we develop Project Paradox.
          </p>
        </motion.div>

        <motion.div
          className="max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-black/50 border border-blue-900/30 px-4 py-3 focus:outline-none focus:border-blue-500/50 text-white"
            />
            <MagneticButton>
              <button className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-6 py-3 transition-all duration-300">
                Get Early Access
              </button>
            </MagneticButton>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            By signing up, you agree to receive email updates about Project
            Paradox. We respect your privacy.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Main project showcase component
const ProjectParadoxShowcase = () => {
  const sectionRef = useRef(null);

  // Game data for Project Paradox
  const game: Game = {
    id: 1,
    title: "Project Paradox",
    description:
      "An unannounced competitive 1v1 shooter that redefines the genre through innovative mechanics and strategic depth. Coming soon.",
    image: "/images/placeholder.png",
    platform: "PC & Console",
    tags: ["Shooter", "Competitive", "Multiplayer", "PvP", "Fast-paced"],
    featured: true,
    status: "Unannounced",
    stats: {
      Platform: "PC, Console",
      Engine: "Unreal Engine 5",
      Status: "In Development",
      Release: "TBA",
    },
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
      id="studios"
      ref={sectionRef}
      className="min-h-screen py-32 md:py-40 relative overflow-hidden bg-black"
    >
      {/* Background elements */}
      <div className="absolute inset-0 noise-texture opacity-30 z-10"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-blue-900/30 z-20"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-blue-900/30 z-20"></div>

      {/* Ambient light effects */}
      <div className="absolute -top-96 -left-96 w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-[150px] opacity-30"></div>
      <div className="absolute -bottom-96 -right-96 w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-[150px] opacity-30"></div>

      {/* Tech-inspired background elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZGVmcz4KPHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPGNpcmNsZSBjeD0iMCIgY3k9IjAiIHI9IjAuNSIgZmlsbD0icmdiYSgwLDEwMCwyNTUsMC4wMykiLz4KPC9wYXR0ZXJuPgo8L2RlZnM+CjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiIC8+Cjwvc3ZnPg==')] opacity-40 pointer-events-none z-10"></div>

      {/* Vertical lines for structure */}
      <div className="absolute inset-y-0 left-1/4 w-px bg-white/5 z-20"></div>
      <div className="absolute inset-y-0 right-1/4 w-px bg-white/5 z-20"></div>

      <div className="container mx-auto px-6 relative z-30">
        {/* Hero heading */}
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="mb-24"
            style={{ y: smoothY, opacity: smoothOpacity }}
          >
            {/* Animated text with staggered reveal */}
            <div className="overflow-hidden">
              <h2 className="text-7xl md:text-9xl font-bold playfair tracking-tighter mb-3 text-blue-400">
                <TextReveal>ATK</TextReveal>
              </h2>
            </div>
            <div className="overflow-hidden">
              <h2 className="text-7xl md:text-9xl font-bold playfair tracking-tighter mb-8 text-white">
                <TextReveal delay={0.1}>Studios</TextReveal>
              </h2>
            </div>

            <motion.div
              className="h-0.5 w-24 bg-gradient-to-r from-blue-500 to-blue-300 mb-8"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
              style={{ originX: 0 }}
            />

            <p className="text-xl md:text-2xl max-w-2xl manrope text-gray-300 leading-relaxed">
              Our game development team creates immersive digital worlds and
              interactive experiences that push the boundaries of gameplay and
              storytelling.
            </p>
          </motion.div>

          {/* Featured game - single showcase */}
          <FeaturedGame game={game} />

          {/* Game features section */}
          <GameFeatures game={game} />

          {/* Development roadmap */}
          <DevelopmentRoadmap />

          {/* Technology stack */}
          <motion.div
            className="relative p-12 border border-blue-900/30 bg-blue-900/5 mb-32"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZGVmcz4KPHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxwYXRoIGQ9Ik0gMjAgMCBMIDAgMCAwIDIwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMCwxMDAsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz4KPC9wYXR0ZXJuPgo8L2RlZnM+CjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiIC8+Cjwvc3ZnPg==')] opacity-30"></div>

            <h3 className="text-2xl md:text-3xl font-bold playfair text-white mb-8 relative z-10">
              Our Technology Stack
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
              {[
                "Unreal Engine 5",
                "C++",
                "Dedicated Servers",
                "Cross-Platform",
                "Physics-Based",
                "Real-time VFX",
                "Procedural Audio",
                "Cloud Infrastructure",
              ].map((tech, index) => (
                <motion.div
                  key={index}
                  className="p-4 bg-black/30 backdrop-blur-sm border border-blue-900/20 text-center group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ y: -3 }}
                >
                  <span className="text-blue-300 group-hover:text-blue-400 transition-colors">
                    {tech}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Enhanced call to action */}
          <EnhancedCTA />
        </div>
      </div>

      {/* Marquee banner */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <div className="py-4 bg-blue-900/5 border-t border-b border-blue-500/10 overflow-hidden">
          <div className="whitespace-nowrap inline-flex animate-marquee">
            {Array(2)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="inline-flex items-center gap-8">
                  {[
                    "GAME DEVELOPMENT",
                    "COMPETITIVE SHOOTER",
                    "1V1 COMBAT",
                    "STRATEGIC DEPTH",
                    "IMMERSIVE WORLDS",
                    "NEXT-GEN GAMEPLAY",
                  ].map((text, index) => (
                    <span
                      key={index}
                      className="text-xl font-light text-blue-300/50 mx-8"
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

export default ProjectParadoxShowcase;
