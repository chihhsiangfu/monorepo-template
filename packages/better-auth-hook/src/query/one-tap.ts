import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthClient } from "../provider";

////////////////////////////////////////////////////////////////
//
// Google One Tap Authentication
//
////////////////////////////////////////////////////////////////

export const useOneTapMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
  onPromptNotification?: (notification: {
    isDisplayed: boolean;
    isNotDisplayed: boolean;
    isSkippedMoment: boolean;
    isDismissedMoment: boolean;
    dismissedReason?: string;
  }) => void;
}) => {
  const queryClient = useQueryClient();
  const authClient = useAuthClient();

  return useMutation({
    mutationFn: async (params?: { callbackURL?: string }) => {
      await authClient.oneTap({
        fetchOptions: {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["user"],
            });

            toast.success("Signed in with Google One Tap successfully");
            options?.onSuccess?.();
          },
        },
        callbackURL: params?.callbackURL,
        onPromptNotification: options?.onPromptNotification,
      });

      return { success: true };
    },
    onError: (error) => {
      console.error("Failed to sign in with Google One Tap:", error);
      toast.error("Failed to sign in with Google One Tap");

      options?.onError?.(error);
    },
  });
};
