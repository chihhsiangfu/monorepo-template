import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthClient } from "../provider";

////////////////////////////////////////////////////////////////
//
// API Keys
//
////////////////////////////////////////////////////////////////

export const useListApiKeysQuery = () => {
  const authClient = useAuthClient();

  return useQuery({
    queryKey: ["api-keys"],
    queryFn: async () => {
      const { data, error } = await authClient.apiKey.list({});

      if (error) {
        throw error;
      }

      return data;
    },
  });
};

export const useGetApiKeyQuery = ({ id }: { id: string }) => {
  const authClient = useAuthClient();

  return useQuery({
    queryKey: ["api-key", id],
    queryFn: async () => {
      const { data, error } = await authClient.apiKey.get({
        query: {
          id,
        },
      });

      if (error) {
        throw error;
      }

      return data;
    },
    enabled: Boolean(id),
  });
};

export const useCreateApiKeyMutation = (options?: {
  onSuccess?: (apiKey: { id: string; key: string }) => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();
  const authClient = useAuthClient();

  return useMutation({
    mutationFn: async (params: {
      name?: string;
      expiresIn?: number;
      userId?: string;
      prefix?: string;
      remaining?: number;
      metadata?: Record<string, unknown>;
    }) => {
      const { data, error } = await authClient.apiKey.create({
        name: params.name,
        expiresIn: params.expiresIn,
        userId: params.userId,
        prefix: params.prefix,
        remaining: params.remaining,
        metadata: params.metadata,
      });

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["api-keys"],
      });

      toast.success("API key created successfully");

      options?.onSuccess?.({ id: data.id, key: data.key });
    },
    onError: (error) => {
      console.error("Failed to create API key:", error);
      toast.error("Failed to create API key");

      options?.onError?.(error);
    },
  });
};

export const useUpdateApiKeyMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();
  const authClient = useAuthClient();

  return useMutation({
    mutationFn: async (params: {
      keyId: string;
      userId?: string;
      name?: string;
      enabled?: boolean;
      remaining?: number;
      refillAmount?: number;
      refillInterval?: number;
      metadata?: Record<string, unknown>;
    }) => {
      const { data, error } = await authClient.apiKey.update({
        keyId: params.keyId,
        userId: params.userId,
        name: params.name,
        enabled: params.enabled,
        remaining: params.remaining,
        refillAmount: params.refillAmount,
        refillInterval: params.refillInterval,
        metadata: params.metadata,
      });

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["api-keys"],
      });

      toast.success("API key updated successfully");

      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to update API key:", error);
      toast.error("Failed to update API key");

      options?.onError?.(error);
    },
  });
};

export const useDeleteApiKeyMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();
  const authClient = useAuthClient();

  return useMutation({
    mutationFn: async (params: { keyId: string }) => {
      const { data, error } = await authClient.apiKey.delete({
        keyId: params.keyId,
      });

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["api-keys"],
      });

      toast.success("API key deleted successfully");

      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to delete API key:", error);
      toast.error("Failed to delete API key");

      options?.onError?.(error);
    },
  });
};
