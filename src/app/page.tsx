"use client";

import { useState } from "react";
import GridMaker from "@/app/components/GridMaker";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <img src="/Logo.png" alt="Logo" className="h-13 w-12" />
        <h1 className="text-4xl font-bold ml-4">Framework</h1>
      </div>

      <GridMaker />
    </div>
  );
}
