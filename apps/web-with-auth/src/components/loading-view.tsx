"use client";

import type { FC } from "react";

import { cn } from "@/lib/utils";

export const LoadingView: FC<{ className?: string }> = ({
  className = "w-full h-full",
}) => {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="h-12 w-12 animate-spin rounded-full border-gray-900 border-t-2 border-b-2 dark:border-white"></div>
    </div>
  );
};

export const LoadingViewFullSize: FC = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-gray-900 border-t-2 border-b-2 dark:border-white"></div>
    </div>
  );
};

export const LoadingViewScreenSize: FC = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-gray-900 border-t-2 border-b-2 dark:border-white"></div>
    </div>
  );
};
