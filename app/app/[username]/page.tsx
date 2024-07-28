import { ScheduleForm } from "./components/schedule-form";
import prisma from "@/lib/prisma";

interface ScheduleProps {
  params: {
    username: string;
  };
}

export default async function SchedulePage({ params }: ScheduleProps) {
  const user = await prisma.user.findUnique({
    where: {
      username: params.username,
    },
  });

  if (!user) {
    return <h1>User not found</h1>;
  }

  return (
    <div>
      <h1>{user.name} Page</h1>
      <ScheduleForm />
    </div>
  );
}
