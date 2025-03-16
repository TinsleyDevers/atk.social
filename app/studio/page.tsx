"use client";

import AtkStudios from "@/components/pages/AtkStudios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ATKStudiosRoute() {
  return (
    <div className="default-cursor-page">
      <Navbar />
      <AtkStudios />
      <Footer />
    </div>
  );
}
