"use client";

import { GlobeIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import type { FC } from "react";
import { Button } from "@/components/ui/button";
import { SidebarFooter } from "@/components/ui/sidebar";

export const AppSidebarFooter: FC = () => {
  const router = useRouter();

  return (
    <SidebarFooter>
      <Button
        className="cursor-pointer"
        onClick={() => router.push("/community")}
      >
        <GlobeIcon />
        <div>Explore Community</div>
      </Button>
    </SidebarFooter>
  );
};
