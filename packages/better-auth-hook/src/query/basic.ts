import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthClient } from "../provider";

////////////////////////////////////////////////////////////////
//
// Authentication
//
////////////////////////////////////////////////////////////////

export const useSignInEmailMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();
  const authClient = useAuthClient();

  return useMutation({
    mutationFn: async (params: {
      email: string;
      password: string;
      callbackURL?: string;
      rememberMe?: boolean;
    }) => {
      const { data, error } = await authClient.signIn.email({
        email: params.email,
        password: params.password,
        callbackURL: params.callbackURL,
        rememberMe: params.rememberMe,
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

      toast.success("Signed in successfully");

      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to sign in:", error);
      toast.error("Failed to sign in");

      options?.onError?.(error);
    },
  });
};

export const useSignInSocialMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();
  const authClient = useAuthClient();

  return useMutation({
    mutationFn: async (params: {
      provider: string;
      callbackURL?: string;
      errorCallbackURL?: string;
      newUserCallbackURL?: string;
      disableRedirect?: boolean;
    }) => {
      const { data, error } = await authClient.signIn.social({
        provider: params.provider,
        callbackURL: params.callbackURL,
        errorCallbackURL: params.errorCallbackURL,
        newUserCallbackURL: params.newUserCallbackURL,
        disableRedirect: params.disableRedirect,
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

      toast.success("Signed in with social account successfully");

      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to sign in with social account:", error);
      toast.error("Failed to sign in with social account");

      options?.onError?.(error);
    },
  });
};

export const useSignUpEmailMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();
  const authClient = useAuthClient();

  return useMutation({
    mutationFn: async (params: {
      email: string;
      password: string;
      name: string;
      image?: string;
      callbackURL?: string;
    }) => {
      const { data, error } = await authClient.signUp.email({
        email: params.email,
        password: params.password,
        name: params.name,
        image: params.image,
        callbackURL: params.callbackURL,
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

      toast.success("Account created successfully");

      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to sign up:", error);
      toast.error("Failed to sign up");

      options?.onError?.(error);
    },
  });
};

export const useSignOutMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();
  const authClient = useAuthClient();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await authClient.signOut({});

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });

      toast.success("Signed out successfully");

      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to sign out:", error);
      toast.error("Failed to sign out");

      options?.onError?.(error);
    },
  });
};

////////////////////////////////////////////////////////////////
//
// Email Verification & Password Reset
//
////////////////////////////////////////////////////////////////

export const useVerifyEmailMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();
  const authClient = useAuthClient();

  return useMutation({
    mutationFn: async (params: { token: string }) => {
      const { data, error } = await authClient.verifyEmail({
        query: {
          token: params.token,
        },
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

      toast.success("Email verified successfully");

      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to verify email:", error);
      toast.error("Failed to verify email");

      options?.onError?.(error);
    },
  });
};

export const useRequestPasswordResetMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const authClient = useAuthClient();

  return useMutation({
    mutationFn: async (params: { email: string; redirectTo?: string }) => {
      const { data, error } = await authClient.requestPasswordReset({
        email: params.email,
        redirectTo: params.redirectTo,
      });

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      toast.success("Password reset email sent");

      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to request password reset:", error);
      toast.error("Failed to request password reset");

      options?.onError?.(error);
    },
  });
};

export const useResetPasswordMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();
  const authClient = useAuthClient();

  return useMutation({
    mutationFn: async (params: { newPassword: string; token: string }) => {
      const { data, error } = await authClient.resetPassword({
        newPassword: params.newPassword,
        token: params.token,
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

      toast.success("Password reset successfully");

      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to reset password:", error);
      toast.error("Failed to reset password");

      options?.onError?.(error);
    },
  });
};

////////////////////////////////////////////////////////////////
//
// User Management
//
////////////////////////////////////////////////////////////////

export const useUpdateUserMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();
  const authClient = useAuthClient();

  return useMutation({
    mutationFn: async (params: { name?: string; image?: string }) => {
      const { data, error } = await authClient.updateUser({
        name: params.name,
        image: params.image,
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

      toast.success("User updated successfully");

      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to update user:", error);
      toast.error("Failed to update user");

      options?.onError?.(error);
    },
  });
};

export const useChangeEmailMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();
  const authClient = useAuthClient();

  return useMutation({
    mutationFn: async (params: { newEmail: string; callbackURL?: string }) => {
      const { data, error } = await authClient.changeEmail({
        newEmail: params.newEmail,
        callbackURL: params.callbackURL,
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

      toast.success("Verification email sent");

      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to change email:", error);
      toast.error("Failed to change email");

      options?.onError?.(error);
    },
  });
};

export const useChangePasswordMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();
  const authClient = useAuthClient();

  return useMutation({
    mutationFn: async (params: {
      newPassword: string;
      currentPassword: string;
      revokeOtherSessions?: boolean;
    }) => {
      const { data, error } = await authClient.changePassword({
        newPassword: params.newPassword,
        currentPassword: params.currentPassword,
        revokeOtherSessions: params.revokeOtherSessions,
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

      toast.success("Password changed successfully");

      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to change password:", error);
      toast.error("Failed to change password");

      options?.onError?.(error);
    },
  });
};

export const useDeleteUserMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();
  const authClient = useAuthClient();

  return useMutation({
    mutationFn: async (params?: {
      password?: string;
      token?: string;
      callbackURL?: string;
    }) => {
      const { data, error } = await authClient.deleteUser({
        password: params?.password,
        token: params?.token,
        callbackURL: params?.callbackURL,
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

      toast.success("User deleted successfully");

      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to delete user:", error);
      toast.error("Failed to delete user");

      options?.onError?.(error);
    },
  });
};

////////////////////////////////////////////////////////////////
//
// Account Management
//
////////////////////////////////////////////////////////////////

export const useListAccountsQuery = () => {
  const authClient = useAuthClient();

  return useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      const { data, error } = await authClient.listAccounts({});

      if (error) {
        throw error;
      }

      return data;
    },
  });
};

export const useUnlinkAccountMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();
  const authClient = useAuthClient();

  return useMutation({
    mutationFn: async (params: { providerId: string; accountId?: string }) => {
      const { data, error } = await authClient.unlinkAccount({
        providerId: params.providerId,
        accountId: params.accountId,
      });

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["accounts"],
      });

      toast.success("Account unlinked successfully");

      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to unlink account:", error);
      toast.error("Failed to unlink account");

      options?.onError?.(error);
    },
  });
};

export const useLinkSocialMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();
  const authClient = useAuthClient();

  return useMutation({
    mutationFn: async (params: {
      provider: string;
      callbackURL?: string;
      scopes?: string[];
      idToken?: {
        token: string;
        accessToken?: string;
        refreshToken?: string;
      };
    }) => {
      const { data, error } = await authClient.linkSocial({
        provider: params.provider,
        callbackURL: params.callbackURL,
        scopes: params.scopes,
        idToken: params.idToken,
      });

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["accounts"],
      });

      toast.success("Social account linked successfully");

      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to link social account:", error);
      toast.error("Failed to link social account");

      options?.onError?.(error);
    },
  });
};

////////////////////////////////////////////////////////////////
//
// Session Management
//
////////////////////////////////////////////////////////////////

export const useListSessionsQuery = () => {
  const authClient = useAuthClient();

  return useQuery({
    queryKey: ["sessions"],
    queryFn: async () => {
      const { data, error } = await authClient.listSessions({});

      if (error) {
        throw error;
      }

      return data;
    },
  });
};

export const useRevokeSessionMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();
  const authClient = useAuthClient();

  return useMutation({
    mutationFn: async (params: { token: string }) => {
      const { data, error } = await authClient.revokeSession({
        token: params.token,
      });

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sessions"],
      });

      toast.success("Session revoked successfully");

      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to revoke session:", error);
      toast.error("Failed to revoke session");

      options?.onError?.(error);
    },
  });
};
