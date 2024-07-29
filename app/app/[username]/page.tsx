"use client";

import { useState } from "react";
import { Confirm } from "./components/confirm";
import { Schedule } from "./components/schedule";

export default function ScheduleFPage() {
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>();

  function cancel() {
    setSelectedDateTime(null);
  }

  if (selectedDateTime) {
    return <Confirm selectedDateTime={selectedDateTime} cancel={cancel} />;
  }

  return <Schedule onSelectDateTime={setSelectedDateTime} username="user" />;
}
