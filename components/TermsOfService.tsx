"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import SplitText from "@/utils/SplitText";

// Text reveal component for section headers
const RevealText = ({
  children,
  delay = 0,
}: {
  children: string;
  delay?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref} className="overflow-hidden">
      <motion.span
        className="block"
        initial={{ y: 100 }}
        animate={isInView ? { y: 0 } : { y: 100 }}
        transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1],
          delay,
        }}
      >
        {children}
      </motion.span>
    </div>
  );
};

// Component for animated section entry
const AnimatedSection = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  id?: string;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay }}
      className={`${className}`}
    >
      {children}
    </motion.div>
  );
};

// Interactive accordion component for TOS sections
const AccordionItem = ({
  title,
  children,
  index,
}: {
  title: string;
  children: React.ReactNode;
  index: number;
  id?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <motion.div
      className="mb-6 border-b border-white/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
    >
      <button
        className="flex justify-between items-center w-full py-5 text-xl font-medium text-left text-white/90 focus:outline-none group"
        onClick={() => setIsOpen(!isOpen)}
        data-cursor="magnetic"
      >
        <span className="flex items-center">
          <span className="text-sm text-white/40 mr-4 font-mono">
            {(index + 1).toString().padStart(2, "0")}
          </span>
          {title}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="h-6 w-6 text-white flex items-center justify-center relative"
        >
          <span className="absolute w-6 h-px bg-white/60 group-hover:bg-white transition-colors"></span>
          <span className="absolute w-px h-6 bg-white/60 group-hover:bg-white transition-colors"></span>
        </motion.div>
      </button>
      <motion.div
        animate={{ height }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden"
      >
        <div
          ref={contentRef}
          className="pb-6 pt-2 text-white/70 leading-relaxed"
        >
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

const TermsOfService = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState("");

  // Sections for navigation
  const sections = useMemo(
    () => [
      { id: "introduction", label: "Introduction" },
      { id: "use-license", label: "Use License" },
      { id: "restrictions", label: "Restrictions" },
      { id: "content", label: "Your Content" },
      { id: "privacy", label: "Privacy" },
      { id: "termination", label: "Termination" },
      { id: "disclaimer", label: "Disclaimer" },
      { id: "changes", label: "Changes" },
    ],
    []
  );

  // Handle active section on scroll for nav highlighting
  useEffect(() => {
    const handleScroll = () => {
      if (sections) {
        const scrollPosition = window.scrollY + 100;

        // Find active section
        for (const section of sections) {
          const element = document.getElementById(section.id);
          if (element) {
            const top = element.offsetTop;
            const height = element.offsetHeight;

            if (scrollPosition >= top && scrollPosition < top + height) {
              setActiveSection(section.id);
              break;
            }
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Call once to set initial active section

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [sections]);

  // Date when terms were last updated
  const lastUpdated = "March 12, 2025";

  return (
    <>
      <main className="relative bg-black">
        {/* Background elements */}
        <div className="absolute inset-0 noise-texture opacity-30 z-0"></div>

        {/* Back to home button */}
        <div className="fixed top-20 left-5 z-30">
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

        {/* Hero section */}
        <section className="min-h-[60vh] flex items-center justify-center relative overflow-hidden py-32">
          <div className="absolute inset-0 z-0">
            {/* Ambient light effect */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full filter blur-[150px] opacity-50 z-10"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full filter blur-[150px] opacity-50 z-10"></div>

            {/* Grid lines for visual structure */}
            <div className="absolute inset-0 grid grid-cols-4 z-0">
              <div className="border-l border-white/5 h-full"></div>
              <div className="border-l border-white/5 h-full"></div>
              <div className="border-l border-white/5 h-full"></div>
              <div className="border-l border-r border-white/5 h-full"></div>
            </div>
          </div>

          <div className="container mx-auto px-6 relative z-20">
            <motion.div
              className="text-center max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <h1 className="text-5xl md:text-8xl font-bold playfair tracking-tighter mb-6">
                <SplitText>Terms of Service</SplitText>
              </h1>

              <motion.div
                className="h-px w-20 bg-white/40 mx-auto mb-8"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 1 }}
              />

              <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-6">
                Please read these terms carefully before accessing or using our
                services.
              </p>

              <p className="text-sm text-white/50">
                Last updated: {lastUpdated}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Main content section with sidebar navigation */}
        <section className="relative z-10 py-20" ref={sectionRef}>
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
              {/* Sticky sidebar navigation */}
              <div className="md:col-span-3">
                <div className="sticky top-32">
                  <AnimatedSection delay={0.3}>
                    <h3 className="text-xs uppercase tracking-wider text-white/50 mb-6">
                      Navigation
                    </h3>

                    <nav className="space-y-4">
                      {sections.map((section) => (
                        <Link
                          key={section.id}
                          href={`#${section.id}`}
                          className={`block text-sm transition-colors relative group ${
                            activeSection === section.id
                              ? "text-white"
                              : "text-white/50 hover:text-white/80"
                          }`}
                          data-cursor="magnetic"
                        >
                          <span className="flex items-center">
                            <span
                              className={`w-5 h-px mr-3 transition-all duration-300 ${
                                activeSection === section.id
                                  ? "bg-white w-8"
                                  : "bg-white/30 group-hover:bg-white/60 group-hover:w-6"
                              }`}
                            ></span>
                            {section.label}
                          </span>
                        </Link>
                      ))}
                    </nav>

                    <div className="mt-12 p-6 bg-white/5 border border-white/10">
                      <p className="text-sm text-white/70 mb-4">
                        Need help understanding our terms?
                      </p>
                      <Link
                        href="#contact"
                        className="text-sm text-white inline-flex items-center group"
                        data-cursor="magnetic"
                      >
                        <span>Contact us</span>
                        <motion.svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="ml-2"
                          initial={{ x: 0 }}
                          animate={{ x: [0, 5, 0] }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            repeatType: "loop",
                            ease: "easeInOut",
                            repeatDelay: 1,
                          }}
                        >
                          <path d="M5 12h14"></path>
                          <path d="m12 5 7 7-7 7"></path>
                        </motion.svg>
                      </Link>
                    </div>
                  </AnimatedSection>
                </div>
              </div>

              {/* Main content */}
              <div className="md:col-span-9">
                <div className="max-w-3xl">
                  {/* Introduction */}
                  <AnimatedSection id="introduction" className="mb-16">
                    <h2 className="text-3xl font-bold mb-8 playfair">
                      <RevealText>Introduction</RevealText>
                    </h2>

                    <div className="prose prose-lg prose-invert">
                      <p>
                        Welcome to ATK. By accessing our website, you agree to
                        be bound by these Terms of Service, all applicable laws
                        and regulations, and agree that you are responsible for
                        compliance with any applicable local laws.
                      </p>
                      <p>
                        If you do not agree with any of these terms, you are
                        prohibited from using or accessing this site. The
                        materials contained in this website are protected by
                        applicable copyright and trademark law.
                      </p>
                    </div>
                  </AnimatedSection>

                  {/* Use License */}
                  <AnimatedSection
                    id="use-license"
                    className="mb-16"
                    delay={0.1}
                  >
                    <h2 className="text-3xl font-bold mb-8 playfair">
                      <RevealText delay={0.1}>Use License</RevealText>
                    </h2>

                    <div className="prose prose-lg prose-invert">
                      <p>
                        Permission is granted to temporarily download one copy
                        of the materials (information or software) on ATK&apos;s
                        website for personal, non-commercial transitory viewing
                        only. This is the grant of a license, not a transfer of
                        title, and under this license you may not:
                      </p>

                      <ul className="space-y-2 my-6">
                        <li className="flex items-start">
                          <span className="text-purple-400 mr-2">•</span>
                          <span>Modify or copy the materials</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-purple-400 mr-2">•</span>
                          <span>
                            Use the materials for any commercial purpose, or for
                            any public display (commercial or non-commercial)
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-purple-400 mr-2">•</span>
                          <span>
                            Attempt to decompile or reverse engineer any
                            software contained on ATK&apos;s website
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-purple-400 mr-2">•</span>
                          <span>
                            Remove any copyright or other proprietary notations
                            from the materials
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-purple-400 mr-2">•</span>
                          <span>
                            Transfer the materials to another person or
                            &quot;mirror&quot; the materials on any other server
                          </span>
                        </li>
                      </ul>

                      <p>
                        This license shall automatically terminate if you
                        violate any of these restrictions and may be terminated
                        by ATK at any time. Upon terminating your viewing of
                        these materials or upon the termination of this license,
                        you must destroy any downloaded materials in your
                        possession whether in electronic or printed format.
                      </p>
                    </div>
                  </AnimatedSection>

                  {/* Using accordion for remaining sections to keep page streamlined */}
                  <AnimatedSection delay={0.2} className="mb-16">
                    <h2
                      className="text-3xl font-bold mb-8 playfair"
                      id="restrictions"
                    >
                      <RevealText delay={0.2}>Detailed Terms</RevealText>
                    </h2>

                    <div className="mt-10">
                      <AccordionItem title="Restrictions" index={0}>
                        <div className="prose prose-lg prose-invert">
                          <p>
                            In addition to the restrictions outlined in the Use
                            License section, you further agree not to:
                          </p>
                          <ul className="space-y-2 my-4">
                            <li>
                              Use our services to transmit any malware, spyware,
                              or other malicious code
                            </li>
                            <li>
                              Interfere with or disrupt our services or servers
                            </li>
                            <li>
                              Forge headers or manipulate identifiers to
                              disguise the origin of any content transmitted
                              through our services
                            </li>
                            <li>
                              Collect or track personal information of other
                              users
                            </li>
                            <li>
                              Restrict or inhibit any other user from using our
                              services
                            </li>
                          </ul>
                          <p>
                            ATK reserves the right to monitor usage of its
                            services to ensure compliance with these terms.
                          </p>
                        </div>
                      </AccordionItem>

                      <AccordionItem
                        title="Your Content"
                        index={1}
                        id="content"
                      >
                        <div className="prose prose-lg prose-invert">
                          <p>
                            When you upload, submit, or otherwise make available
                            any content through our services, you grant ATK a
                            worldwide, non-exclusive, royalty-free license to
                            use, reproduce, modify, adapt, publish, translate,
                            distribute, and display such content.
                          </p>
                          <p>
                            You represent and warrant that you own or have the
                            necessary licenses, rights, consents, and
                            permissions to use and authorize ATK to use all
                            intellectual property rights in and to any content
                            that you submit.
                          </p>
                          <p>
                            ATK reserves the right, at its sole discretion, to
                            remove any content that violates these Terms of
                            Service or that it finds objectionable.
                          </p>
                        </div>
                      </AccordionItem>

                      <AccordionItem title="Privacy" index={2} id="privacy">
                        <div className="prose prose-lg prose-invert">
                          <p>
                            Your use of our services is also governed by our
                            Privacy Policy, which outlines how we collect, use,
                            and protect your information. By using our services,
                            you acknowledge that you have read and understood
                            our Privacy Policy.
                          </p>
                          <p>
                            The Privacy Policy explains the data we collect, the
                            purposes for which we collect it, how we use the
                            data, and the choices you have regarding your
                            information.
                          </p>
                          <p>
                            For more information, please review our full Privacy
                            Policy, which is incorporated into these Terms of
                            Service by reference.
                          </p>
                        </div>
                      </AccordionItem>

                      <AccordionItem
                        title="Termination"
                        index={3}
                        id="termination"
                      >
                        <div className="prose prose-lg prose-invert">
                          <p>
                            ATK may terminate or suspend access to our services
                            immediately, without prior notice or liability, for
                            any reason whatsoever, including without limitation
                            if you breach the Terms of Service.
                          </p>
                          <p>
                            All provisions of the Terms of Service which by
                            their nature should survive termination shall
                            survive termination, including, without limitation,
                            ownership provisions, warranty disclaimers,
                            indemnity, and limitations of liability.
                          </p>
                          <p>
                            Upon termination, your right to use the services
                            will immediately cease. If you wish to terminate
                            your account, you may simply discontinue using the
                            services.
                          </p>
                        </div>
                      </AccordionItem>

                      <AccordionItem
                        title="Disclaimer"
                        index={4}
                        id="disclaimer"
                      >
                        <div className="prose prose-lg prose-invert">
                          <p>
                            The materials on ATK&apos;s website are provided on
                            an &apos;as is&apos; basis. ATK makes no warranties,
                            expressed or implied, and hereby disclaims and
                            negates all other warranties including, without
                            limitation, implied warranties or conditions of
                            merchantability, fitness for a particular purpose,
                            or non-infringement of intellectual property or
                            other violation of rights.
                          </p>
                          <p>
                            Further, ATK does not warrant or make any
                            representations concerning the accuracy, likely
                            results, or reliability of the use of the materials
                            on its website or otherwise relating to such
                            materials or on any sites linked to this site.
                          </p>
                        </div>
                      </AccordionItem>

                      <AccordionItem
                        title="Changes to Terms"
                        index={5}
                        id="changes"
                      >
                        <div className="prose prose-lg prose-invert">
                          <p>
                            ATK may revise these terms of service for its
                            website at any time without notice. By using this
                            website you are agreeing to be bound by the then
                            current version of these terms of service.
                          </p>
                          <p>
                            We will make reasonable efforts to notify you of any
                            material changes to these terms, but it is your
                            responsibility to check for updates periodically.
                            Your continued use of the services after any changes
                            constitutes your acceptance of the new Terms of
                            Service.
                          </p>
                        </div>
                      </AccordionItem>
                    </div>
                  </AnimatedSection>

                  {/* Final CTA block */}
                  <AnimatedSection
                    delay={0.3}
                    className="mt-24 p-8 bg-white/5 border border-white/10 relative overflow-hidden"
                  >
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-purple-600/10 to-blue-600/10 rounded-full filter blur-3xl"></div>

                    <h3 className="text-2xl font-bold mb-4 playfair">
                      Have any questions?
                    </h3>
                    <p className="text-white/70 mb-6">
                      If you have any questions about these Terms of Service,
                      please don&apos;t hesitate to contact us.
                    </p>

                    <motion.a
                      href="#contact"
                      className="inline-flex items-center px-6 py-3 bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-colors duration-300"
                      whileHover={{ y: -2 }}
                      whileTap={{ y: 0 }}
                      data-cursor="magnetic"
                    >
                      <span>Contact Us</span>
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
                        className="ml-2"
                      >
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </motion.a>

                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-10 h-10 border-t border-l border-white/20"></div>
                    <div className="absolute top-0 right-0 w-10 h-10 border-t border-r border-white/20"></div>
                    <div className="absolute bottom-0 left-0 w-10 h-10 border-b border-l border-white/20"></div>
                    <div className="absolute bottom-0 right-0 w-10 h-10 border-b border-r border-white/20"></div>
                  </AnimatedSection>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default TermsOfService;
