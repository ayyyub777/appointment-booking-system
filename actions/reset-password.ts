"use server";

import * as z from "zod";

import { ResetPasswordSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export const resetPassword = async (
  values: z.infer<typeof ResetPasswordSchema>,
  token?: string | null
) => {
  if (!token) {
    return {
      error: {
        title: "Missing token",
        description:
          "The token required to reset your password is missing. Please request a new password reset link.",
      },
    };
  }
  const validatedFields = ResetPasswordSchema.safeParse(values);
  if (!validatedFields.success) {
    return {
      error: {
        title: "Invalid password",
        description:
          "The password provided does not meet the requirements. Please try again.",
      },
    };
  }
  const { password, confirmPassword } = validatedFields.data;
  if (password !== confirmPassword) {
    return {
      error: {
        title: "Password mismatch",
        description: "The password and confirm password fields do not match.",
      },
    };
  }
  const existingToken = await getPasswordResetTokenByToken(token);
  if (!existingToken) {
    return {
      error: {
        title: "Invalid token",
        description:
          "The token provided is invalid or has expired. Please request a new password reset link.",
      },
    };
  }
  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return {
      error: {
        title: "Token has expired",
        description:
          "The password reset token has expired. Please request a new password reset link.",
      },
    };
  }
  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return {
      error: {
        title: "User not found",
        description:
          "The requested user was not found in the system. Please verify the provided information or register for a new account.",
      },
    };
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword },
  });
  await prisma.passwordResetToken.delete({
    where: { id: existingToken.id },
  });
  redirect("/signin");
};
