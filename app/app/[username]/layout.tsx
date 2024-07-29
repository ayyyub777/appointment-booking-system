import prisma from "@/lib/prisma";

export default async function ScheduleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: {
    username: string;
  };
}>) {
  const user = await prisma.user.findUnique({
    where: {
      username: params.username,
    },
  });

  if (!user) {
    return <h1>User not found</h1>;
  }
  return (
    <div className="pt-10 flex justify-center items-center">
      <div className="space-y-6">
        <h1 className="text-center text-2xl font-medium leading-none tracking-tight">
          Schedule
        </h1>
        <div className="w-[800px] p-4 border border-border rounded-xl">
          {children}
        </div>
      </div>
    </div>
  );
}
