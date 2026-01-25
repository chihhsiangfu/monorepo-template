"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  useAuthClient,
  useChangePasswordMutation,
  useDeleteUserMutation,
  useNavigateTo,
  useUpdateUserMutation,
} from "@repo/better-auth-hook";
import { Camera, Eye, EyeOff, Trash2, User } from "lucide-react";
import type { FC } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  image: z.string().refine((val) => val === "" || /^https?:\/\/.+/.test(val), {
    message: "Please enter a valid URL",
  }),
});

const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long"),
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export const AccountSettingsCard: FC = () => {
  const authClient = useAuthClient();
  const navigateTo = useNavigateTo();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const { mutate: updateUser, isPending: isUpdatingProfile } =
    useUpdateUserMutation();
  const { mutate: changePassword, isPending: isChangingPassword } =
    useChangePasswordMutation();
  const { mutate: deleteUser, isPending: isDeletingUser } =
    useDeleteUserMutation();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? "",
      image: user?.image ?? "",
    },
    values: {
      name: user?.name ?? "",
      image: user?.image ?? "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onProfileSubmit = (values: ProfileFormValues) => {
    updateUser({
      name: values.name,
      image: values.image || undefined,
    });
  };

  const onPasswordSubmit = (values: PasswordFormValues) => {
    changePassword(
      {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        revokeOtherSessions: true,
      },
      {
        onSuccess: () => {
          passwordForm.reset();
        },
      },
    );
  };

  const handleDeleteAccount = () => {
    deleteUser(undefined, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        navigateTo("/sign-in");
      },
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-semibold text-2xl tracking-tight">
          Account Settings
        </h1>
        <p className="text-muted-foreground text-sm">
          Manage your account settings and preferences
        </p>
      </div>

      <Separator />

      {/* Profile Section */}
      <div className="space-y-6">
        <div>
          <h2 className="font-medium text-lg">Profile</h2>
          <p className="text-muted-foreground text-sm">
            Update your profile information
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Avatar className="size-20">
            {user?.image ? (
              <AvatarImage alt={user.name} src={user.image} />
            ) : null}
            <AvatarFallback className="bg-muted text-2xl">
              {user?.name?.[0] ?? <User className="size-8" />}
            </AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <p className="font-medium">{user?.name}</p>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <Form {...profileForm}>
          <form
            className="space-y-4"
            onSubmit={profileForm.handleSubmit(onProfileSubmit)}
          >
            <FormField
              control={profileForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={profileForm.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar URL</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="https://example.com/avatar.jpg"
                        {...field}
                      />
                      <Camera className="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={isUpdatingProfile} type="submit">
              {isUpdatingProfile ? "Saving..." : "Save changes"}
            </Button>
          </form>
        </Form>
      </div>

      <Separator />

      {/* Password Section */}
      <div className="space-y-6">
        <div>
          <h2 className="font-medium text-lg">Change Password</h2>
          <p className="text-muted-foreground text-sm">
            Update your password to keep your account secure
          </p>
        </div>

        <Form {...passwordForm}>
          <form
            className="space-y-4"
            onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
          >
            <FormField
              control={passwordForm.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Enter current password"
                        type={showCurrentPassword ? "text" : "password"}
                        {...field}
                      />
                      <Button
                        className="absolute top-1/2 right-0 -translate-y-1/2"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        size="icon"
                        type="button"
                        variant="ghost"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={passwordForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Enter new password"
                        type={showNewPassword ? "text" : "password"}
                        {...field}
                      />
                      <Button
                        className="absolute top-1/2 right-0 -translate-y-1/2"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        size="icon"
                        type="button"
                        variant="ghost"
                      >
                        {showNewPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={passwordForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Confirm new password"
                        type={showConfirmPassword ? "text" : "password"}
                        {...field}
                      />
                      <Button
                        className="absolute top-1/2 right-0 -translate-y-1/2"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        size="icon"
                        type="button"
                        variant="ghost"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={isChangingPassword} type="submit">
              {isChangingPassword ? "Changing password..." : "Change password"}
            </Button>
          </form>
        </Form>
      </div>

      <Separator />

      {/* Danger Zone */}
      <div className="space-y-6">
        <div>
          <h2 className="font-medium text-destructive text-lg">Danger Zone</h2>
          <p className="text-muted-foreground text-sm">
            Irreversible and destructive actions
          </p>
        </div>

        <div className="rounded-lg border border-destructive/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Delete Account</p>
              <p className="text-muted-foreground text-sm">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Dialog onOpenChange={setDeleteDialogOpen} open={deleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 size-4" />
                  Delete Account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove all your data from our servers.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    onClick={() => setDeleteDialogOpen(false)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={isDeletingUser}
                    onClick={handleDeleteAccount}
                    variant="destructive"
                  >
                    {isDeletingUser ? "Deleting..." : "Delete Account"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};
