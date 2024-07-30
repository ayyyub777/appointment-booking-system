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

    const blockedTimes = await prisma.scheduling.findMany({
      select: {
        date: true,
      },
      where: {
        user_id: user.id,
        date: {
          gte: referenceDate.set("hour", startHour).toDate(),
          lte: referenceDate.set("hour", endHour).toDate(),
        },
      },
    });

    const availableTimes = possibleTimes.filter((time) => {
      const isTimeBlocked = blockedTimes.some(
        (blockedTime) => blockedTime.date.getHours() === time
      );

      const isTimeInPast = referenceDate.set("hour", time).isBefore(new Date());

      return !isTimeBlocked && !isTimeInPast;
    });

    return NextResponse.json({ possibleTimes, availableTimes });
  } catch (error) {
    return NextResponse.json({ status: 500 });
  }
}
