"use client";

import React, { useState } from "react";
import {
  useForm,
  useFieldArray,
  SubmitHandler,
  Controller,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { workingHoursBodySchema } from "@/schemas";

const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

type WorkingHoursForm = z.infer<typeof workingHoursBodySchema>;

const WorkingHoursForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<WorkingHoursForm>({
    resolver: zodResolver(workingHoursBodySchema),
    defaultValues: {
      intervals: weekDays.map((_, index) => ({
        weekDay: index,
        startTimeInMinutes: 540, // 9:00 AM
        endTimeInMinutes: 1020, // 5:00 PM
      })),
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "intervals",
  });

  const onSubmit: SubmitHandler<WorkingHoursForm> = async (data) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/working-hours", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to save working hours");
      }

      alert("Working hours saved successfully!");
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const convertMinutesToTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}`;
  };

  const convertTimeToMinutes = (time: string) => {
    const [hoursStr, minutesStr] = time.split(":");
    const hours = Number(hoursStr);
    const minutes = Number(minutesStr);
    return hours * 60 + minutes;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <h2 className="text-2xl font-bold">Set Your Working Hours</h2>
        </CardHeader>
        <CardContent>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="mb-4 grid grid-cols-3 gap-4 items-center"
            >
              <Label>{weekDays[index]}</Label>
              <Controller
                control={control}
                name={`intervals.${index}.startTimeInMinutes`}
                render={({ field: { onChange, value } }) => (
                  <Input
                    type="time"
                    value={convertMinutesToTime(value)}
                    onChange={(e) =>
                      onChange(convertTimeToMinutes(e.target.value))
                    }
                  />
                )}
              />
              <Controller
                control={control}
                name={`intervals.${index}.endTimeInMinutes`}
                render={({ field: { onChange, value } }) => (
                  <Input
                    type="time"
                    value={convertMinutesToTime(value)}
                    onChange={(e) =>
                      onChange(convertTimeToMinutes(e.target.value))
                    }
                  />
                )}
              />
            </div>
          ))}
          {errors.intervals && (
            <p className="text-red-500 mt-2">{errors.intervals.message}</p>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Working Hours"}
          </Button>
        </CardFooter>
      </Card>
      {submitError && (
        <p className="text-red-500 mt-4 text-center">{submitError}</p>
      )}
    </form>
  );
};

export default WorkingHoursForm;
