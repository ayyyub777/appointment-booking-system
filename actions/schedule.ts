import { z } from "zod";
import { ConfirmFormSchema } from "@/schemas";

interface Values extends z.infer<typeof ConfirmFormSchema> {
  date: Date;
}

export const schedule = async (values: Values) => {
  const validatedFields = ConfirmFormSchema.safeParse(values);
  if (!validatedFields.success) {
    return {
      error: {
        title: "Invalid fields",
        description:
          "The provided fields did not pass validation. Please review and correct any errors.",
      },
    };
  }
  try {
    return {
      success: {
        title: "",
        description: "",
      },
    };
  } catch (error) {
    return {
      error: {
        title: "",
        description: "",
      },
    };
  }
};
