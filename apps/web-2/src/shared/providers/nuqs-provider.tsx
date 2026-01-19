"use client";

import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { ComponentProps, FC } from "react";

export const NuqsProvider: FC<ComponentProps<typeof NuqsAdapter>> = ({
  children,
  ...props
}) => {
  return <NuqsAdapter {...props}>{children}</NuqsAdapter>;
};
