// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { toast } from "sonner";
// import { useAuthClient } from "../provider";

// ////////////////////////////////////////////////////////////////
// //
// // Passkey Management
// //
// ////////////////////////////////////////////////////////////////

// export const useListUserPasskeysQuery = () => {
//   const authClient = useAuthClient();

//   return useQuery({
//     queryKey: ["passkeys"],
//     queryFn: async () => {
//       const { data, error } = await authClient.passkey.listUserPasskeys({});

//       if (error) {
//         throw error;
//       }

//       return data;
//     },
//   });
// };

// export const useAddPasskeyMutation = (options?: {
//   onSuccess?: () => void;
//   onError?: (error: unknown) => void;
// }) => {
//   const queryClient = useQueryClient();
//   const authClient = useAuthClient();

//   return useMutation({
//     mutationFn: async (params?: {
//       name?: string;
//       authenticatorAttachment?: "platform" | "cross-platform";
//     }) => {
//       const result = await authClient.passkey.addPasskey({
//         name: params?.name,
//         authenticatorAttachment: params?.authenticatorAttachment,
//       });

//       return result;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: ["passkeys"],
//       });

//       toast.success("Passkey added successfully");

//       options?.onSuccess?.();
//     },
//     onError: (error) => {
//       console.error("Failed to add passkey:", error);
//       toast.error("Failed to add passkey");

//       options?.onError?.(error);
//     },
//   });
// };

// export const useUpdatePasskeyMutation = (options?: {
//   onSuccess?: () => void;
//   onError?: (error: unknown) => void;
// }) => {
//   const queryClient = useQueryClient();
//   const authClient = useAuthClient();

//   return useMutation({
//     mutationFn: async (params: { id: string; name: string }) => {
//       const { data, error } = await authClient.passkey.updatePasskey({
//         id: params.id,
//         name: params.name,
//       });

//       if (error) {
//         throw error;
//       }

//       return data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: ["passkeys"],
//       });

//       toast.success("Passkey updated successfully");

//       options?.onSuccess?.();
//     },
//     onError: (error) => {
//       console.error("Failed to update passkey:", error);
//       toast.error("Failed to update passkey");

//       options?.onError?.(error);
//     },
//   });
// };

// export const useDeletePasskeyMutation = (options?: {
//   onSuccess?: () => void;
//   onError?: (error: unknown) => void;
// }) => {
//   const queryClient = useQueryClient();
//   const authClient = useAuthClient();

//   return useMutation({
//     mutationFn: async (params: { id: string }) => {
//       const { data, error } = await authClient.passkey.deletePasskey({
//         id: params.id,
//       });

//       if (error) {
//         throw error;
//       }

//       return data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: ["passkeys"],
//       });

//       toast.success("Passkey deleted successfully");

//       options?.onSuccess?.();
//     },
//     onError: (error) => {
//       console.error("Failed to delete passkey:", error);
//       toast.error("Failed to delete passkey");

//       options?.onError?.(error);
//     },
//   });
// };

// ////////////////////////////////////////////////////////////////
// //
// // Passkey Authentication
// //
// ////////////////////////////////////////////////////////////////

// export const useSignInWithPasskeyMutation = (options?: {
//   onSuccess?: () => void;
//   onError?: (error: unknown) => void;
// }) => {
//   const queryClient = useQueryClient();
//   const authClient = useAuthClient();

//   return useMutation({
//     mutationFn: async (params?: { autoFill?: boolean }) => {
//       const { data, error } = await authClient.signIn.passkey({
//         autoFill: params?.autoFill,
//       });

//       if (error) {
//         throw error;
//       }

//       return data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: ["user"],
//       });

//       toast.success("Signed in with passkey successfully");

//       options?.onSuccess?.();
//     },
//     onError: (error) => {
//       console.error("Failed to sign in with passkey:", error);
//       toast.error("Failed to sign in with passkey");

//       options?.onError?.(error);
//     },
//   });
// };
