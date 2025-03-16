"use client";

import AtkSocial from "@/components/pages/AtkSocial";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function ATKSocialRoute() {
  return (
    <div className="default-cursor-page">
      <Navbar />
      <AtkSocial />
      <Footer />
    </div>
  );
}
