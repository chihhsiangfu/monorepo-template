export {
  BetterAuthProvider,
  useAuthClient,
  useNavigateTo,
} from "./provider";

////////////////////////////////////////////////////////////////
//
// Query Hooks
//
////////////////////////////////////////////////////////////////

// Admin
export {
  useBanUserMutation,
  useCreateUserMutation as useAdminCreateUserMutation,
  useHasPermissionQuery,
  useImpersonateUserMutation,
  useListUserSessionsQuery,
  useListUsersQuery,
  useRemoveUserMutation,
  useRevokeUserSessionMutation,
  useRevokeUserSessionsMutation,
  useSetRoleMutation,
  useSetUserPasswordMutation,
  useStopImpersonatingMutation,
  useUnbanUserMutation,
  useUpdateUserMutation as useAdminUpdateUserMutation,
} from "./query/admin";

// API Key
export {
  useCreateApiKeyMutation,
  useDeleteApiKeyMutation,
  useGetApiKeyQuery,
  useListApiKeysQuery,
  useUpdateApiKeyMutation,
} from "./query/api-key";

// Basic
export {
  useChangeEmailMutation,
  useChangePasswordMutation,
  useDeleteUserMutation,
  useLinkSocialMutation,
  useListAccountsQuery,
  useListSessionsQuery,
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
  useRevokeSessionMutation,
  useSignInEmailMutation,
  useSignInSocialMutation,
  useSignOutMutation,
  useSignUpEmailMutation,
  useUnlinkAccountMutation,
  useUpdateUserMutation,
  useVerifyEmailMutation,
} from "./query/basic";

// Last Login Method
export {
  useClearLastUsedLoginMethod,
  useIsLastUsedLoginMethod,
  useLastLoginMethod,
  useLastUsedLoginMethod,
} from "./query/last-login-method";

// One Tap
export { useOneTapMutation } from "./query/one-tap";

// Organization
export {
  useAcceptOrganizationInvitationMutation,
  useCancelOrganizationInvitationMutation,
  useCreateOrganizationMutation,
  useDeleteOrganizationMutation,
  useInviteOrganizationMemberMutation,
  useLeaveOrganizationMutation,
  useListOrganizationInvitationsQuery,
  useListOrganizationMembersQuery,
  useListOrganizationsQuery,
  useRejectOrganizationInvitationMutation,
  useRemoveOrganizationMemberMutation,
  useUpdateOrganizationMemberRoleMutation,
  useUpdateOrganizationMutation,
} from "./query/organization";

// Passkey
// export {
//   useAddPasskeyMutation,
//   useDeletePasskeyMutation,
//   useListUserPasskeysQuery,
//   useSignInWithPasskeyMutation,
//   useUpdatePasskeyMutation,
// } from "./query/pass-key";

// Two Factor
export {
  useDisableTwoFactorMutation,
  useEnableTwoFactorMutation,
  useGenerateBackupCodesMutation,
  useGetTotpUriMutation,
  useSendOtpMutation,
  useVerifyBackupCodeMutation,
  useVerifyOtpMutation,
  useVerifyTotpMutation,
} from "./query/two-factor";
