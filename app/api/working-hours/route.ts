import { z } from "zod";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { workingHoursBodySchema } from "@/schemas";

type WorkingHoursBody = z.infer<typeof workingHoursBodySchema>;

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user_id = session.user.id;

    const body = await req.json();
    const { intervals } = workingHoursBodySchema.parse(body);

    const existingWorkingHours = await prisma.userWorkingHours.findFirst({
      where: { user_id },
    });

    if (existingWorkingHours) {
      await prisma.userWorkingHours.deleteMany({
        where: { user_id },
      });
      await prisma.userWorkingHours.createMany({
        data: intervals.map((interval) => ({
          week_day: interval.weekDay,
          timer_start_in_minutes: interval.startTimeInMinutes,
          time_end_in_minutes: interval.endTimeInMinutes,
          user_id,
        })),
      });
    } else {
      await prisma.userWorkingHours.createMany({
        data: intervals.map((interval) => ({
          week_day: interval.weekDay,
          timer_start_in_minutes: interval.startTimeInMinutes,
          time_end_in_minutes: interval.endTimeInMinutes,
          user_id,
        })),
      });
    }

    return NextResponse.json(
      { message: "Working hours created successfully" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request body", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error creating working hours:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
