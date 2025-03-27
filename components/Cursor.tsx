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
  const [shouldRotate, setShouldRotate] = useState(false);
  const [showRipple, setShowRipple] = useState(false);
  const [ripplePosition, setRipplePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  // Refs
  const cursorRef = useRef<HTMLDivElement>(null);
  const lastMousePosition = useRef({ x: 0, y: 0 });

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
  const cursorScale = useMotionValue(1);

  // Spring physics configurations
  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const magneticSpringConfig = { damping: 12, stiffness: 180, mass: 0.2 };
  const scaleSpringConfig = { damping: 20, stiffness: 300 };

  // Spring animations
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);
  const magneticCursorX = useSpring(magneticX, magneticSpringConfig);
  const magneticCursorY = useSpring(magneticY, magneticSpringConfig);
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
  const scale = useSpring(cursorScale, scaleSpringConfig);

  // Derived values
  const dotOpacity = useTransform(dotScale, [5, 0], [1, 0]);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Mouse movement handler with velocity-based smoothing
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const currentX = e.clientX;
      const currentY = e.clientY;
      const deltaX = currentX - lastMousePosition.current.x;
      const deltaY = currentY - lastMousePosition.current.y;
      const velocity = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Update last position
      lastMousePosition.current = { x: currentX, y: currentY };

      // Apply velocity-based smoothing
      const smoothingFactor = Math.min(velocity * 0.1, 1);
      mouseX.set(currentX);
      mouseY.set(currentY);

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

      // Handle magnetic elements with improved performance
      if (magneticElements.length > 0) {
        const closestElement = Array.from(magneticElements).reduce(
          (closest, element) => {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const distX = currentX - centerX;
            const distY = currentY - centerY;
            const distance = Math.sqrt(distX * distX + distY * distY);
            const radius = Math.max(rect.width, rect.height) * 1.5;

            if (
              distance < radius &&
              (!closest || distance < closest.distance)
            ) {
              return { element, distance, centerX, centerY };
            }
            return closest;
          },
          null as {
            element: Element;
            distance: number;
            centerX: number;
            centerY: number;
          } | null
        );

        if (closestElement) {
          const { element, distance, centerX, centerY } = closestElement;
          const radius =
            Math.max(
              (element as HTMLElement).offsetWidth,
              (element as HTMLElement).offsetHeight
            ) * 1.5;
          const pull = 1 - distance / radius;
          const distX = currentX - centerX;
          const distY = currentY - centerY;

          // Add rotation effect
          const angle = Math.atan2(distY, distX) * (180 / Math.PI);
          ringRotation.set(angle);

          // Apply magnetic pull with smoothing
          magneticX.set(distX * pull * -0.5 * smoothingFactor);
          magneticY.set(distY * pull * -0.5 * smoothingFactor);

          // Apply transform to element
          (element as HTMLElement).style.transform = `translate(${
            distX * pull * -0.2 * smoothingFactor
          }px, ${distY * pull * -0.2 * smoothingFactor}px)`;
        }
      }

      // Handle rotation-only elements
      if (rotateElements.length > 0) {
        const closestRotate = Array.from(rotateElements).reduce(
          (closest, element) => {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const distX = currentX - centerX;
            const distY = currentY - centerY;
            const distance = Math.sqrt(distX * distX + distY * distY);
            const radius = Math.max(rect.width, rect.height) * 1.5;

            if (
              distance < radius &&
              (!closest || distance < closest.distance)
            ) {
              return { element, distance, centerX, centerY };
            }
            return closest;
          },
          null as {
            element: Element;
            distance: number;
            centerX: number;
            centerY: number;
          } | null
        );

        if (closestRotate) {
          const { centerX, centerY } = closestRotate;
          const angle =
            Math.atan2(currentY - centerY, currentX - centerX) *
            (180 / Math.PI);
          ringRotation.set(angle);
        }
      }
    },
    [mouseX, mouseY, magneticX, magneticY, ringRotation]
  );

  // Element mouseover handler with improved performance
  const handleMouseOver = useCallback(
    (e: Event) => {
      const target = e.target as Element;
      const cursorData = target.getAttribute("data-cursor");
      const cursorTextData = target.getAttribute("data-cursor-text");
      const cursorRotateData = target.getAttribute("data-cursor-rotate");

      // Determine cursor type and text
      let type = cursorData || "default";
      let text = cursorTextData || "";
      let rotation = cursorRotateData === "true";

      // Check parent elements if needed
      if (type === "default") {
        const linkParent = target.closest("a");
        const buttonParent = target.closest("button");

        if (linkParent) {
          type = linkParent.getAttribute("data-cursor") || "link";
          text = linkParent.getAttribute("data-cursor-text") || "";
          rotation = linkParent.getAttribute("data-cursor-rotate") === "true";
        } else if (buttonParent) {
          type = buttonParent.getAttribute("data-cursor") || "link";
          text = buttonParent.getAttribute("data-cursor-text") || "";
          rotation = buttonParent.getAttribute("data-cursor-rotate") === "true";
        }
      }

      // Final fallback for links and buttons
      if (
        type === "default" &&
        (target.tagName === "A" ||
          target.tagName === "BUTTON" ||
          target.closest("a") ||
          target.closest("button"))
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

      // Adjust cursor size based on type with smooth transitions
      switch (type) {
        case "link":
        case "view":
          cursorSize.set(80);
          dotSize.set(0);
          borderThickness.set(1.5);
          cursorScale.set(1.2);
          break;
        case "text":
          cursorSize.set(100);
          dotSize.set(0);
          borderThickness.set(1);
          cursorScale.set(1.1);
          break;
        default:
          cursorSize.set(40);
          dotSize.set(5);
          borderThickness.set(1);
          cursorScale.set(1);
      }
    },
    [cursorSize, dotSize, borderThickness, cursorScale]
  );

  // Reset cursor on mouseout with smooth transitions
  const handleMouseOut = useCallback(
    (e: Event) => {
      const target = e.target as Element;
      setCursorType("default");
      setCursorText("");
      cursorSize.set(40);
      dotSize.set(5);
      borderThickness.set(1);
      cursorScale.set(1);

      // Reset transform on magnetic elements with smooth transition
      const magneticEl = target.closest(
        "[data-magnetic='true']"
      ) as HTMLElement;
      if (magneticEl) {
        magneticEl.style.transition = "transform 0.3s ease-out";
        magneticEl.style.transform = "";
        setTimeout(() => {
          magneticEl.style.transition = "";
        }, 300);
      }
    },
    [cursorSize, dotSize, borderThickness, cursorScale]
  );

  // Mouse leave/enter window handlers
  const handleMouseLeave = useCallback(() => {
    cursorOpacity.set(0);
  }, [cursorOpacity]);

  const handleMouseEnter = useCallback(() => {
    cursorOpacity.set(1);
  }, [cursorOpacity]);

  // Mouse down/up handlers with improved animations
  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      cursorSize.set(cursorSize.get() * 0.8);
      dotSize.set(3);
      borderThickness.set(2);
      cursorScale.set(0.9);

      // Create ripple effect
      setRipplePosition({ x: e.clientX, y: e.clientY });
      setShowRipple(true);
      setTimeout(() => setShowRipple(false), 600);
    },
    [cursorSize, dotSize, borderThickness, cursorScale]
  );

  const handleMouseUp = useCallback(() => {
    const target = document.elementFromPoint(mouseX.get(), mouseY.get());
    if (target) {
      handleMouseOver({ target } as unknown as Event);
    }
  }, [handleMouseOver, mouseX, mouseY]);

  // Setup and cleanup effect with improved performance
  useEffect(() => {
    if (isMobile) return;

    // Add event listeners with passive option for better performance
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    window.addEventListener("mouseenter", handleMouseEnter, { passive: true });

    // Element-specific event listeners with improved selector
    const addListeners = (elements: NodeListOf<Element>) => {
      elements.forEach((el) => {
        el.addEventListener("mouseover", handleMouseOver, { passive: true });
        el.addEventListener("mouseout", handleMouseOut, { passive: true });
      });
    };

    const elements = document.querySelectorAll(
      "a, button, [data-cursor], img, video, canvas, [data-magnetic], [data-cursor-rotate]"
    );
    addListeners(elements);

    // Make cursor visible with smooth fade in
    const timer = setTimeout(() => {
      cursorOpacity.set(1);
    }, 300);

    // Create MutationObserver for dynamically added elements with improved performance
    const observer = new MutationObserver((mutations) => {
      const addedNodes = mutations.flatMap((mutation) =>
        Array.from(mutation.addedNodes)
      );
      const newElements = addedNodes
        .filter((node): node is Element => node.nodeType === 1)
        .flatMap((element) => {
          const selector =
            "a, button, [data-cursor], img, video, canvas, [data-magnetic], [data-cursor-rotate]";
          const matches =
            element.matches && element.matches(selector) ? [element] : [];
          const children = Array.from(element.querySelectorAll(selector));
          return [...matches, ...children];
        });

      if (newElements.length > 0) {
        addListeners(newElements as unknown as NodeListOf<Element>);
      }
    });

    // Start observing with optimized configuration
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false,
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
    isMobile,
  ]);

  // Don't render cursor on mobile or server
  if (isMobile || typeof window === "undefined") return null;

  return (
    <>
      {/* Main cursor dot with improved performance */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        style={{
          x: cursorX,
          y: cursorY,
          opacity: cursorAlpha,
          translateX: "-50%",
          translateY: "-50%",
          scale,
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

      {/* Cursor ring/border with improved animations */}
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
          scale,
        }}
      >
        {/* Content based on cursor type with improved animations */}
        <AnimatePresence mode="wait">
          {cursorType === "link" && (
            <motion.span
              key="link"
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
              key="view"
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
              key="zoom"
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
              key="text"
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
        </AnimatePresence>
      </motion.div>

      {/* Ripple effect on click with improved animation */}
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

      {/* Magnetic effect layer with improved performance */}
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
