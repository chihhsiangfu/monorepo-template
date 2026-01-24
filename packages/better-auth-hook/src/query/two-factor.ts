import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthClient } from "../provider";

////////////////////////////////////////////////////////////////
//
// Core 2FA Management
//
////////////////////////////////////////////////////////////////

export const useEnableTwoFactorMutation = (options?: {
  onSuccess?: (data: { totpURI: string; backupCodes: string[] }) => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();
  const authClient = useAuthClient();

  return useMutation({
    mutationFn: async (params: { password: string; issuer?: string }) => {
      const { data, error } = await authClient.twoFactor.enable({
        password: params.password,
        issuer: params.issuer,
      });

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });

      toast.success("Two-factor authentication enabled successfully");

      options?.onSuccess?.(data);
    },
    onError: (error) => {
      console.error("Failed to enable two-factor authentication:", error);
      toast.error("Failed to enable two-factor authentication");

      options?.onError?.(error);
    },
  });
};

export const useDisableTwoFactorMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();
  const authClient = useAuthClient();

  return useMutation({
    mutationFn: async (params: { password: string }) => {
      const { data, error } = await authClient.twoFactor.disable({
        password: params.password,
      });

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });

      toast.success("Two-factor authentication disabled successfully");

      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to disable two-factor authentication:", error);
      toast.error("Failed to disable two-factor authentication");

      options?.onError?.(error);
    },
  });
};

////////////////////////////////////////////////////////////////
//
// TOTP Methods
//
////////////////////////////////////////////////////////////////

export const useGetTotpUriMutation = (options?: {
  onSuccess?: (totpURI: string) => void;
  onError?: (error: unknown) => void;
}) => {
  const authClient = useAuthClient();

  return useMutation({
    mutationFn: async (params: { password: string }) => {
      const { data, error } = await authClient.twoFactor.getTotpUri({
        password: params.password,
      });

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      toast.success("TOTP URI generated successfully");

      options?.onSuccess?.(data.totpURI);
    },
    onError: (error) => {
      console.error("Failed to get TOTP URI:", error);
      toast.error("Failed to get TOTP URI");

      options?.onError?.(error);
    },
  });
};

export const useVerifyTotpMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();
  const authClient = useAuthClient();

  return useMutation({
    mutationFn: async (params: { code: string; trustDevice?: boolean }) => {
      const { data, error } = await authClient.twoFactor.verifyTotp({
        code: params.code,
        trustDevice: params.trustDevice,
      });

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });

      toast.success("TOTP verified successfully");

      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to verify TOTP:", error);
      toast.error("Failed to verify TOTP");

      options?.onError?.(error);
    },
  });
};

////////////////////////////////////////////////////////////////
//
// OTP Methods
//
////////////////////////////////////////////////////////////////

export const useSendOtpMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const authClient = useAuthClient();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await authClient.twoFactor.sendOtp({});

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      toast.success("OTP sent successfully");

      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to send OTP:", error);
      toast.error("Failed to send OTP");

      options?.onError?.(error);
    },
  });
};

export const useVerifyOtpMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();
  const authClient = useAuthClient();

  return useMutation({
    mutationFn: async (params: { code: string; trustDevice?: boolean }) => {
      const { data, error } = await authClient.twoFactor.verifyOtp({
        code: params.code,
        trustDevice: params.trustDevice,
      });

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });

      toast.success("OTP verified successfully");

      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to verify OTP:", error);
      toast.error("Failed to verify OTP");

      options?.onError?.(error);
    },
  });
};

////////////////////////////////////////////////////////////////
//
// Backup Codes
//
////////////////////////////////////////////////////////////////

export const useGenerateBackupCodesMutation = (options?: {
  onSuccess?: (backupCodes: string[]) => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();
  const authClient = useAuthClient();

  return useMutation({
    mutationFn: async (params: { password: string }) => {
      const { data, error } = await authClient.twoFactor.generateBackupCodes({
        password: params.password,
      });

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["backup-codes"],
      });

      toast.success("Backup codes generated successfully");

      options?.onSuccess?.(data.backupCodes);
    },
    onError: (error) => {
      console.error("Failed to generate backup codes:", error);
      toast.error("Failed to generate backup codes");

      options?.onError?.(error);
    },
  });
};

export const useVerifyBackupCodeMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();
  const authClient = useAuthClient();

  return useMutation({
    mutationFn: async (params: {
      code: string;
      disableSession?: boolean;
      trustDevice?: boolean;
    }) => {
      const { data, error } = await authClient.twoFactor.verifyBackupCode({
        code: params.code,
        disableSession: params.disableSession,
        trustDevice: params.trustDevice,
      });

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
      queryClient.invalidateQueries({
        queryKey: ["backup-codes"],
      });

      toast.success("Backup code verified successfully");

      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to verify backup code:", error);
      toast.error("Failed to verify backup code");

      options?.onError?.(error);
    },
  });
};
