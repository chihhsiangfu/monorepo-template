"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useEffect, useId } from "react";
import { type FieldValues, useForm } from "react-hook-form";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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

export interface UIFieldConfig<TFieldValues extends FieldValues> {
  name: keyof TFieldValues;
  label: string;
  placeholder?: string;
  readOnly?: boolean;
  type?: "text" | "email" | "password" | "number";
}

export interface FormDialogProps<TFieldValues extends FieldValues> {
  zodSchema: z.ZodType<TFieldValues>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues: TFieldValues;
  onSubmit: (data: TFieldValues) => void;
  isLoading?: boolean;
  title: string;
  uiFields: UIFieldConfig<TFieldValues>[];
}

export function FormDialog<TFieldValues extends FieldValues>({
  zodSchema,
  open,
  onOpenChange,
  defaultValues,
  onSubmit,
  isLoading,
  title,
  uiFields,
}: FormDialogProps<TFieldValues>) {
  const id = useId();

  const form = useForm<TFieldValues>({
    resolver: zodResolver(zodSchema as any),
    // defaultValues,
  });

  useEffect(() => {
    form.reset({
      ...defaultValues,
    });
  }, [defaultValues, form]);

  const handleSubmit = (values: z.infer<typeof zodSchema>) => {
    onSubmit(values);
    form.reset();
    form.clearErrors();
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset();
      form.clearErrors();
    }

    onOpenChange(isOpen);
  };

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="flex flex-col gap-4 py-4">
              {uiFields.map((uiField, index) => (
                <FormField
                  control={form.control}
                  key={`form-${id}-${index}`}
                  name={uiField.name as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{uiField.label}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={uiField.placeholder}
                          {...field}
                          readOnly={uiField.readOnly}
                          type={uiField.type}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              {form.formState.errors.root && (
                <div className="text-red-500 text-sm">
                  {form.formState.errors.root.message}
                </div>
              )}
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button disabled={isLoading} variant="outline">
                  Cancel
                </Button>
              </DialogClose>

              <Button disabled={isLoading} type="submit">
                {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
