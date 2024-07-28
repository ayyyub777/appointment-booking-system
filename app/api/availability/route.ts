import { NextResponse } from "next/server";
import dayjs from "dayjs";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { date, username } = body.data;

    if (!date) {
      return NextResponse.json(
        { message: "Date not provided." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User does not exist." },
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
        user_id: user.id,
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

    // Task : Block the times that are already booked

    return NextResponse.json({ possibleTimes, availableTimes: possibleTimes });
  } catch (error) {
    return NextResponse.json({ status: 500 });
  }
}
