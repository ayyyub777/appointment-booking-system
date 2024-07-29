import * as z from "zod";

export const EmailSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const ResetPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum of 6 characters required",
  }),
  confirmPassword: z.string().min(6, {
    message: "Minimum of 6 characters required",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

export const RegisterSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
});

export const workingHoursBodySchema = z.object({
  intervals: z.array(
    z.object({
      weekDay: z.number().int().min(0).max(6),
      startTimeInMinutes: z.number().int().min(0).max(1439),
      endTimeInMinutes: z.number().int().min(0).max(1439),
    })
  ),
});

export const ConfirmFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: "O nome precisa de no mínimo 3 caracteres!" }),
  email: z.string().email({ message: "Digite um email válido!" }),
  note: z.string().nullable(),
});
