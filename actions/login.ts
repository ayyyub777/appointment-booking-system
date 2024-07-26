"use server";

import * as z from "zod";

import { AuthError } from "next-auth";
import { LoginSchema } from "@/schemas";
import { compare } from "bcryptjs";
import { getUserByEmail } from "@/data/user";
import { postSigninRedirect } from "@/routes";
import { signIn } from "@/auth";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    return {
      error: {
        title: "Invalid fields",
        description:
          "The provided fields did not pass validation. Please review and correct any errors.",
      },
    };
  }
  const { email, password } = validatedFields.data;
  const existingUser = await getUserByEmail(email);
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return {
      error: {
        title: "Invalid email or password",
        description:
          "The email or password provided is incorrect. Please double-check your email and password and try again.",
      },
    };
  }
  const passwordsMatch = await compare(password, existingUser.password);
  if (!passwordsMatch) {
    return {
      error: {
        title: "Invalid email or password",
        description:
          "The email or password provided is incorrect. Please double-check your email and password and try again.",
      },
    };
  }
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
