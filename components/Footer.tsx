"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black py-16 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 noise-texture opacity-30"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-white/10"></div>

      {/* Vertical design element */}
      <div className="absolute top-0 left-1/4 w-px h-full bg-white/5"></div>
      <div className="absolute top-0 right-1/4 w-px h-full bg-white/5"></div>

      {/* Ambient light effect */}
      <div className="absolute -top-48 -left-48 w-96 h-96 bg-white/5 rounded-full filter blur-3xl opacity-20"></div>
      <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-white/5 rounded-full filter blur-3xl opacity-20"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo and tagline */}
          <div>
            <Link href="#home">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="inline-block"
                data-cursor="magnetic"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 relative mr-3">
                    <Image
                      src="/images/ATKLogoTransparent.png"
                      alt="ATK"
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                </div>
              </motion.div>
            </Link>
            <p className="text-gray-400 mt-6 mb-6">
              Where content creation and game development converge to create
              extraordinary experiences.
            </p>
            <div className="flex space-x-4">
              {/* Social icons with correct SVGs */}
              <a
                href="#"
                className="w-10 h-10 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all duration-300 relative overflow-hidden group"
                data-cursor="magnetic"
              >
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-all duration-300"></div>
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
                  className="relative z-10"
                >
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>

              <a
                href="#"
                className="w-10 h-10 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all duration-300 relative overflow-hidden group"
                data-cursor="magnetic"
              >
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-all duration-300"></div>
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
                  className="relative z-10"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>

              <a
                href="#"
                className="w-10 h-10 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all duration-300 relative overflow-hidden group"
                data-cursor="magnetic"
              >
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-all duration-300"></div>
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
                  className="relative z-10"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>

              <a
                href="#"
                className="w-10 h-10 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all duration-300 relative overflow-hidden group"
                data-cursor="magnetic"
              >
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-all duration-300"></div>
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
                  className="relative z-10"
                >
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Services column */}
          <div>
            <h3 className="text-lg font-bold mb-6 uppercase tracking-wider">
              Services
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#social"
                  className="text-gray-400 hover:text-white transition-colors relative group flex items-center"
                  data-cursor="magnetic"
                >
                  <span className="absolute w-0 h-px bg-white bottom-0 left-0 transition-all duration-300 group-hover:w-full"></span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 mr-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Content Creation
                </a>
              </li>
              <li>
                <a
                  href="#social"
                  className="text-gray-400 hover:text-white transition-colors relative group flex items-center"
                  data-cursor="magnetic"
                >
                  <span className="absolute w-0 h-px bg-white bottom-0 left-0 transition-all duration-300 group-hover:w-full"></span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 mr-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Social Media Strategy
                </a>
              </li>
              <li>
                <a
                  href="#social"
                  className="text-gray-400 hover:text-white transition-colors relative group flex items-center"
                  data-cursor="magnetic"
                >
                  <span className="absolute w-0 h-px bg-white bottom-0 left-0 transition-all duration-300 group-hover:w-full"></span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 mr-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Influencer Marketing
                </a>
              </li>
              <li>
                <a
                  href="#studios"
                  className="text-gray-400 hover:text-white transition-colors relative group flex items-center"
                  data-cursor="magnetic"
                >
                  <span className="absolute w-0 h-px bg-white bottom-0 left-0 transition-all duration-300 group-hover:w-full"></span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 mr-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Game Development
                </a>
              </li>
              <li>
                <a
                  href="#studios"
                  className="text-gray-400 hover:text-white transition-colors relative group flex items-center"
                  data-cursor="magnetic"
                >
                  <span className="absolute w-0 h-px bg-white bottom-0 left-0 transition-all duration-300 group-hover:w-full"></span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 mr-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Interactive Experiences
                </a>
              </li>
            </ul>
          </div>

          {/* Company column */}
          <div>
            <h3 className="text-lg font-bold mb-6 uppercase tracking-wider">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#about"
                  className="text-gray-400 hover:text-white transition-colors relative group flex items-center"
                  data-cursor="magnetic"
                >
                  <span className="absolute w-0 h-px bg-white bottom-0 left-0 transition-all duration-300 group-hover:w-full"></span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 mr-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#team"
                  className="text-gray-400 hover:text-white transition-colors relative group flex items-center"
                  data-cursor="magnetic"
                >
                  <span className="absolute w-0 h-px bg-white bottom-0 left-0 transition-all duration-300 group-hover:w-full"></span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 mr-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Team
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors relative group flex items-center"
                  data-cursor="magnetic"
                >
                  <span className="absolute w-0 h-px bg-white bottom-0 left-0 transition-all duration-300 group-hover:w-full"></span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 mr-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="/privacy-policy"
                  className="text-gray-400 hover:text-white transition-colors relative group flex items-center"
                  data-cursor="magnetic"
                >
                  <span className="absolute w-0 h-px bg-white bottom-0 left-0 transition-all duration-300 group-hover:w-full"></span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 mr-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors relative group flex items-center"
                  data-cursor="magnetic"
                >
                  <span className="absolute w-0 h-px bg-white bottom-0 left-0 transition-all duration-300 group-hover:w-full"></span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 mr-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter column */}
          <div>
            <h3 className="text-lg font-bold mb-6 uppercase tracking-wider">
              Newsletter
            </h3>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter to receive updates and creative
              insights.
            </p>
            <form className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  type="email"
                  placeholder="Your email"
                  className="bg-black/30 w-full px-4 py-3 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-white/20 transition-all duration-300"
                />
              </div>
              <motion.button
                type="submit"
                className="bg-white/5 hover:bg-white/10 text-white px-4 py-3 font-medium transition-all duration-300 border border-white/10 hover:border-white/20"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                data-cursor="magnetic"
              >
                Subscribe
              </motion.button>
            </form>

            {/* Latest Update */}
            <div className="mt-8 bg-white/5 border border-white/10 p-4 hover:border-white/20 transition-all duration-300">
              <h4 className="text-sm font-medium text-white mb-2 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z"
                    clipRule="evenodd"
                  />
                </svg>
                Latest Update
              </h4>
              <p className="text-xs text-gray-400">
                Check out our new game &quot;Project Paradox&quot; - now in
                development!
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 mt-10 pt-10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {currentYear} ATK. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-6">
            <a
              href="/privacy-oolicy"
              className="text-gray-400 hover:text-white transition-colors text-sm relative group"
              data-cursor="magnetic"
            >
              <span className="absolute w-0 h-px bg-white bottom-0 left-0 transition-all duration-300 group-hover:w-full"></span>
              Privacy Policy
            </a>
            <a
              href="/terms-of-service"
              className="text-gray-400 hover:text-white transition-colors text-sm relative group"
              data-cursor="magnetic"
            >
              <span className="absolute w-0 h-px bg-white bottom-0 left-0 transition-all duration-300 group-hover:w-full"></span>
              Terms of Service
            </a>
            <a
              href="cookies"
              className="text-gray-400 hover:text-white transition-colors text-sm relative group"
              data-cursor="magnetic"
            >
              <span className="absolute w-0 h-px bg-white bottom-0 left-0 transition-all duration-300 group-hover:w-full"></span>
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
