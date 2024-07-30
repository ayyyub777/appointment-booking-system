import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import dayjs from "dayjs";

const bodySchema = z.object({
  username: z.string(),
  name: z.string(),
  email: z.string().email(),
  note: z.string().optional(),
  date: z.string().datetime(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedBody = bodySchema.safeParse(body);

    if (!validatedBody.success) {
      const errorMessage = validatedBody.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(", ");
      return NextResponse.json(
        { message: `Invalid input: ${errorMessage}` },
        { status: 400 }
      );
    }

    const { username, name, email, note, date } = validatedBody.data;

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User does not exist." },
        { status: 400 }
      );
    }

    const schedulingDate = dayjs(date).startOf("hour");

    if (schedulingDate.isBefore(dayjs())) {
      return NextResponse.json(
        { message: "Date is in the past!" },
        { status: 400 }
      );
    }

    const conflictingScheduling = await prisma.scheduling.findFirst({
      where: {
        user_id: user.id,
        date: schedulingDate.toDate(),
      },
    });

    if (conflictingScheduling) {
      return NextResponse.json(
        { message: "There is another scheduling at the same time!" },
        { status: 400 }
      );
    }

    const scheduling = await prisma.scheduling.create({
      data: {
        date: schedulingDate.toDate(),
        name,
        email,
        note,
        user_id: user.id,
      },
    });

    return NextResponse.json(
      { message: "Scheduling created successfully", scheduling },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in scheduling API:", error);
    return NextResponse.json(
      { message: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}
