"use client";

import { cn } from "@/lib/utils";
import UseAnimations from "react-useanimations";
import infinity from "react-useanimations/lib/infinity";

export function Loading({
  size,
  className,
}: {
  size: number;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col justify-center items-center", className)}>
      <UseAnimations strokeColor="#d4d4d8" size={size} animation={infinity} />
    </div>
  );
}
