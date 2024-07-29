"use client";

import { z } from "zod";
import { useState, useTransition } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StatusResponseDataType, StatusResponseType } from "@/types";
import { ConfirmFormSchema } from "@/schemas";
import { schedule } from "@/actions/schedule";
import { toast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Textarea } from "@/components/ui/textarea";

interface ConfirmProps {
  selectedDateTime: Date;
  cancel: () => void;
}

const Confirm = ({ selectedDateTime, cancel }: ConfirmProps) => {
  const [success, setSuccess] = useState<StatusResponseDataType>();
  const [error, setError] = useState<StatusResponseDataType>();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ConfirmFormSchema>>({
    resolver: zodResolver(ConfirmFormSchema),
    defaultValues: {
      name: "",
      email: "",
      note: "",
    },
  });

  const onSubmit = (values: z.infer<typeof ConfirmFormSchema>) => {
    startTransition(() => {
      schedule({ ...values, date: selectedDateTime }).then(
        (data?: StatusResponseType) => {
          setError(data?.error);
          setSuccess(data?.success);
        }
      );
    });

    if (error) {
      toast(error);
    }

    if (success) {
      toast(success);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input disabled={isPending} placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder="example@domain.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="note">Note</Label>
          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  {/* @ts-ignore */}
                  <Textarea
                    disabled={isPending}
                    placeholder="Note"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button disabled={isPending}>
          {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Confirm
        </Button>
      </form>
    </FormProvider>
  );
};

export { Confirm };
