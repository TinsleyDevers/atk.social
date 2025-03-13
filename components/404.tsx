"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

// Magnetic button component for interactive elements
const MagneticButton = ({
  children,
  className,
  href,
}: {
  children: React.ReactNode;
  className?: string;
  href: string;
}) => {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

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
  };

  return (
    <motion.a
      ref={buttonRef}
      href={href}
      className={`${className} inline-block`}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-cursor="magnetic"
    >
      {children}
    </motion.a>
  );
};

// Character reveal animation component
const CharacterReveal = ({
  text,
  delay = 0,
}: {
  text: string;
  delay?: number;
}) => {
  const characters = Array.from(text);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.03,
            delayChildren: delay,
          },
        },
      }}
      className="inline-block"
    >
      {characters.map((char, index) => (
        <motion.span
          key={index}
          className="inline-block"
          variants={{
            hidden: {
              y: 50,
              opacity: 0,
              rotateX: 40,
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
          }}
          style={{ transformOrigin: "bottom center" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.div>
  );
};

// Split Outline Text
const SplitOutlineText = ({ text }: { text: string }) => {
  return (
    <div className="relative">
      <span className="absolute -top-0.5 -left-0.5 text-outline opacity-40">
        {text}
      </span>
      <span className="absolute -bottom-0.5 -right-0.5 text-outline opacity-40">
        {text}
      </span>
      <span className="relative z-10">{text}</span>
    </div>
  );
};

const NotFoundPage = () => {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
      {/* Background grid and texture */}
      <div className="absolute inset-0 noise-texture opacity-30 z-10"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZGVmcz4KPHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxwYXRoIGQ9Ik0gNTAgMCBMIDAgMCAwIDUwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiIHN0cm9rZS13aWR0aD0iMSIvPgo8L3BhdHRlcm4+CjwvZGVmcz4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIgLz4KPC9zdmc+')] opacity-20 z-0"></div>

      <div className="container mx-auto px-6 relative z-20">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Main 404 text */}
          <motion.div className="relative mb-6" transition={{ duration: 0.2 }}>
            <h1 className="text-[20vw] font-bold playfair tracking-tighter leading-none relative">
              <SplitOutlineText text="404" />
            </h1>

            <motion.div
              className="absolute -top-[5%] -left-[5%] w-[110%] h-[110%] bg-black/10 z-30 pointer-events-none mix-blend-overlay"
              animate={{
                opacity: [0, 0.05, 0],
                backgroundPosition: ["0% 0%", "100% 100%"],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: "mirror",
              }}
            />
          </motion.div>

          {/* Subtitle with character reveal */}
          <div className="overflow-hidden mb-10">
            <h2 className="text-3xl md:text-5xl playfair">
              <CharacterReveal text="Page Not Found" delay={0.5} />
            </h2>
          </div>

          {/* Animated line divider */}
          <motion.div
            className="h-px w-40 bg-white/40 mx-auto mb-8"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 1 }}
          />

          <motion.p
            className="text-xl max-w-xl mx-auto manrope text-gray-300 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            The content you&apos;re looking for doesn&apos;t exist or has moved
            to a new location.
          </motion.p>

          {/* Interactive buttons */}

          <div className="flex flex-wrap justify-center gap-6">
            <MagneticButton
              href="/"
              className="px-8 py-3 bg-white text-black font-medium transition-all relative overflow-hidden group"
            >
              <span className="relative z-10">Back to Homepage</span>
              <span className="absolute inset-0 bg-white transform-gpu origin-bottom duration-300 ease-out group-hover:scale-y-0"></span>
              <span className="absolute inset-0 bg-gray-100 transform-gpu origin-top scale-y-0 duration-300 ease-out group-hover:scale-y-100"></span>
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* Decorative corner elements */}
      <div className="absolute top-12 left-12 z-20">
        <motion.div
          className="w-20 h-20 border-t border-l border-white/20"
          initial={{ width: 0, height: 0 }}
          animate={{ width: 80, height: 80 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        />
      </div>

      <div className="absolute bottom-12 right-12 z-20">
        <motion.div
          className="w-20 h-20 border-b border-r border-white/20"
          initial={{ width: 0, height: 0 }}
          animate={{ width: 80, height: 80 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        />
      </div>

      {/* ATK Logo */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-30">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <Link href="/" className="inline-block">
            <div className="flex items-center">
              <div className="w-12 h-12 relative">
                <Image
                  src="/images/ATKLogoTransparent.png"
                  alt="ATK"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
            </div>
          </Link>
        </motion.div>
      </div>

      {/* Scrolling text at bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <div className="py-4 bg-white/5 border-t border-b border-white/10 overflow-hidden">
          <div className="whitespace-nowrap inline-flex animate-marquee">
            {Array(2)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="inline-flex items-center gap-8">
                  {[
                    "PAGE NOT FOUND",
                    "ATK TERRITORY",
                    "404 ERROR",
                    "RETURN HOME",
                  ].map((text, index) => (
                    <span
                      key={index}
                      className="text-xl font-light text-white/50 mx-8"
                    >
                      {text}
                    </span>
                  ))}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
