"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";

const Cursor = () => {
  // Cursor states
  const [cursorType, setCursorType] = useState("default");
  const [cursorText, setCursorText] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRotate, setShouldRotate] = useState(false);
  const [showRipple, setShowRipple] = useState(false);
  const [ripplePosition, setRipplePosition] = useState({ x: 0, y: 0 });

  // Refs
  const cursorRef = useRef<HTMLDivElement>(null);

  // Motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const magneticX = useMotionValue(0);
  const magneticY = useMotionValue(0);
  const cursorSize = useMotionValue(40);
  const dotSize = useMotionValue(5);
  const cursorOpacity = useMotionValue(0);
  const ringRotation = useMotionValue(0);
  const borderThickness = useMotionValue(1);

  // Spring physics configurations
  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const magneticSpringConfig = { damping: 12, stiffness: 180, mass: 0.2 };

  // Spring animations
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);
  const magneticCursorX = useSpring(magneticX, magneticSpringConfig);
  const magneticCursorY = useSpring(magneticY, magneticSpringConfig);
  const cursorScale = useSpring(cursorSize, { damping: 20, stiffness: 300 });
  const cursorAlpha = useSpring(cursorOpacity, { damping: 20, stiffness: 300 });
  const dotScale = useSpring(dotSize, { damping: 20, stiffness: 300 });
  const ringRotate = useSpring(ringRotation, {
    damping: 50,
    stiffness: 100,
    mass: 0.5,
  });
  const borderWidth = useSpring(borderThickness, {
    damping: 20,
    stiffness: 200,
  });

  // Derived values
  const dotOpacity = useTransform(dotScale, [5, 0], [1, 0]);

  // Mouse movement handler
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      // Reset magnetic effect
      magneticX.set(0);
      magneticY.set(0);

      // Check for magnetic elements
      const magneticElements = document.querySelectorAll(
        '[data-magnetic="true"]'
      );
      const rotateElements = document.querySelectorAll(
        '[data-cursor-rotate="true"]:not([data-magnetic="true"])'
      );

      // Handle magnetic elements
      magneticElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distX = e.clientX - centerX;
        const distY = e.clientY - centerY;
        const distance = Math.sqrt(distX * distX + distY * distY);
        const radius = Math.max(rect.width, rect.height) * 1.5;

        if (distance < radius) {
          // Add rotation effect
          const angle = Math.atan2(distY, distX) * (180 / Math.PI);
          ringRotation.set(angle);

          // Apply magnetic pull
          const pull = 1 - distance / radius;
          magneticX.set(distX * pull * -0.5);
          magneticY.set(distY * pull * -0.5);

          // If element itself is magnetic, apply transform to it
          if (element.getAttribute("data-magnetic") === "true") {
            (element as HTMLElement).style.transform = `translate(${
              distX * pull * -0.2
            }px, ${distY * pull * -0.2}px)`;
          }
        }
      });

      // Handle rotation-only elements
      rotateElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distX = e.clientX - centerX;
        const distY = e.clientY - centerY;
        const distance = Math.sqrt(distX * distX + distY * distY);
        const radius = Math.max(rect.width, rect.height) * 1.5;

        if (distance < radius) {
          const angle = Math.atan2(distY, distX) * (180 / Math.PI);
          ringRotation.set(angle);
        }
      });
    },
    [mouseX, mouseY, magneticX, magneticY, ringRotation]
  );

  // Element mouseover handler
  const handleMouseOver = useCallback(
    (e: Event) => {
      const target = e.target as Element;

      // Determine cursor type and text based on element attributes
      let type = "default";
      let text = "";
      let rotation = false;

      // Check for data attributes on target
      if (target.getAttribute("data-cursor")) {
        type = target.getAttribute("data-cursor") || "default";
      }

      if (target.getAttribute("data-cursor-text")) {
        text = target.getAttribute("data-cursor-text") || "";
      }

      if (target.getAttribute("data-cursor-rotate") === "true") {
        rotation = true;
      }

      // Check parent elements if needed
      const linkParent = target.closest("a");
      const buttonParent = target.closest("button");

      if (type === "default" && linkParent) {
        type = linkParent.getAttribute("data-cursor") || "link";
        text = linkParent.getAttribute("data-cursor-text") || "";

        if (linkParent.getAttribute("data-cursor-rotate") === "true") {
          rotation = true;
        }
      }

      if (type === "default" && buttonParent) {
        type = buttonParent.getAttribute("data-cursor") || "link";
        text = buttonParent.getAttribute("data-cursor-text") || "";

        if (buttonParent.getAttribute("data-cursor-rotate") === "true") {
          rotation = true;
        }
      }

      // Final fallback for links and buttons
      if (
        type === "default" &&
        (target.tagName === "A" ||
          target.tagName === "BUTTON" ||
          linkParent ||
          buttonParent)
      ) {
        type = "link";
      }

      // Check for media elements
      if (
        type === "default" &&
        (target.tagName === "IMG" ||
          target.tagName === "VIDEO" ||
          target.tagName === "CANVAS" ||
          target.closest("img") ||
          target.closest("video") ||
          target.closest("canvas"))
      ) {
        type = "view";
      }

      // Update state
      setCursorType(type);
      setCursorText(text);
      setShouldRotate(rotation);

      // Adjust cursor size based on type
      switch (type) {
        case "link":
        case "view":
          cursorSize.set(80);
          dotSize.set(0);
          borderThickness.set(1.5);
          break;
        case "text":
          cursorSize.set(100);
          dotSize.set(0);
          borderThickness.set(1);
          break;
        default:
          cursorSize.set(40);
          dotSize.set(5);
          borderThickness.set(1);
      }
    },
    [cursorSize, dotSize, borderThickness]
  );

  // Reset cursor on mouseout
  const handleMouseOut = useCallback(
    (e: Event) => {
      const target = e.target as Element;
      setCursorType("default");
      setCursorText("");
      cursorSize.set(40);
      dotSize.set(5);
      borderThickness.set(1);

      // Reset transform on magnetic elements
      const magneticEl = target.closest(
        "[data-magnetic='true']"
      ) as HTMLElement;
      if (magneticEl) {
        magneticEl.style.transform = "";
      }
    },
    [cursorSize, dotSize, borderThickness]
  );

  // Mouse leave/enter window handlers
  const handleMouseLeave = useCallback(() => {
    cursorOpacity.set(0);
  }, [cursorOpacity]);

  const handleMouseEnter = useCallback(() => {
    cursorOpacity.set(1);
  }, [cursorOpacity]);

  // Mouse down/up handlers
  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      cursorSize.set(cursorSize.get() * 0.8);
      dotSize.set(3);
      borderThickness.set(2);

      // Create ripple effect
      setRipplePosition({ x: e.clientX, y: e.clientY });
      setShowRipple(true);
      setTimeout(() => setShowRipple(false), 600);
    },
    [cursorSize, dotSize, borderThickness]
  );

  const handleMouseUp = useCallback(() => {
    // Reset based on current cursor type
    const target = document.elementFromPoint(mouseX.get(), mouseY.get());
    if (target) {
      handleMouseOver({ target } as unknown as Event);
    }
  }, [handleMouseOver, mouseX, mouseY]);

  // Setup and cleanup effect
  useEffect(() => {
    // Add event listeners
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mouseenter", handleMouseEnter);

    // Element-specific event listeners
    const addListeners = (elements: NodeListOf<Element>) => {
      elements.forEach((el) => {
        el.addEventListener("mouseover", handleMouseOver);
        el.addEventListener("mouseout", handleMouseOut);
      });
    };

    const elements = document.querySelectorAll(
      "a, button, [data-cursor], img, video, canvas, [data-magnetic], [data-cursor-rotate]"
    );
    addListeners(elements);

    // Make cursor visible
    const timer = setTimeout(() => {
      setIsVisible(true);
      cursorOpacity.set(1);
    }, 300);

    // Create MutationObserver for dynamically added elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              // Element node
              const newElement = node as Element;
              const selector =
                "a, button, [data-cursor], img, video, canvas, [data-magnetic], [data-cursor-rotate]";

              if (newElement.matches && newElement.matches(selector)) {
                newElement.addEventListener("mouseover", handleMouseOver);
                newElement.addEventListener("mouseout", handleMouseOut);
              }

              const childElements = newElement.querySelectorAll(selector);
              if (childElements.length) {
                addListeners(childElements);
              }
            }
          });
        }
      });
    });

    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Cleanup
    return () => {
      clearTimeout(timer);
      observer.disconnect();

      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mouseenter", handleMouseEnter);

      document
        .querySelectorAll(
          "a, button, [data-cursor], img, video, canvas, [data-magnetic], [data-cursor-rotate]"
        )
        .forEach((el) => {
          el.removeEventListener("mouseover", handleMouseOver);
          el.removeEventListener("mouseout", handleMouseOut);
        });
    };
  }, [
    handleMouseMove,
    handleMouseOver,
    handleMouseOut,
    handleMouseDown,
    handleMouseUp,
    handleMouseLeave,
    handleMouseEnter,
    cursorOpacity,
  ]);

  // Only render cursor on client
  if (typeof window === "undefined") return null;

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        style={{
          x: cursorX,
          y: cursorY,
          opacity: cursorAlpha,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          className="rounded-full bg-white"
          style={{
            width: dotScale,
            height: dotScale,
            opacity: dotOpacity,
          }}
        />
      </motion.div>

      {/* Cursor ring/border */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9998] flex items-center justify-center hidden md:flex"
        style={{
          x: cursorX,
          y: cursorY,
          width: cursorScale,
          height: cursorScale,
          translateX: "-50%",
          translateY: "-50%",
          opacity: cursorAlpha,
          rotate: shouldRotate ? ringRotate : 0,
          border: `${borderWidth.get()}px solid rgba(255, 255, 255, 0.6)`,
          backgroundColor:
            cursorType === "link" ? "rgba(255, 255, 255, 0.1)" : "transparent",
          backdropFilter: "blur(4px)",
        }}
      >
        {/* Content based on cursor type */}
        {cursorType === "link" && (
          <motion.span
            className="text-xs text-white uppercase tracking-wider opacity-80 pointer-events-none"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            style={{
              transform: shouldRotate ? "none" : "rotate(0deg)",
              transformOrigin: "center center",
              letterSpacing: "0.1em",
              fontWeight: 500,
            }}
          >
            {cursorText || "View"}
          </motion.span>
        )}

        {cursorType === "view" && (
          <motion.span
            className="text-xs text-white uppercase tracking-wider opacity-80"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            style={{
              letterSpacing: "0.1em",
              fontWeight: 500,
            }}
          >
            {cursorText || "View"}
          </motion.span>
        )}

        {cursorType === "zoom" && (
          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 3H21V9"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 21H3V15"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 3L14 10"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 21L10 14"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        )}

        {cursorType === "text" && (
          <motion.span
            className="text-xs text-white uppercase tracking-wider opacity-80"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            style={{
              letterSpacing: "0.1em",
              fontWeight: 500,
            }}
          >
            {cursorText}
          </motion.span>
        )}
      </motion.div>

      {/* Ripple effect on click */}
      <AnimatePresence>
        {showRipple && (
          <motion.div
            className="fixed pointer-events-none z-[9996] rounded-full bg-white/10 mix-blend-overlay"
            style={{
              x: ripplePosition.x,
              y: ripplePosition.y,
              translateX: "-50%",
              translateY: "-50%",
            }}
            initial={{ width: 0, height: 0, opacity: 0.5 }}
            animate={{ width: 100, height: 100, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {/* Magnetic effect layer */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9997] w-full h-full"
        style={{
          x: magneticCursorX,
          y: magneticCursorY,
        }}
      />
    </>
  );
};

export default Cursor;
