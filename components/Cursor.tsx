"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  useSpring,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "framer-motion";

const Cursor = () => {
  // Cursor state
  const [cursorType, setCursorType] = useState("default");
  const [cursorText, setCursorText] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRotate, setShouldRotate] = useState(false);
  const [showRipple, setShowRipple] = useState(false);
  const [ripplePosition, setRipplePosition] = useState({ x: 0, y: 0 });
  const cursorRef = useRef<HTMLDivElement>(null);

  // Mouse position with spring physics for natural movement
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring configuration for smooth, natural cursor movement
  const springConfig = {
    damping: 15,
    stiffness: 150,
    mass: 0.1,
  };

  // Heavier spring for more luxurious feel
  const luxurySpringConfig = {
    damping: 25,
    stiffness: 120,
    mass: 0.15,
  };

  // Apply spring physics to cursor movement
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  // For magnetic effect on magnetic elements
  const magneticX = useMotionValue(0);
  const magneticY = useMotionValue(0);
  const magneticSpringConfig = {
    damping: 12,
    stiffness: 180,
    mass: 0.2,
  };
  const magneticCursorX = useSpring(magneticX, magneticSpringConfig);
  const magneticCursorY = useSpring(magneticY, magneticSpringConfig);

  // Ring size animation based on cursor type
  const cursorSize = useMotionValue(40);
  const cursorScale = useSpring(cursorSize, luxurySpringConfig);
  const cursorOpacity = useMotionValue(0);
  const cursorAlpha = useSpring(cursorOpacity, { damping: 20, stiffness: 300 });

  // Dot size animation
  const dotSize = useMotionValue(5);
  const dotScale = useSpring(dotSize, { damping: 20, stiffness: 300 });

  // Combined transforms for complex effects
  const dotOpacity = useTransform(dotScale, [5, 0], [1, 0]);

  // Rotation for dynamic cursor orientation
  const ringRotation = useMotionValue(0);
  const ringRotate = useSpring(ringRotation, {
    damping: 50,
    stiffness: 100,
    mass: 0.5,
  });

  // Cursor border thickness - changes on different states
  const borderThickness = useMotionValue(1);
  const borderWidth = useSpring(borderThickness, {
    damping: 20,
    stiffness: 200,
  });

  useEffect(() => {
    // Advanced mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      // Check for magnetic elements
      const magneticElements = document.querySelectorAll(
        '[data-magnetic="true"]'
      );

      // Check for rotate-text (but not magnetic) elements
      const rotateElements = document.querySelectorAll(
        '[data-cursor-rotate="true"]:not([data-magnetic="true"])'
      );

      // Check for glow elements
      const glowElements = document.querySelectorAll(
        '[data-cursor-glow="true"]'
      );

      // Reset magnetic effect
      magneticX.set(0);
      magneticY.set(0);

      // Apply magnetic effect if hovering over magnetic element
      magneticElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const distX = e.clientX - (rect.left + rect.width / 2);
        const distY = e.clientY - (rect.top + rect.height / 2);
        const distance = Math.sqrt(distX * distX + distY * distY);

        // Magnetic effect radius - increased for better detection
        const radius = Math.max(rect.width, rect.height) * 1.5;

        if (distance < radius) {
          // Add rotation effect - ensure proper angle calculation
          const angle = Math.atan2(distY, distX) * (180 / Math.PI);
          ringRotation.set(angle);

          // Apply magnetic pull (stronger when closer)
          const pull = 1 - distance / radius;

          // Apply consistent magnetic effect
          magneticX.set(distX * pull * -0.5);
          magneticY.set(distY * pull * -0.5);

          // Move the actual element if it's magnetic
          if (
            element.hasAttribute("data-magnetic") &&
            element.getAttribute("data-magnetic") === "true"
          ) {
            // Apply transform directly to the element
            (element as HTMLElement).style.transform = `translate(${
              distX * pull * -0.2
            }px, ${distY * pull * -0.2}px)`;
          }
        }
      });

      // Apply rotation effect to elements with data-cursor-rotate
      rotateElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const distX = e.clientX - (rect.left + rect.width / 2);
        const distY = e.clientY - (rect.top + rect.height / 2);
        const distance = Math.sqrt(distX * distX + distY * distY);

        // Rotation effect radius
        const radius = Math.max(rect.width, rect.height) * 1.5;

        if (distance < radius) {
          // Calculate angle for text rotation
          const angle = Math.atan2(distY, distX) * (180 / Math.PI);
          ringRotation.set(angle);
        }
      });

      // Apply glow effect to elements with data-cursor-glow
      glowElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const isInside =
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom;

        if (isInside) {
          // Add a subtle glow to the element
          (element as HTMLElement).style.boxShadow =
            "0 0 20px rgba(255, 255, 255, 0.15)";
        } else {
          (element as HTMLElement).style.boxShadow = "";
        }
      });
    };

    // Handle cursor type and text
    const handleMouseOver = (e: Event) => {
      // Initially set to default
      let type = "default";
      let text = "";
      let shouldRotate = false;

      const target = e.target as Element;
      const linkParent = target.closest("a");
      const buttonParent = target.closest("button");

      // Check for custom attributes
      if (target.getAttribute("data-cursor")) {
        type = target.getAttribute("data-cursor") || "default";
      }

      if (target.getAttribute("data-cursor-text")) {
        text = target.getAttribute("data-cursor-text") || "";
      }

      // Check for a new attribute: data-cursor-rotate
      if (
        target.getAttribute("data-cursor-rotate") === "true" ||
        (linkParent &&
          linkParent.getAttribute("data-cursor-rotate") === "true") ||
        (buttonParent &&
          buttonParent.getAttribute("data-cursor-rotate") === "true")
      ) {
        shouldRotate = true;
      }

      // Check parent elements if needed
      if (type === "default" && linkParent) {
        type = linkParent.getAttribute("data-cursor") || "link";
        text = linkParent.getAttribute("data-cursor-text") || "";
      }

      if (type === "default" && buttonParent) {
        type = buttonParent.getAttribute("data-cursor") || "link";
        text = buttonParent.getAttribute("data-cursor-text") || "";
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

      // Check for images or media
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

      // Apply the cursor type and text
      setCursorType(type);
      setCursorText(text);
      setShouldRotate(shouldRotate);

      // Adjust size and border based on type
      if (type === "link" || type === "view") {
        cursorSize.set(80);
        dotSize.set(0);
        borderThickness.set(1.5);
      } else if (type === "text") {
        cursorSize.set(100);
        dotSize.set(0);
        borderThickness.set(1);
      } else {
        cursorSize.set(40);
        dotSize.set(5);
        borderThickness.set(1);
      }
    };

    const handleMouseOut = (e: Event) => {
      setCursorType("default");
      setCursorText("");
      cursorSize.set(40);
      dotSize.set(5);
      borderThickness.set(1);

      // Reset any magnetic transforms
      const target = e.target as Element;
      const magneticEl = target.hasAttribute("data-magnetic")
        ? target
        : target.closest("[data-magnetic='true']");

      if (magneticEl) {
        (magneticEl as HTMLElement).style.transform = "";
      }

      // Reset any glow effects
      const glowEl = target.hasAttribute("data-cursor-glow")
        ? target
        : target.closest("[data-cursor-glow='true']");

      if (glowEl) {
        (glowEl as HTMLElement).style.boxShadow = "";
      }
    };

    // Hide cursor when leaving window
    const handleMouseLeave = () => {
      cursorOpacity.set(0);
    };

    // Show cursor when entering window
    const handleMouseEnter = () => {
      cursorOpacity.set(1);
    };

    // Click and drag effects with ripple
    const handleMouseDown = (e: MouseEvent) => {
      cursorSize.set(cursorSize.get() * 0.8);
      dotSize.set(3);
      borderThickness.set(2);

      // Create a ripple effect
      setRipplePosition({ x: e.clientX, y: e.clientY });
      setShowRipple(true);
      setTimeout(() => setShowRipple(false), 600);
    };

    const handleMouseUp = () => {
      // Reset to the appropriate size based on current type
      const target = document.elementFromPoint(mouseX.get(), mouseY.get());
      if (target) {
        handleMouseOver({ target } as unknown as MouseEvent);
      }
    };

    // Make cursor visible after a small delay
    const timer = setTimeout(() => {
      setIsVisible(true);
      cursorOpacity.set(1);
    }, 300);

    // Function to add event listeners to elements
    const addEventListeners = (elements: NodeListOf<Element>) => {
      elements.forEach((el) => {
        el.addEventListener("mouseover", handleMouseOver as EventListener);
        el.addEventListener("mouseout", handleMouseOut as EventListener);
      });
    };

    // Add event listeners to all relevant elements
    const elements = document.querySelectorAll(
      "a, button, [data-cursor], img, video, canvas, [data-magnetic], [data-cursor-rotate], [data-cursor-glow]"
    );
    addEventListeners(elements);

    // Create a MutationObserver to handle dynamically added elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              // Element node
              const newElement = node as Element;
              if (
                newElement.matches &&
                (newElement.matches(
                  "a, button, [data-cursor], img, video, canvas, [data-magnetic], [data-cursor-rotate], [data-cursor-glow]"
                ) ||
                  newElement.querySelectorAll(
                    "a, button, [data-cursor], img, video, canvas, [data-magnetic], [data-cursor-rotate], [data-cursor-glow]"
                  ).length > 0)
              ) {
                // Add listeners to the new element
                if (
                  newElement.matches(
                    "a, button, [data-cursor], img, video, canvas, [data-magnetic], [data-cursor-rotate], [data-cursor-glow]"
                  )
                ) {
                  newElement.addEventListener(
                    "mouseover",
                    handleMouseOver as EventListener
                  );
                  newElement.addEventListener(
                    "mouseout",
                    handleMouseOut as EventListener
                  );
                }

                // Add listeners to any matching children
                const childElements = newElement.querySelectorAll(
                  "a, button, [data-cursor], img, video, canvas, [data-magnetic], [data-cursor-rotate], [data-cursor-glow]"
                );
                addEventListeners(childElements);
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

    // Add event listeners
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mouseenter", handleMouseEnter);

    // Clean up event listeners
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
          "a, button, [data-cursor], img, video, canvas, [data-magnetic], [data-cursor-rotate], [data-cursor-glow]"
        )
        .forEach((el) => {
          el.removeEventListener("mouseover", handleMouseOver as EventListener);
          el.removeEventListener("mouseout", handleMouseOut as EventListener);
        });
    };
  }, [
    cursorOpacity,
    cursorSize,
    dotSize,
    borderThickness,
    magneticX,
    magneticY,
    mouseX,
    mouseY,
    ringRotation,
  ]);

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
        {/* Specialized content based on cursor type */}
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
            {cursorText || (cursorType === "link" ? "View" : "View")}
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

      {/* Magnetic effect layer - adds the offset to magnetic elements */}
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
