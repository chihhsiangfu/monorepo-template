import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthClient } from "../provider";

////////////////////////////////////////////////////////////////
//
// User Management
//
////////////////////////////////////////////////////////////////

export const useListUsersQuery = ({
  searchValue,
  searchField,
  searchOperator,
  limit,
  offset,
  sortBy,
  sortDirection,
  filterField,
  filterValue,
  filterOperator,
}: {
  searchValue?: string;
  searchField?: "name" | "email";
  searchOperator?: "contains" | "starts_with" | "ends_with";
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  filterField?: string;
  filterValue?: string;
  filterOperator?: "contains" | "eq" | "ne" | "lt" | "lte" | "gt" | "gte";
} = {}) => {
  const authClient = useAuthClient();

  return useQuery({
    queryKey: [
      "admin-users",
      searchValue,
      searchField,
      searchOperator,
      limit,
      offset,
      sortBy,
      sortDirection,
      filterField,
      filterValue,
      filterOperator,
    ],
    queryFn: async () => {
      const { data, error } = await authClient.admin.listUsers({
        query: {
          searchValue,
          searchField,
          searchOperator,
          limit,
          offset,
          sortBy,
          sortDirection,
          filterField,
          filterValue,
          filterOperator,
        },
      });

      if (error) {
        throw error;
      }

      return data;
    },
  });
};

export const useCreateUserMutation = (options?: {
  onSuccess?: (userId: string) => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();
  const authClient = useAuthClient();

  return useMutation({
    mutationFn: async (params: {
      email: string;
      password: string;
      name: string;
      role?: "user" | "admin" | ("user" | "admin")[];
      data?: Record<string, unknown>;
    }) => {
      const { data, error } = await authClient.admin.createUser({
        email: params.email,
        password: params.password,
        name: params.name,
        role: params.role,
        data: params.data,
      });

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-users"],
      });

      toast.success("User created successfully");

      options?.onSuccess?.(data.user.id);
    },
    onError: (error) => {
      console.error("Failed to create user:", error);
      toast.error("Failed to create user");

      options?.onError?.(error);
    },
  });
};

export const useUpdateUserMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();
  const authClient = useAuthClient();

  return useMutation({
    mutationFn: async (params: {
      userId: string;
      data: Record<string, unknown>;
    }) => {
      const { data, error } = await authClient.admin.updateUser({
        userId: params.userId,
        data: params.data,
      });

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-users"],
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

export const useRemoveUserMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();
  const authClient = useAuthClient();

  return useMutation({
    mutationFn: async (params: { userId: string }) => {
      const { data, error } = await authClient.admin.removeUser({
        userId: params.userId,
      });

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-users"],
      });

      toast.success("User removed successfully");

      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to remove user:", error);
      toast.error("Failed to remove user");

      options?.onError?.(error);
    },
  });
};

////////////////////////////////////////////////////////////////
//
// Role & Permission Management
//
////////////////////////////////////////////////////////////////

export const useSetRoleMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();
  const authClient = useAuthClient();

  return useMutation({
    mutationFn: async (params: {
      userId: string;
      role: "user" | "admin" | ("user" | "admin")[];
    }) => {
      const { data, error } = await authClient.admin.setRole({
        userId: params.userId,
        role: params.role,
      });

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-users"],
      });

      toast.success("Role updated successfully");

      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to update role:", error);
      toast.error("Failed to update role");

      options?.onError?.(error);
    },
  });
};

export const useHasPermissionQuery = ({
  userId,
  role,
  permission,
}: {
  userId?: string;
  role?: "user" | "admin";
  permission?: {
    readonly user?: (
      | "list"
      | "update"
      | "delete"
      | "get"
      | "create"
      | "set-role"
      | "ban"
      | "impersonate"
      | "set-password"
    )[];
    readonly session?: ("list" | "delete" | "revoke")[];
  };
} = {}) => {
  const authClient = useAuthClient();

  return useQuery({
    queryKey: ["admin-permission", userId, role, permission],
    queryFn: async () => {
      const { data, error } = await authClient.admin.hasPermission({
        userId,
        role,
        permission,
      });

      if (error) {
        throw error;
      }

      return data;
    },
    enabled: Boolean(userId || role || permission),
  });
};

////////////////////////////////////////////////////////////////
//
// Password Management
//
////////////////////////////////////////////////////////////////

export const useSetUserPasswordMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();
  const authClient = useAuthClient();

  return useMutation({
    mutationFn: async (params: { userId: string; newPassword: string }) => {
      const { data, error } = await authClient.admin.setUserPassword({
        userId: params.userId,
        newPassword: params.newPassword,
      });

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-users"],
      });

      toast.success("Password updated successfully");

      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to update password:", error);
      toast.error("Failed to update password");

      options?.onError?.(error);
    },
  });
};

////////////////////////////////////////////////////////////////
//
// User Restrictions
//
////////////////////////////////////////////////////////////////

export const useBanUserMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();
  const authClient = useAuthClient();

  return useMutation({
    mutationFn: async (params: {
      userId: string;
      banReason?: string;
      banExpiresIn?: number;
    }) => {
      const { data, error } = await authClient.admin.banUser({
        userId: params.userId,
        banReason: params.banReason,
        banExpiresIn: params.banExpiresIn,
      });

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-users"],
      });

      toast.success("User banned successfully");

      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to ban user:", error);
      toast.error("Failed to ban user");

      options?.onError?.(error);
    },
  });
};

export const useUnbanUserMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();
  const authClient = useAuthClient();

  return useMutation({
    mutationFn: async (params: { userId: string }) => {
      const { data, error } = await authClient.admin.unbanUser({
        userId: params.userId,
      });

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-users"],
      });

      toast.success("User unbanned successfully");

      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to unban user:", error);
      toast.error("Failed to unban user");

      options?.onError?.(error);
    },
  });
};

////////////////////////////////////////////////////////////////
//
// Session Management
//
////////////////////////////////////////////////////////////////

export const useListUserSessionsQuery = ({ userId }: { userId: string }) => {
  const authClient = useAuthClient();

  return useQuery({
    queryKey: ["admin-user-sessions", userId],
    queryFn: async () => {
      const { data, error } = await authClient.admin.listUserSessions({
        userId,
      });

      if (error) {
        throw error;
      }

      return data;
    },
    enabled: Boolean(userId),
  });
};

export const useRevokeUserSessionMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();
  const authClient = useAuthClient();

  return useMutation({
    mutationFn: async (params: { sessionToken: string }) => {
      const { data, error } = await authClient.admin.revokeUserSession({
        sessionToken: params.sessionToken,
      });

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-user-sessions"],
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

export const useRevokeUserSessionsMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();
  const authClient = useAuthClient();

  return useMutation({
    mutationFn: async (params: { userId: string }) => {
      const { data, error } = await authClient.admin.revokeUserSessions({
        userId: params.userId,
      });

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-user-sessions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin-users"],
      });

      toast.success("All user sessions revoked successfully");

      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to revoke user sessions:", error);
      toast.error("Failed to revoke user sessions");

      options?.onError?.(error);
    },
  });
};

////////////////////////////////////////////////////////////////
//
// Impersonation
//
////////////////////////////////////////////////////////////////

export const useImpersonateUserMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();
  const authClient = useAuthClient();

  return useMutation({
    mutationFn: async (params: { userId: string }) => {
      const { data, error } = await authClient.admin.impersonateUser({
        userId: params.userId,
      });

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-users"],
      });

      toast.success("User impersonation started");

      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to impersonate user:", error);
      toast.error("Failed to impersonate user");

      options?.onError?.(error);
    },
  });
};

export const useStopImpersonatingMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();
  const authClient = useAuthClient();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await authClient.admin.stopImpersonating({});

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-users"],
      });

      toast.success("Impersonation stopped");

      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to stop impersonation:", error);
      toast.error("Failed to stop impersonation");

      options?.onError?.(error);
    },
  });
};
