"use client";

import UseAnimations from "react-useanimations";
import infinity from "react-useanimations/lib/infinity";

export function Loading() {
  return (
    <div className="flex flex-col justify-center items-center mt-10">
      <UseAnimations strokeColor="#d4d4d8" size={30} animation={infinity} />
    </div>
  );
}
