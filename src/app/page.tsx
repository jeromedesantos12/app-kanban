"use client";

import { Feature } from "@/components/molecules/feature";
import { Hero } from "@/components/molecules/hero";
import { Navbar } from "@/components/molecules/navbar";
import { Workflow } from "@/components/molecules/workflow";
import { Testimonial } from "@/components/molecules/testimonial";
import { Footer } from "@/components/molecules/footer";
import { Public } from "@/routes/public";

export default function HomePage() {
  return (
    <Public>
      <Navbar />
      <Hero />
      <Workflow />
      <Feature />
      <Testimonial />
      <Footer />
    </Public>
  );
}
