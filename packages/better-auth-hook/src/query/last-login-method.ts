import { useCallback, useEffect, useState } from "react";
import { useAuthClient } from "../provider";

////////////////////////////////////////////////////////////////
//
// Last Login Method Utilities
//
////////////////////////////////////////////////////////////////

/**
 * Hook to get the last used login method
 * @returns The last used login method (e.g., "google", "email", "github")
 */
export const useLastUsedLoginMethod = () => {
  const authClient = useAuthClient();
  const [lastMethod, setLastMethod] = useState<string | null>(null);

  useEffect(() => {
    const method = authClient.getLastUsedLoginMethod();
    setLastMethod(method);
  }, [authClient]);

  return lastMethod;
};

/**
 * Hook to check if a specific method was last used
 * @param method - The method to check
 * @returns Boolean indicating if the method was last used
 */
export const useIsLastUsedLoginMethod = (method: string) => {
  const authClient = useAuthClient();
  const [isLastUsed, setIsLastUsed] = useState<boolean>(false);

  useEffect(() => {
    const result = authClient.isLastUsedLoginMethod(method);
    setIsLastUsed(result);
  }, [authClient, method]);

  return isLastUsed;
};

/**
 * Hook to clear the stored last login method
 * @returns A function to clear the last login method
 */
export const useClearLastUsedLoginMethod = () => {
  const authClient = useAuthClient();
  const [lastMethod, setLastMethod] = useState<string | null>(null);

  // 初始化時獲取當前的 last method
  useEffect(() => {
    const method = authClient.getLastUsedLoginMethod();
    setLastMethod(method);
  }, [authClient]);

  const clearLastMethod = useCallback(() => {
    authClient.clearLastUsedLoginMethod();
    setLastMethod(null);
  }, [authClient]);

  return {
    lastMethod,
    clearLastMethod,
  };
};

/**
 * Combined hook that provides all last login method utilities
 * @returns Object with all utility functions and the current last method
 */
export const useLastLoginMethod = () => {
  const authClient = useAuthClient();
  const [lastMethod, setLastMethod] = useState<string | null>(null);

  useEffect(() => {
    const method = authClient.getLastUsedLoginMethod();
    setLastMethod(method);
  }, [authClient]);

  const isLastUsedMethod = useCallback(
    (method: string) => {
      return authClient.isLastUsedLoginMethod(method);
    },
    [authClient],
  );

  const clearLastMethod = useCallback(() => {
    authClient.clearLastUsedLoginMethod();
    setLastMethod(null);
  }, [authClient]);

  return {
    lastMethod,
    isLastUsedMethod,
    clearLastMethod,
  };
};
