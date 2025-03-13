"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";

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

// Enhanced Contact Section
const EnhancedContact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [messageSent, setMessageSent] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // Scroll-based animations
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // Apply spring physics for smooth animations
  const smoothY = useSpring(y, { damping: 15, stiffness: 100 });
  const smoothOpacity = useSpring(opacity, { damping: 15, stiffness: 100 });

  // State for fancy form focus
  const [activeField, setActiveField] = useState<string | null>(null);

  // Form submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send the form data to your backend here
    console.log("Form submitted:", formData);

    // Show success message
    setMessageSent(true);

    // Reset form after delay
    setTimeout(() => {
      setMessageSent(false);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    }, 5000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="min-h-screen py-20 md:py-32 relative overflow-hidden bg-gray-950 noise-bg"
    >
      {/* Gradient top border */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"></div>

      {/* Ambient light effects */}
      <div className="absolute -top-48 -left-48 w-96 h-96 bg-blue-600/20 rounded-full filter blur-3xl opacity-40"></div>
      <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-purple-600/20 rounded-full filter blur-3xl opacity-30"></div>
      <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full filter blur-3xl opacity-40"></div>

      {/* Tech grid background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZGVmcz4KPHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxwYXRoIGQ9Ik0gNTAgMCBMIDAgMCAwIDUwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMTAwLDEwMCwyNTUsMC4wMikiIHN0cm9rZS13aWR0aD0iMSIvPgo8L3BhdHRlcm4+CjwvZGVmcz4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIgLz4KPC9zdmc+')] opacity-30 mix-blend-overlay pointer-events-none"></div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-px h-full bg-white/5"></div>
      <div className="absolute top-0 right-1/4 w-px h-full bg-white/5"></div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="mb-16 text-center"
          style={{ opacity: smoothOpacity, y: smoothY }}
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-8 playfair tracking-tighter text-white">
            Contact ATK
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 mx-auto mb-8"></div>
          <p className="text-xl max-w-2xl mx-auto manrope text-gray-300">
            Ready to transform your ideas into extraordinary experiences?
            Connect with us to discuss how we can collaborate on your next
            project.
          </p>
        </motion.div>

        {/* Main contact layout - Two column grid with animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Left side - Contact form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <AnimatePresence mode="wait">
              {!messageSent ? (
                <motion.form
                  key="contactForm"
                  className="bg-black/20 backdrop-blur-sm rounded-sm border border-white/5 p-8 relative"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-12 h-12 border-t border-l border-gradient-to-br from-blue-500/30 to-purple-500/30"></div>
                  <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-gradient-to-bl from-purple-500/30 to-blue-500/30"></div>
                  <div className="absolute bottom-0 left-0 w-12 h-12 border-b border-l border-gradient-to-tr from-blue-500/30 to-purple-500/30"></div>
                  <div className="absolute bottom-0 right-0 w-12 h-12 border-b border-r border-gradient-to-tl from-purple-500/30 to-blue-500/30"></div>

                  <h3 className="text-2xl font-bold mb-6 text-white">
                    Send us a message
                  </h3>

                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => setActiveField("name")}
                        onBlur={() => setActiveField(null)}
                        placeholder="Your Name"
                        className="w-full bg-black/30 border border-white/10 px-4 py-3 text-white focus:outline-none transition-colors duration-300"
                        required
                      />
                      <motion.div
                        className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-blue-500 to-purple-500 w-0"
                        animate={{
                          width: activeField === "name" ? "100%" : "0%",
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>

                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setActiveField("email")}
                        onBlur={() => setActiveField(null)}
                        placeholder="Your Email"
                        className="w-full bg-black/30 border border-white/10 px-4 py-3 text-white focus:outline-none transition-colors duration-300"
                        required
                      />
                      <motion.div
                        className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-blue-500 to-purple-500 w-0"
                        animate={{
                          width: activeField === "email" ? "100%" : "0%",
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        onFocus={() => setActiveField("subject")}
                        onBlur={() => setActiveField(null)}
                        placeholder="Subject"
                        className="w-full bg-black/30 border border-white/10 px-4 py-3 text-white focus:outline-none transition-colors duration-300"
                        required
                      />
                      <motion.div
                        className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-blue-500 to-purple-500 w-0"
                        animate={{
                          width: activeField === "subject" ? "100%" : "0%",
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>

                    <div className="relative">
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        onFocus={() => setActiveField("message")}
                        onBlur={() => setActiveField(null)}
                        placeholder="Your Message"
                        rows={5}
                        className="w-full bg-black/30 border border-white/10 px-4 py-3 text-white focus:outline-none transition-colors duration-300"
                        required
                      />
                      <motion.div
                        className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-blue-500 to-purple-500 w-0"
                        animate={{
                          width: activeField === "message" ? "100%" : "0%",
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>

                    <MagneticButton className="w-full">
                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 border border-white/10 text-white py-3 font-medium uppercase tracking-wider text-sm transition-all duration-300 relative overflow-hidden group"
                        data-cursor="text"
                        data-cursor-text="Send"
                      >
                        <span className="relative z-10 flex items-center justify-center">
                          <span>Send Message</span>
                          <svg
                            className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
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
                        </span>
                        <span className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                      </button>
                    </MagneticButton>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="successMessage"
                  className="bg-black/20 backdrop-blur-sm rounded-sm border border-white/5 p-8 relative flex flex-col items-center justify-center min-h-[400px]"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                      }}
                      className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 mx-auto flex items-center justify-center mb-6"
                    >
                      <svg
                        className="w-10 h-10 text-green-400"
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
                          d="M7.75 12L10.58 14.83L16.25 9.17"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-2 text-white">
                      Message Sent!
                    </h3>
                    <p className="text-gray-400 mb-6">
                      We&apos;ll get back to you as soon as possible.
                    </p>
                    <motion.button
                      onClick={() => setMessageSent(false)}
                      className="text-blue-400 hover:text-blue-300 flex items-center mx-auto"
                      whileHover={{ x: -3 }}
                      transition={{ duration: 0.2 }}
                    >
                      <svg
                        className="w-4 h-4 mr-2 transform rotate-180"
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
                      <span>Send another message</span>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right side - Contact methods */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            {/* Email contact card */}
            <div className="bg-black/20 backdrop-blur-sm rounded-sm border border-white/5 p-8 mb-8 relative overflow-hidden group">
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-blue-500/5 rounded-full blur-xl opacity-70 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-purple-500/5 rounded-full blur-xl opacity-70 group-hover:opacity-100 transition-opacity"></div>

              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-white/10 -translate-x-px -translate-y-px"></div>
              <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-white/10 translate-x-px -translate-y-px"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-white/10 -translate-x-px translate-y-px"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-white/10 translate-x-px translate-y-px"></div>

              <div className="text-center mb-4">
                <motion.div
                  className="inline-block w-16 h-16 rounded-full bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-white/10 flex items-center justify-center mb-4"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </motion.div>

                <h3 className="text-2xl font-bold mb-2 playfair bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                  Email Us
                </h3>

                <p className="text-gray-300 mb-6">
                  Send us a message and we&apos;ll get back to you shortly
                </p>

                <MagneticButton>
                  <a
                    href="mailto:info@atkgroup.com"
                    className="text-xl font-medium text-white relative inline-block group"
                    data-cursor="link"
                    data-cursor-text="Email"
                    data-cursor-rotate="true"
                  >
                    <span className="relative z-10">info@atkgroup.com</span>
                    <span className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 transform origin-left transition-transform duration-300 group-hover:scale-x-100 scale-x-0"></span>
                  </a>
                </MagneticButton>
              </div>
            </div>

            {/* Discord card */}
            <div className="bg-black/20 backdrop-blur-sm rounded-sm border border-white/5 p-8 relative overflow-hidden group">
              <div className="absolute -top-16 -left-16 w-32 h-32 bg-blue-500/5 rounded-full blur-xl opacity-70 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-purple-500/5 rounded-full blur-xl opacity-70 group-hover:opacity-100 transition-opacity"></div>

              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-white/10 -translate-x-px -translate-y-px"></div>
              <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-white/10 translate-x-px -translate-y-px"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-white/10 -translate-x-px translate-y-px"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-white/10 translate-x-px translate-y-px"></div>

              <div className="text-center mb-4">
                <motion.div
                  className="inline-block w-16 h-16 rounded-full bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-white/10 flex items-center justify-center mb-4"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white"
                  >
                    <path d="M9 8h-3v-2h3" />
                    <path d="M6 14v-3" />
                    <path d="M9 8h3" />
                    <path d="M12 14v-3" />
                    <path d="M18 8h-3v-2h3" />
                    <path d="M15 14v-3" />
                    <path d="M3 5V3h18v2" />
                    <path d="M3 21h18" />
                    <path d="M3 21v-9" />
                    <path d="M21 21v-9" />
                  </svg>
                </motion.div>

                <h3 className="text-2xl font-bold mb-2 playfair bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                  Join Our Discord
                </h3>

                <p className="text-gray-300 mb-6">
                  Connect with our community and get real-time support
                </p>

                <MagneticButton>
                  <a
                    href="https://discord.gg/atk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 border border-white/10 text-white inline-flex items-center justify-center font-medium transition-colors duration-300 relative overflow-hidden group"
                    data-cursor="link"
                    data-cursor-text="Join"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M20.317 4.15557C18.7873 3.45373 17.147 2.92531 15.4319 2.6001C15.4007 2.59324 15.3695 2.60782 15.3534 2.63583C15.1424 2.99084 14.9087 3.45258 14.7451 3.81548C12.9004 3.51204 11.0652 3.51204 9.25832 3.81548C9.09465 3.43343 8.85248 2.99084 8.64057 2.63583C8.62449 2.60896 8.59328 2.59438 8.56205 2.6001C6.84791 2.92417 5.20766 3.45259 3.67681 4.15557C3.66366 4.16015 3.65145 4.16929 3.64321 4.18071C0.533932 8.83838 -0.31994 13.3909 0.0991801 17.8825C0.101072 17.9072 0.11449 17.9305 0.131886 17.946C2.18321 19.4685 4.17171 20.3972 6.12328 21.0279C6.15451 21.038 6.18761 21.0265 6.20748 21.0013C6.66913 20.3566 7.08064 19.6739 7.43348 18.9541C7.4553 18.9103 7.43442 18.8594 7.39096 18.8427C6.73818 18.5923 6.1176 18.2836 5.51945 17.9396C5.47122 17.9114 5.46715 17.8428 5.51053 17.8089C5.63085 17.7201 5.75117 17.6268 5.86565 17.5334C5.88646 17.5152 5.91581 17.5129 5.93756 17.5238C9.88504 19.3107 14.1416 19.3107 18.0398 17.5238C18.0615 17.5117 18.0909 17.514 18.1128 17.5322C18.2273 17.6268 18.3476 17.7201 18.4679 17.8089C18.5113 17.8428 18.5072 17.9114 18.459 17.9396C17.8609 18.2894 17.2403 18.5923 16.5875 18.8415C16.544 18.8583 16.5243 18.9103 16.5461 18.9541C16.905 19.6727 17.3165 20.3554 17.771 21.0001C17.7897 21.0265 17.8239 21.038 17.8552 21.0279C19.8195 20.3972 21.808 19.4685 23.8593 17.946C23.8779 17.9305 23.8901 17.9084 23.892 17.8837C24.3989 12.6184 23.0577 8.10634 20.3446 4.18071C20.3375 4.16929 20.3253 4.16015 20.3122 4.15557H20.317Z" />
                    </svg>
                    <span className="relative z-10">Join Discord</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                  </a>
                </MagneticButton>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Additional contact categories */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              title: "Business Inquiries",
              description:
                "For business opportunities and partnerships, please email us with &quot;Business&quot; in the subject line.",
              icon: (
                <svg
                  className="w-6 h-6 text-blue-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points="14 2 14 8 20 8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line
                    x1="16"
                    y1="13"
                    x2="8"
                    y2="13"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line
                    x1="16"
                    y1="17"
                    x2="8"
                    y2="17"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line
                    x1="10"
                    y1="9"
                    x2="8"
                    y2="9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ),
              delay: 0.1,
              gradient: "from-blue-600/10 to-blue-600/20",
            },
            {
              title: "Support",
              description:
                "Need assistance with our products or services? Our team is ready to help.",
              icon: (
                <svg
                  className="w-6 h-6 text-purple-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ),
              delay: 0.2,
              gradient: "from-purple-600/10 to-purple-600/20",
            },
            {
              title: "FAQ",
              description:
                "Check our frequently asked questions or email us your specific questions.",
              icon: (
                <svg
                  className="w-6 h-6 text-gradient-blue-purple"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line
                    x1="12"
                    y1="17"
                    x2="12.01"
                    y2="17"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ),
              delay: 0.3,
              gradient: "from-blue-600/10 to-purple-600/10",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: item.delay }}
              className="bg-black/20 backdrop-blur-sm rounded-sm border border-white/5 p-6 relative overflow-hidden group hover:border-white/10 transition-all duration-300"
            >
              <div
                className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${item.gradient} rounded-full blur-xl transform translate-x-1/2 -translate-y-1/2 opacity-40 group-hover:opacity-60 transition-opacity duration-300`}
              ></div>

              <div className="flex items-center mb-4">
                <div
                  className={`w-10 h-10 rounded-sm bg-gradient-to-br ${item.gradient} border border-white/10 flex items-center justify-center mr-3`}
                >
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
              </div>
              <p className="text-gray-400 text-sm pl-13">{item.description}</p>

              {/* Hover border animation */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute top-0 left-0 w-0 h-0 border-t border-l border-white/20 group-hover:w-full group-hover:h-full transition-all duration-700"></div>
                <div className="absolute bottom-0 right-0 w-0 h-0 border-b border-r border-white/20 group-hover:w-full group-hover:h-full transition-all duration-700"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Inspirational ending */}
        <div className="mt-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h3 className="text-xl font-medium mb-2 playfair">
              Ready to transform your digital presence?
            </h3>
            <p className="text-gray-400 max-w-lg mx-auto mb-8">
              Join the growing list of brands we&apos;ve helped elevate through
              content creation and immersive experiences.
            </p>

            {/* Decorative line */}
            <div className="h-px w-16 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 mx-auto"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedContact;
