"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Textarea } from "@/components/ui/textarea";

// Define the schema here
const ConfirmFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  note: z.string().optional(),
});

interface ConfirmProps {
  selectedDateTime: Date;
  cancel: () => void;
  username: string;
}

const Confirm = ({ username, selectedDateTime, cancel }: ConfirmProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof ConfirmFormSchema>>({
    resolver: zodResolver(ConfirmFormSchema),
    defaultValues: {
      name: "",
      email: "",
      note: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof ConfirmFormSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/schedule", {
        username,
        ...values,
        date: selectedDateTime,
      });
      toast({
        title: "Success",
        description: "Your appointment has been scheduled.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule appointment. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">
          <div className="space-y-1">
            <Label htmlFor="name">Name</Label>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="Name"
                      {...field}
                    />
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
                      disabled={isSubmitting}
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
                    <Textarea
                      disabled={isSubmitting}
                      placeholder="Note"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isSubmitting} type="submit">
            {isSubmitting && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Confirm
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
};

export { Confirm };
