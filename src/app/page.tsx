"use client";

import { Feature } from "@/components/molecules/feature";
import { Hero } from "@/components/molecules/hero";
import { Navbar } from "@/components/molecules/navbar";
import { Workflow } from "@/components/molecules/workflow";
import { Footer } from "@/components/molecules/footer";
import { Public } from "@/routes/public";
import { useState } from "react";

export default function HomePage() {
  const [isOpen, setIsOpen] = useState(false);
  const handleDiv = () => setIsOpen(false);

  return (
    <div onClick={handleDiv}>
      <Public>
        <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
        <Hero />
        <Feature />
        <Workflow />
        <Footer />
      </Public>
    </div>
  );
}
