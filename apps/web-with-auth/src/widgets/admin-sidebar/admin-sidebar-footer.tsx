"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import type { FC } from "react";
import { Button } from "@/components/ui/button";
import { SidebarFooter } from "@/components/ui/sidebar";

export const AdminSidebarFooter: FC = () => {
  const router = useRouter();

  return (
    <SidebarFooter>
      <Button className="cursor-pointer" onClick={() => router.push("/")}>
        <ArrowLeft />
        <div>Back to app</div>
      </Button>
    </SidebarFooter>
  );
};
