"use server";

import * as z from "zod";

import { RegisterSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/data/user";
import prisma from "@/lib/prisma";
import { postSigninRedirect } from "@/routes";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);
  if (!validatedFields.success) {
    return {
      error: {
        title: "Invalid fields",
        description:
          "The provided fields did not pass validation. Please review and correct any errors.",
      },
    };
  }
  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return {
      error: {
        title: "Email already in use",
        description:
          "The email address provided is already associated with an existing account. Please use a different email address or try logging in.",
      },
    };
  }
  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: postSigninRedirect,
    });
  } catch (error: any) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            error: {
              title: "Invalid email or password",
              description:
                "The email or password provided is incorrect. Please double-check your email and password and try again.",
            },
          };
        default:
          return {
            error: {
              title: "Something went wrong",
              description:
                "An unexpected error occurred. Please try again later.",
            },
          };
      }
    }
    throw error;
  }
};
