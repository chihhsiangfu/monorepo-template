"use client";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="container mx-auto py-10">
      <Button onClick={() => console.log("Hello")}>Button</Button>
    </div>
  );
}
