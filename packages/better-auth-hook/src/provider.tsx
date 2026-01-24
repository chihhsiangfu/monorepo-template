import { createContext, type ReactNode, useContext } from "react";
import type { BasicAuthClient, FullAuthClient } from "./types";

export interface BetterAuthContextProps {
  authClient: BasicAuthClient;
  navigateTo: (url: string) => void;
}

export const BetterAuthContext = createContext<BetterAuthContextProps>(
  undefined!,
);

export interface BetterAuthProviderProps {
  authClient: BasicAuthClient;
  navigateTo: (url: string) => void;
  //
  children: ReactNode;
}

export const BetterAuthProvider = ({
  authClient,
  navigateTo,
  //
  children,
}: BetterAuthProviderProps) => {
  return (
    <BetterAuthContext.Provider
      value={{
        authClient,
        navigateTo,
      }}
    >
      {children}
    </BetterAuthContext.Provider>
  );
};

export const useAuthClient = () => {
  const context = useContext(BetterAuthContext);

  if (!context) {
    throw new Error("useAuthClient must be used within a BetterAuthProvider");
  }

  return context.authClient as FullAuthClient;
};

export const useNavigateTo = () => {
  const context = useContext(BetterAuthContext);

  if (!context) {
    throw new Error("useNavigateTo must be used within a BetterAuthProvider");
  }

  return context.navigateTo;
};
