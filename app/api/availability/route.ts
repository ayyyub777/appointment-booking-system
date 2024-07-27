import { z } from "zod";
import { NextResponse } from "next/server";
import dayjs from "dayjs";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const username = session.user.name;
    const user_id = session.user.id;

    const body = await req.json();

    const { date } = body.query;

    if (!date) {
      return NextResponse.json(
        { message: "Date not provided." },
        { status: 400 }
      );
    }

    const referenceDate = dayjs(String(date));

    const isPastDate = referenceDate.endOf("day").isBefore(new Date());

    if (isPastDate) {
      return NextResponse.json({ possibleTimes: [], availableTimes: [] });
    }

    const userAvailability = await prisma.userWorkingHours.findFirst({
      where: {
        user_id,
        week_day: referenceDate.get("day"),
      },
    });

    if (!userAvailability) {
      return NextResponse.json({ possibleTimes: [], availableTimes: [] });
    }

    // eslint-disable-next-line camelcase
    const { timer_start_in_minutes, time_end_in_minutes } = userAvailability;

    // eslint-disable-next-line camelcase
    const startHour = timer_start_in_minutes / 60;
    // eslint-disable-next-line camelcase
    const endHour = time_end_in_minutes / 60;

    const possibleTimes = Array.from({ length: endHour - startHour }).map(
      (_, i) => {
        return startHour + i;
      }
    );

    // Block the times that are already booked ...
  } catch (error) {
    return NextResponse.json({ status: 500 });
  }
}
