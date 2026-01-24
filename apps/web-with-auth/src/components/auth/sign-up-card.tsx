"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigateTo, useSignUpEmailMutation } from "@repo/better-auth-hook";
import type { FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export const SignUpCard: FC = () => {
  const navigateTo = useNavigateTo();
  const { mutate: signUpEmail, isPending } = useSignUpEmailMutation();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: SignUpFormValues) => {
    signUpEmail(values, {
      onSuccess: () => {
        navigateTo("/");
      },
      onError: () => {
        // TODO: handle error
      },
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="font-bold text-2xl">Sign Up</h1>

      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Please enter your name"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Please enter your email"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Please enter your password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-full" disabled={isPending} type="submit">
            {isPending ? "Signing up..." : "Sign Up"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
