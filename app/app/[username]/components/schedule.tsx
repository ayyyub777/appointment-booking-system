"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import axios from "axios";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface ScheduleProps {
  onSelectDateTime: (date: Date) => void;
  username: string;
}

interface Availability {
  possibleTimes: number[];
  availableTimes: number[];
}

const Schedule = ({ onSelectDateTime, username }: ScheduleProps) => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [availability, setAvailability] = useState<Availability>();

  const selectedDateFormatted = selectedDate
    ? dayjs(selectedDate).format("YYYY-MM-DD")
    : null;

  useEffect(() => {
    async function fetchAvailability() {
      if (selectedDate) {
        try {
          const response = await axios.post(`/api/availability`, {
            data: { date: selectedDateFormatted, username },
          });
          setAvailability(response.data);
        } catch (error) {
          console.error("Failed to fetch availability:", error);
        }
      }
    }
    fetchAvailability();
  }, [selectedDate, username, selectedDateFormatted]);

  const handleSelectTime = (hour: number) => {
    if (selectedDate) {
      const dateWithTime = dayjs(selectedDate)
        .set("hour", hour)
        .startOf("hour")
        .toDate();
      onSelectDateTime(dateWithTime);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => setSelectedDate(date as Date)}
        className="rounded-md border"
      />
      {selectedDate && (
        <div className="w-full md:w-[350px]">
          <h2 className="text-xl font-semibold mb-4">
            {dayjs(selectedDate).format("dddd")}
            <span className="text-gray-500 ml-2">
              {dayjs(selectedDate).format("DD[ de ]MMMM")}
            </span>
          </h2>
          <ScrollArea className="h-[300px]">
            <div className="grid grid-cols-3 gap-2">
              {availability?.possibleTimes.map((hour) => (
                <Button
                  key={hour}
                  onClick={() => handleSelectTime(hour)}
                  disabled={!availability.availableTimes.includes(hour)}
                  variant="outline"
                  className="w-full"
                >
                  {String(hour).padStart(2, "0")}:00
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export { Schedule };
