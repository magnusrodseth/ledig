// utils/availability.ts

import { GoogleCalendarEvent } from "@/types";
import {
  parseISO,
  format,
  addDays,
  isBefore,
  startOfDay,
  differenceInMinutes,
  getDay,
} from "date-fns";

interface TimeInterval {
  start: string; // "HH:mm"
  end: string; // "HH:mm"
}

export interface DayAvailability {
  date: string; // "yyyy-MM-dd"
  freeIntervals: TimeInterval[];
}

export function calculateAvailability(
  events: GoogleCalendarEvent[],
  workStartTime: string,
  workEndTime: string,
  startDate: Date,
  endDate: Date
): DayAvailability[] {
  const availability: DayAvailability[] = [];
  const today = startOfDay(new Date());

  // Ensure the date range is at least 7 days ahead from today
  const minEndDate = addDays(today, 6); // Today + 6 days = 7 days total
  if (isBefore(endDate, minEndDate)) {
    endDate = minEndDate;
  }

  // Calculate the total number of days between startDate and endDate
  const totalDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
  );

  console.log({ totalDays });

  for (let dayOffset = 0; dayOffset <= totalDays; dayOffset++) {
    const currentDate = addDays(startDate, dayOffset);
    const dateStr = format(currentDate, "yyyy-MM-dd");

    // Skip days before today
    if (isBefore(currentDate, today)) {
      continue;
    }

    // Skip Saturday and Sunday
    const dayOfWeek = getDay(currentDate); // 0 (Sunday) to 6 (Saturday)
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      continue;
    }

    // Initialize the working interval
    let freeIntervals: TimeInterval[] = [
      {
        start: workStartTime,
        end: workEndTime,
      },
    ];

    // Filter events for the current day
    const eventsOfDay = events.filter((event) => {
      const eventStart = event.start?.dateTime || event.start?.date;
      if (!eventStart) return false;

      const eventDate = format(new Date(eventStart), "yyyy-MM-dd");
      if (eventDate !== dateStr) return false;

      // Only consider events that are confirmed
      if (event.status !== "confirmed") return false;

      return true;
    });

    // Subtract busy intervals
    for (const event of eventsOfDay) {
      const eventStart = event.start?.dateTime || event.start?.date;
      const eventEnd = event.end?.dateTime || event.end?.date;

      if (!eventStart || !eventEnd) continue;

      const busyInterval: TimeInterval = {
        start: format(new Date(eventStart), "HH:mm"),
        end: format(new Date(eventEnd), "HH:mm"),
      };

      freeIntervals = subtractIntervals(freeIntervals, busyInterval);
    }

    // Filter out intervals less than 45 minutes
    freeIntervals = freeIntervals.filter((interval) => {
      const start = parseISO(`${dateStr}T${interval.start}:00`);
      const end = parseISO(`${dateStr}T${interval.end}:00`);
      const duration = differenceInMinutes(end, start);
      return duration >= 45;
    });

    if (freeIntervals.length > 0) {
      availability.push({
        date: dateStr,
        freeIntervals,
      });
    }
  }

  return availability;
}

// subtractIntervals function remains the same...

function subtractIntervals(
  freeIntervals: TimeInterval[],
  busyInterval: TimeInterval
): TimeInterval[] {
  const result: TimeInterval[] = [];

  for (const interval of freeIntervals) {
    if (
      busyInterval.end <= interval.start ||
      busyInterval.start >= interval.end
    ) {
      // No overlap
      result.push(interval);
    } else {
      // Overlap exists
      if (busyInterval.start > interval.start) {
        result.push({
          start: interval.start,
          end: busyInterval.start,
        });
      }
      if (busyInterval.end < interval.end) {
        result.push({
          start: busyInterval.end,
          end: interval.end,
        });
      }
    }
  }

  return result;
}
