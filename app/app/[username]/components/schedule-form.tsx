"use client";

import { useState } from "react";
import { Schedule } from "./schedule";
// import { Confirm } from "./confirm";

const ScheduleForm = () => {
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>();

  //   function handleClearSelectedDateTime() {
  //     setSelectedDateTime(null);
  //   }

  //   if (selectedDateTime) {
  //     return (
  //       <Confirm
  //         schedulingDate={selectedDateTime}
  //         onCancelConfirmation={handleClearSelectedDateTime}
  //       />
  //     );
  //   }

  return <Schedule onSelectDateTime={setSelectedDateTime} username="user" />;
};

export { ScheduleForm };
