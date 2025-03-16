"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation"; // Use this instead of direct params
import HotOnesProjectView from "@/components/pages/AtkSocialProjects/HotOnesProjectView";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";

// This would be expanded to load different project components based on the slug
export default function ProjectPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Use the useParams hook to get the params object safely
  const params = useParams();
  // Make sure to convert to string (or provide default) since params values could be string | string[]
  const slug = params?.slug as string;

  useEffect(() => {
    // Simulate loading time or fetch actual project data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // This would check the slug and render the appropriate project component
  const renderProject = () => {
    if (slug === "hot-ones-event") {
      return <HotOnesProjectView />;
    } else {
      // If project not found, redirect to social page
      router.push("/#social");
      return null;
    }
  };

  return (
    <>
      <Cursor />
      <Navbar />
      <main>
        {isLoading ? (
          <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          renderProject()
        )}
      </main>
      <Footer />
    </>
  );
}
