"use client";

import { Navbar } from "@/components/ui/navbar";
import { Public } from "@/routes/public";

export default function HomePage() {
  return (
    <Public>
      <Navbar />
    </Public>
  );
}
