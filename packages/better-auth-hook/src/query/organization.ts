import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthClient } from "../provider";

////////////////////////////////////////////////////////////////
//
// Organizations
//
////////////////////////////////////////////////////////////////

export const useListOrganizationsQuery = () => {
  const authClient = useAuthClient();

  return useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const { data, error } = await authClient.organization.list({});

      if (error) {
        throw error;
      }

      return data;
    },
  });
};

export const useCreateOrganizationMutation = (options?: {
  onSuccess?: (organizationId: string) => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();
  const authClient = useAuthClient();

  return useMutation({
    mutationFn: async (params: {
      name: string;
      slug?: string;
      logo?: string;
    }) => {
      const { data, error } = await authClient.organization.create({
        name: params.name,
        slug: params.slug ?? crypto.randomUUID(),
        logo: params.logo,
      });

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["organizations"],
      });

      toast.success("Organization created successfully");

      options?.onSuccess?.(data.id);
    },
    onError: (error) => {
      console.error("Failed to create organization:", error);
      toast.error("Failed to create organization");

      options?.onError?.(error);
    },
  });
};

export const useUpdateOrganizationMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();
  const authClient = useAuthClient();

  return useMutation({
    mutationFn: async (params: {
      organizationId: string;
      name: string;
      slug?: string;
      logo?: string;
    }) => {
      const { data, error } = await authClient.organization.update({
        data: {
          name: params.name,
          slug: params.slug,
          logo: params.logo,
        },
        organizationId: params.organizationId,
      });

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organizations"],
      });

      toast.success("Organization updated successfully");

      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to update organization:", error);
      toast.error("Failed to update organization");

      options?.onError?.(error);
    },
  });
};

export const useDeleteOrganizationMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();
  const authClient = useAuthClient();

  return useMutation({
    mutationFn: async (params: { organizationId: string }) => {
      const { data, error } = await authClient.organization.delete({
        organizationId: params.organizationId,
      });

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organizations"],
      });

      toast.success("Organization deleted successfully");

      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to delete organization:", error);
      toast.error("Failed to delete organization");

      options?.onError?.(error);
    },
  });
};

export const useLeaveOrganizationMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();
  const authClient = useAuthClient();

  return useMutation({
    mutationFn: async (params: { organizationId: string }) => {
      const { data, error } = await authClient.organization.leave({
        organizationId: params.organizationId,
      });

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organizations"],
      });

      toast.success("Left organization successfully");

      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to leave organization:", error);
      toast.error("Failed to leave organization");

      options?.onError?.(error);
    },
  });
};

////////////////////////////////////////////////////////////////
//
// Organization Members
//
////////////////////////////////////////////////////////////////

export const useListOrganizationMembersQuery = () => {
  const authClient = useAuthClient();

  return useQuery({
    queryKey: ["organization-members"],
    queryFn: async () => {
      const { data, error } = await authClient.organization.listMembers({});

      if (error) {
        throw error;
      }

      return data;
    },
  });
};

export const useUpdateOrganizationMemberRoleMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();
  const authClient = useAuthClient();

  return useMutation({
    mutationFn: async (params: {
      memberId: string;
      role: "member" | "admin" | "owner";
    }) => {
      const { data, error } = await authClient.organization.updateMemberRole({
        memberId: params.memberId,
        role: params.role,
      });

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organization-members"],
      });

      toast.success("Organization member role updated successfully");

      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to update member role:", error);
      toast.error("Failed to update member role");

      options?.onError?.(error);
    },
  });
};

export const useRemoveOrganizationMemberMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();
  const authClient = useAuthClient();

  return useMutation({
    mutationFn: async (params: {
      memberId: string;
      organizationId: string;
    }) => {
      const { data, error } = await authClient.organization.removeMember({
        memberIdOrEmail: params.memberId,
        organizationId: params.organizationId,
      });

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organization-members"],
      });

      toast.success("Member removed successfully");

      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to remove member:", error);
      toast.error("Failed to remove member");

      options?.onError?.(error);
    },
  });
};

////////////////////////////////////////////////////////////////
//
// Organization Invitations
//
////////////////////////////////////////////////////////////////

export const useListOrganizationInvitationsQuery = () => {
  const authClient = useAuthClient();

  return useQuery({
    queryKey: ["organization-invitations"],
    queryFn: async () => {
      const { data, error } = await authClient.organization.listInvitations({});

      if (error) {
        throw error;
      }

      return data;
    },
  });
};

export const useInviteOrganizationMemberMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();
  const authClient = useAuthClient();

  return useMutation({
    mutationFn: async (params: {
      email: string;
      role: "member" | "admin" | "owner";
    }) => {
      const { data, error } = await authClient.organization.inviteMember({
        email: params.email,
        role: params.role,
      });

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organization-invitations"],
      });

      toast.success("Invitation sent successfully");

      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to send invitation:", error);
      toast.error("Failed to send invitation");

      options?.onError?.(error);
    },
  });
};

export const useAcceptOrganizationInvitationMutation = (options?: {
  onSuccess?: (data: {
    invitation: {
      id: string;
      email: string;
      status: "pending" | "accepted" | "rejected" | "canceled";
      expiresAt: Date;
      organizationId: string;
      role: string;
      inviterId: string;
    };
    member: {
      id: string;
      createdAt: Date;
      userId: string;
      organizationId: string;
      role: string;
    };
  }) => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();
  const authClient = useAuthClient();

  return useMutation({
    mutationFn: async (params: { invitationId: string }) => {
      const { data, error } = await authClient.organization.acceptInvitation({
        invitationId: params.invitationId,
      });

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["organization-invitations"],
      });

      toast.success("Invitation accepted successfully");

      options?.onSuccess?.(data);
    },
    onError: (error) => {
      console.error("Failed to accept invitation:", error);
      toast.error("Failed to accept invitation");

      options?.onError?.(error);
    },
  });
};

export const useCancelOrganizationInvitationMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();
  const authClient = useAuthClient();

  return useMutation({
    mutationFn: async (params: { invitationId: string }) => {
      const { data, error } = await authClient.organization.cancelInvitation({
        invitationId: params.invitationId,
      });

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organization-invitations"],
      });

      toast.success("Invitation cancelled successfully");

      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to cancel invitation:", error);
      toast.error("Failed to cancel invitation");

      options?.onError?.(error);
    },
  });
};

export const useRejectOrganizationInvitationMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();
  const authClient = useAuthClient();

  return useMutation({
    mutationFn: async (params: { invitationId: string }) => {
      const { data, error } = await authClient.organization.rejectInvitation({
        invitationId: params.invitationId,
      });

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organization-invitations"],
      });

      toast.success("Invitation rejected successfully");

      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to reject invitation:", error);
      toast.error("Failed to reject invitation");

      options?.onError?.(error);
    },
  });
};
