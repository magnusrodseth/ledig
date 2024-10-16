"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "./ui/label";

interface SelectFieldsProps {
  weekNumber: number;
  workStartTime: string; // e.g., "08:00"
  workEndTime: string; // e.g., "17:00"
}

// Function to get the current ISO week number
function getWeekNumber(d: Date) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil(
    ((date.valueOf() - yearStart.valueOf()) / 86400000 + 1) / 7
  );
  return weekNum;
}

// Function to get the total number of weeks in the current year
function getTotalWeeksInYear(year: number) {
  const d = new Date(Date.UTC(year, 11, 31));
  const weekNum = getWeekNumber(d);
  if (weekNum === 1) {
    d.setUTCDate(d.getUTCDate() - 7);
    return getWeekNumber(d);
  } else {
    return weekNum;
  }
}

export default function SelectFields({
  weekNumber,
  workStartTime,
  workEndTime,
}: SelectFieldsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse initial startTime and endTime to numbers
  const initialStartTime = parseInt(workStartTime.split(":")[0]);
  let initialEndTime = parseInt(workEndTime.split(":")[0]);
  if (initialEndTime <= initialStartTime) {
    initialEndTime = (initialStartTime + 1) % 24;
  }

  const [week, setWeek] = useState(weekNumber.toString());
  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(initialEndTime);

  const handleWeekChange = (value: string) => {
    setWeek(value);
    updateUrl({ week: value });
  };

  const handleStartTimeChange = (value: string) => {
    const startHour = parseInt(value);
    setStartTime(startHour);
    if (endTime <= startHour) {
      const newEndTime = (startHour + 1) % 24;
      setEndTime(newEndTime);
      updateUrl({
        startTime: startHour.toString().padStart(2, "0") + ":00",
        endTime: newEndTime.toString().padStart(2, "0") + ":00",
      });
    } else {
      updateUrl({ startTime: startHour.toString().padStart(2, "0") + ":00" });
    }
  };

  const handleEndTimeChange = (value: string) => {
    const endHour = parseInt(value);
    setEndTime(endHour);
    updateUrl({ endTime: endHour.toString().padStart(2, "0") + ":00" });
  };

  const updateUrl = (params: { [key: string]: string }) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    Object.keys(params).forEach((key) => {
      current.set(key, params[key]);
    });
    const search = current.toString();
    router.push(`?${search}`);
  };

  // Get current week number and total weeks
  const currentWeekNumber = getWeekNumber(new Date());
  const totalWeeks = getTotalWeeksInYear(new Date().getFullYear());

  // Generate options for week numbers from current week to total weeks
  const weekOptions = Array.from(
    { length: totalWeeks - currentWeekNumber + 1 },
    (_, i) => currentWeekNumber + i
  );

  // Generate options for work start and end times as numbers from 0 to 23
  const timeOptions = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="flex flex-col items-center mt-10 gap-4">
      <div className="flex gap-4">
        <div className="flex flex-col">
          <Label className="mb-2">Velg uke</Label>
          <Select value={week} onValueChange={handleWeekChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Velg uke" />
            </SelectTrigger>
            <SelectContent>
              {weekOptions.map((week) => (
                <SelectItem key={week} value={week.toString()}>
                  Uke {week}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col">
          <Label className="mb-2">Starttid</Label>
          <Select
            value={startTime.toString()}
            onValueChange={handleStartTimeChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Starttid" />
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map((time) => (
                <SelectItem key={time} value={time.toString()}>
                  {time.toString().padStart(2, "0") + ":00"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col">
          <Label className="mb-2">Slutttid</Label>
          <Select
            value={endTime.toString()}
            onValueChange={handleEndTimeChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Slutttid" />
            </SelectTrigger>
            <SelectContent>
              {timeOptions
                .filter((time) => time > startTime)
                .map((time) => (
                  <SelectItem key={time} value={time.toString()}>
                    {time.toString().padStart(2, "0") + ":00"}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
