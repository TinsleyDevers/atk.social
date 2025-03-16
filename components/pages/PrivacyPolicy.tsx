"use client";

import React, { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import Link from "next/link";

// Define types for sections
interface PolicySection {
  id: "collect" | "use" | "share" | "rights" | "security" | "changes";
  title: string;
  icon: string;
}

// Custom magnetic effect for interactive elements
const MagneticElement = ({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
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
      className={className}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

const PrivacyPolicy = () => {
  const sectionRef = useRef(null);
  const [activeSection, setActiveSection] = useState<
    "collect" | "use" | "share" | "rights" | "security" | "changes"
  >("collect");

  // Sections for the privacy policy
  const sections: PolicySection[] = [
    { id: "collect", title: "Data Collection", icon: "database" },
    { id: "use", title: "Data Usage", icon: "activity" },
    { id: "share", title: "Data Sharing", icon: "share" },
    { id: "rights", title: "Your Rights", icon: "shield" },
    { id: "security", title: "Security", icon: "lock" },
    { id: "changes", title: "Policy Changes", icon: "refresh" },
  ];

  // Parallax effect for header
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  // Smooth animations
  const smoothY = useSpring(y, { damping: 15, stiffness: 100 });
  const smoothOpacity = useSpring(opacity, { damping: 15, stiffness: 100 });
  const smoothScale = useSpring(scale, { damping: 15, stiffness: 100 });

  const handleSectionClick = (
    sectionId: "collect" | "use" | "share" | "rights" | "security" | "changes"
  ) => {
    setActiveSection(sectionId);
  };

  // Dynamic SVG icons
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "database":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
          </svg>
        );
      case "activity":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
        );
      case "share":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
        );
      case "shield":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
        );
      case "lock":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        );
      case "refresh":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M23 4v6h-6"></path>
            <path d="M1 20v-6h6"></path>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
          </svg>
        );
      default:
        return null;
    }
  };

  // Section content definitions
  const sectionContent: Record<string, React.ReactElement> = {
    collect: (
      <div>
        <h3 className="text-2xl font-bold mb-4 playfair">
          Information We Collect
        </h3>
        <p className="mb-4 text-gray-300">
          We collect several types of information from and about users of our
          Services, including:
        </p>
        <ul className="space-y-3 mb-6">
          <li className="flex items-start">
            <span className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center mr-3 mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-purple-400"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
            <span>
              <strong className="text-white">Personal Data:</strong>{" "}
              <span className="text-gray-300">
                Email address, name, payment information, and other information
                you provide when creating an account.
              </span>
            </span>
          </li>
          <li className="flex items-start">
            <span className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-400"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
            <span>
              <strong className="text-white">Usage Data:</strong>{" "}
              <span className="text-gray-300">
                Information about how you interact with our Services, including
                browsing actions, patterns, and features used.
              </span>
            </span>
          </li>
          <li className="flex items-start">
            <span className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center mr-3 mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-purple-400"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
            <span>
              <strong className="text-white">Technical Data:</strong>{" "}
              <span className="text-gray-300">
                IP address, browser type and version, device type, operating
                system, and other technology identifiers on the devices you use.
              </span>
            </span>
          </li>
        </ul>
        <p className="mb-4 text-gray-300">
          We collect this information directly from you when you provide it to
          us, automatically when you use our Services, and from third parties
          such as business partners and analytics providers.
        </p>
      </div>
    ),
    use: (
      <div>
        <h3 className="text-2xl font-bold mb-4 playfair">
          How We Use Your Data
        </h3>
        <p className="mb-4 text-gray-300">
          ATK uses the information we collect for various purposes, including
          to:
        </p>
        <ul className="space-y-3 mb-6">
          <li className="flex items-start">
            <span className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-400"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
            <span>
              <strong className="text-white">Provide Services:</strong>{" "}
              <span className="text-gray-300">
                Deliver the content, products, and services you request and send
                related information.
              </span>
            </span>
          </li>
          <li className="flex items-start">
            <span className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center mr-3 mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-purple-400"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
            <span>
              <strong className="text-white">Improve Services:</strong>{" "}
              <span className="text-gray-300">
                Understand how users interact with our Services to enhance user
                experience and develop new features.
              </span>
            </span>
          </li>
          <li className="flex items-start">
            <span className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-400"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
            <span>
              <strong className="text-white">Personalization:</strong>{" "}
              <span className="text-gray-300">
                Tailor content and recommendations based on your preferences and
                usage patterns.
              </span>
            </span>
          </li>
          <li className="flex items-start">
            <span className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center mr-3 mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-purple-400"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
            <span>
              <strong className="text-white">Communications:</strong>{" "}
              <span className="text-gray-300">
                Contact you regarding your account, provide customer support,
                and send updates about our Services.
              </span>
            </span>
          </li>
        </ul>
        <p className="mb-4 text-gray-300">
          We process your personal information only when we have a valid legal
          basis to do so, such as your consent, to fulfill a contract with you,
          or for our legitimate interests.
        </p>
      </div>
    ),
    share: (
      <div>
        <h3 className="text-2xl font-bold mb-4 playfair">
          Information Sharing
        </h3>
        <p className="mb-4 text-gray-300">
          ATK may share your personal information in the following
          circumstances:
        </p>
        <ul className="space-y-3 mb-6">
          <li className="flex items-start">
            <span className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-400"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
            <span>
              <strong className="text-white">Service Providers:</strong>{" "}
              <span className="text-gray-300">
                With contractors, service providers, and other third parties we
                use to support our business.
              </span>
            </span>
          </li>
          <li className="flex items-start">
            <span className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center mr-3 mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-purple-400"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
            <span>
              <strong className="text-white">Business Transfers:</strong>{" "}
              <span className="text-gray-300">
                In connection with any merger, sale of company assets,
                financing, or acquisition of all or a portion of our business.
              </span>
            </span>
          </li>
          <li className="flex items-start">
            <span className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-400"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
            <span>
              <strong className="text-white">Legal Requirements:</strong>{" "}
              <span className="text-gray-300">
                If required to do so by law or in response to valid requests by
                public authorities.
              </span>
            </span>
          </li>
          <li className="flex items-start">
            <span className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center mr-3 mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-purple-400"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
            <span>
              <strong className="text-white">With Your Consent:</strong>{" "}
              <span className="text-gray-300">
                In other ways we describe when you provide the information or
                with your consent.
              </span>
            </span>
          </li>
        </ul>
        <p className="mb-4 text-gray-300">
          We require all third parties to respect the security of your personal
          information and to treat it in accordance with the law.
        </p>
      </div>
    ),
    rights: (
      <div>
        <h3 className="text-2xl font-bold mb-4 playfair">
          Your Privacy Rights
        </h3>
        <p className="mb-4 text-gray-300">
          Depending on your location, you may have certain rights regarding your
          personal information, including:
        </p>
        <ul className="space-y-3 mb-6">
          <li className="flex items-start">
            <span className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-400"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
            <span>
              <strong className="text-white">Access:</strong>{" "}
              <span className="text-gray-300">
                The right to request copies of your personal information.
              </span>
            </span>
          </li>
          <li className="flex items-start">
            <span className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center mr-3 mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-purple-400"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
            <span>
              <strong className="text-white">Rectification:</strong>{" "}
              <span className="text-gray-300">
                The right to request correction of information you believe is
                inaccurate.
              </span>
            </span>
          </li>
          <li className="flex items-start">
            <span className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-400"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
            <span>
              <strong className="text-white">Erasure:</strong>{" "}
              <span className="text-gray-300">
                The right to request deletion of your personal information in
                certain circumstances.
              </span>
            </span>
          </li>
          <li className="flex items-start">
            <span className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center mr-3 mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-purple-400"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
            <span>
              <strong className="text-white">Restriction:</strong>{" "}
              <span className="text-gray-300">
                The right to request restriction of processing of your
                information.
              </span>
            </span>
          </li>
          <li className="flex items-start">
            <span className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-400"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
            <span>
              <strong className="text-white">Data Portability:</strong>{" "}
              <span className="text-gray-300">
                The right to receive your personal information in a structured,
                commonly used format.
              </span>
            </span>
          </li>
        </ul>
        <p className="mb-4 text-gray-300">
          To exercise any of these rights, please contact us using the
          information provided in the &quot;Contact Us&quot; section.
        </p>
      </div>
    ),
    security: (
      <div>
        <h3 className="text-2xl font-bold mb-4 playfair">Data Security</h3>
        <p className="mb-4 text-gray-300">
          We have implemented appropriate technical and organizational measures
          to protect your personal information from accidental loss,
          unauthorized access, and other security risks.
        </p>
        <ul className="space-y-3 mb-6">
          <li className="flex items-start">
            <span className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-400"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
            <span>
              <strong className="text-white">Encryption:</strong>{" "}
              <span className="text-gray-300">
                We use industry-standard encryption to protect sensitive data in
                transit and at rest.
              </span>
            </span>
          </li>
          <li className="flex items-start">
            <span className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center mr-3 mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-purple-400"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
            <span>
              <strong className="text-white">Access Controls:</strong>{" "}
              <span className="text-gray-300">
                We limit access to personal information to authorized personnel
                only.
              </span>
            </span>
          </li>
          <li className="flex items-start">
            <span className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-400"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
            <span>
              <strong className="text-white">Regular Audits:</strong>{" "}
              <span className="text-gray-300">
                We conduct security assessments and audits to ensure our
                measures remain effective.
              </span>
            </span>
          </li>
        </ul>
        <p className="mb-4 text-gray-300">
          Despite our efforts, no method of transmission over the Internet or
          electronic storage is 100% secure. We cannot guarantee absolute
          security but continuously work to enhance our protective measures.
        </p>
      </div>
    ),
    changes: (
      <div>
        <h3 className="text-2xl font-bold mb-4 playfair">Policy Updates</h3>
        <p className="mb-4 text-gray-300">
          We may update this Privacy Policy from time to time to reflect changes
          in our practices or for other operational, legal, or regulatory
          reasons.
        </p>
        <ul className="space-y-3 mb-6">
          <li className="flex items-start">
            <span className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center mr-3 mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-purple-400"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
            <span>
              <strong className="text-white">Notification:</strong>{" "}
              <span className="text-gray-300">
                We will notify you of any material changes by posting the
                updated policy on our website and updating the &quot;Last
                Updated&quot; date.
              </span>
            </span>
          </li>
          <li className="flex items-start">
            <span className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-400"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
            <span>
              <strong className="text-white">Review:</strong>{" "}
              <span className="text-gray-300">
                We encourage you to review this Privacy Policy periodically to
                stay informed about how we collect, use, and protect your
                information.
              </span>
            </span>
          </li>
        </ul>
        <p className="mb-4 text-gray-300">
          Your continued use of our Services after we post any modifications to
          the Privacy Policy will constitute your acknowledgment of the
          modifications and your consent to abide by them.
        </p>
        <div className="mt-8 p-6 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-white/10">
          <p className="text-white">Last Updated: March 12, 2025</p>
          <p className="text-gray-400 mt-2">
            If you have any questions about this Privacy Policy, please contact
            us at{" "}
            <a
              href="mailto:privacy@atkgroup.com"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              privacy@atkgroup.com
            </a>
            .
          </p>
        </div>
      </div>
    ),
  };

  return (
    <>
      <section className="min-h-screen bg-black relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 noise-texture opacity-30 z-10"></div>

        {/* Back to home button */}
        <div className="fixed top-24 left-8 z-30">
          <motion.a
            href="/"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-2 text-white/80 hover:text-white group transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transform group-hover:-translate-x-1 transition-transform"
            >
              <path d="M19 12H5"></path>
              <path d="M12 19l-7-7 7-7"></path>
            </svg>
            <span className="relative">
              Back to Home
              <span className="absolute bottom-0 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300"></span>
            </span>
          </motion.a>
        </div>

        {/* Header with parallax effect */}
        <header
          ref={sectionRef}
          className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden"
        >
          <motion.div
            className="relative z-20 text-center px-6"
            style={{
              y: smoothY,
              opacity: smoothOpacity,
              scale: smoothScale,
            }}
          >
            <motion.h1
              className="text-5xl md:text-7xl font-bold playfair tracking-tighter mb-8"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              Privacy Policy
            </motion.h1>
            <motion.div
              className="h-px w-40 mx-auto bg-gradient-to-r from-purple-500 via-white to-blue-500 mb-8"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            />
            <motion.p
              className="text-xl max-w-2xl mx-auto manrope text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Your privacy matters to us. Learn how ATK collects, uses, and
              protects your information.
            </motion.p>
          </motion.div>

          {/* Decorative grid pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZGVmcz4KPHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxwYXRoIGQ9Ik0gNTAgMCBMIDAgMCAwIDUwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiIHN0cm9rZS13aWR0aD0iMSIvPgo8L3BhdHRlcm4+CjwvZGVmcz4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIgLz4KPC9zdmc+')] opacity-20 z-10"></div>
        </header>

        {/* Main content with interactive sections */}
        <div className="container mx-auto px-6 py-20 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left sidebar navigation */}
            <div className="lg:sticky lg:top-24 lg:h-screen lg:max-h-[calc(100vh-6rem)]">
              <div className="bg-black/50 backdrop-blur-sm border border-white/10 p-6 h-full">
                <h2 className="text-2xl font-bold mb-6 playfair">
                  Policy Sections
                </h2>

                <nav className="space-y-4">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => handleSectionClick(section.id)}
                      className={`w-full text-left px-4 py-3 flex items-center space-x-3 transition-all duration-300 ${
                        activeSection === section.id
                          ? "bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-l-2 border-l-purple-500"
                          : "hover:bg-white/5 border-l-2 border-l-transparent"
                      }`}
                    >
                      <span
                        className={`${
                          activeSection === section.id
                            ? "text-white"
                            : "text-gray-400"
                        }`}
                      >
                        {renderIcon(section.icon)}
                      </span>
                      <span
                        className={`${
                          activeSection === section.id
                            ? "text-white"
                            : "text-gray-400"
                        }`}
                      >
                        {section.title}
                      </span>
                    </button>
                  ))}
                </nav>

                <div className="mt-12 pt-6 border-t border-white/10">
                  <div className="text-sm text-gray-400">
                    <p className="mb-4">
                      Need assistance with privacy concerns?
                    </p>
                    <MagneticElement className="inline-block">
                      <a
                        href="#contact"
                        className="inline-flex items-center text-white hover:text-purple-300 transition-colors duration-300 group"
                      >
                        <span>Contact our privacy team</span>
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
                          className="ml-2 transform group-hover:translate-x-1 transition-transform"
                        >
                          <path d="M5 12h14"></path>
                          <path d="M12 5l7 7-7 7"></path>
                        </svg>
                      </a>
                    </MagneticElement>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side content area */}
            <div className="lg:col-span-2">
              <div className="bg-black/50 backdrop-blur-sm border border-white/10 p-8 md:p-12 relative">
                {/* Animated content transition */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    {sectionContent[activeSection]}
                  </motion.div>
                </AnimatePresence>

                {/* Corner accents for styling */}
                <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-white/20 -translate-x-px -translate-y-px"></div>
                <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-white/20 translate-x-px -translate-y-px"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b border-l border-white/20 -translate-x-px translate-y-px"></div>
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-white/20 translate-x-px translate-y-px"></div>
              </div>

              {/* Navigation buttons */}
              <div className="mt-8 flex justify-between">
                <MagneticElement className="inline-block">
                  <button
                    onClick={() => {
                      const currentIndex = sections.findIndex(
                        (s) => s.id === activeSection
                      );
                      if (currentIndex > 0) {
                        setActiveSection(sections[currentIndex - 1].id);
                      }
                    }}
                    className={`px-4 py-2 border border-white/20 flex items-center space-x-2 transition-all duration-300 ${
                      activeSection === sections[0].id
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:border-white/40"
                    }`}
                    disabled={activeSection === sections[0].id}
                  >
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
                      <path d="M19 12H5"></path>
                      <path d="M12 19l-7-7 7-7"></path>
                    </svg>
                    <span>Previous Section</span>
                  </button>
                </MagneticElement>

                <MagneticElement className="inline-block">
                  <button
                    onClick={() => {
                      const currentIndex = sections.findIndex(
                        (s) => s.id === activeSection
                      );
                      if (currentIndex < sections.length - 1) {
                        setActiveSection(sections[currentIndex + 1].id);
                      }
                    }}
                    className={`px-4 py-2 border border-white/20 flex items-center space-x-2 transition-all duration-300 ${
                      activeSection === sections[sections.length - 1].id
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:border-white/40"
                    }`}
                    disabled={
                      activeSection === sections[sections.length - 1].id
                    }
                  >
                    <span>Next Section</span>
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
                      <path d="M5 12h14"></path>
                      <path d="M12 5l7 7-7 7"></path>
                    </svg>
                  </button>
                </MagneticElement>
              </div>
            </div>
          </div>
        </div>

        {/* Animated footer with print option */}
        <div className="py-12 relative z-20">
          <div className="container mx-auto px-6">
            <motion.div
              className="max-w-4xl mx-auto bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-white/10 p-8 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold mb-4 playfair">
                Need a copy of this policy?
              </h3>
              <p className="text-gray-300 mb-6">
                You can print or save this policy for your records.
              </p>

              <MagneticElement className="inline-block">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center px-6 py-3 bg-white/5 border border-white/20 hover:bg-white/10 transition-all duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <polyline points="6 9 6 2 18 2 18 9"></polyline>
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                    <rect x="6" y="14" width="12" height="8"></rect>
                  </svg>
                  Print Privacy Policy
                </button>
              </MagneticElement>

              <div className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
                <p>© {new Date().getFullYear()} ATK. All rights reserved.</p>
                <div className="flex space-x-6 mt-4 md:mt-0">
                  <Link href="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                  <Link
                    href="/terms"
                    className="hover:text-white transition-colors"
                  >
                    Terms of Service
                  </Link>
                  <Link
                    href="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="/cookies"
                    className="hover:text-white transition-colors"
                  >
                    Cookies
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PrivacyPolicy;
