"use client";

import { useState } from "react";
import { Confirm } from "./components/confirm";
import { Schedule } from "./components/schedule";

export default function SchedulePage({
  params,
}: Readonly<{ params: { username: string } }>) {
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>();

  function cancel() {
    setSelectedDateTime(null);
  }

  if (selectedDateTime) {
    return (
      <Confirm
        selectedDateTime={selectedDateTime}
        cancel={cancel}
        username={params.username}
      />
    );
  }

  return (
    <Schedule
      onSelectDateTime={setSelectedDateTime}
      username={params.username}
    />
  );
}
