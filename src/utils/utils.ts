import { redirect } from "next/navigation";
import { nb } from "date-fns/locale";
import { DayAvailability } from "./availability";
import { addDays, format, getISOWeek, startOfISOWeek } from "date-fns";

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
  type: "error" | "success",
  path: string,
  message: string
) {
  return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

export function getWeekDateRange(weekNumber: number, year: number) {
  const firstWeekStart = startOfISOWeek(new Date(year, 0, 4));
  const startDate = addDays(firstWeekStart, (weekNumber - 1) * 7);
  const endDate = addDays(startDate, 6);
  return { startDate, endDate };
}

export function getWeekNumber(date: Date) {
  return getISOWeek(date);
}

export function formatAvailabilityText(
  availability: DayAvailability[]
): string {
  return availability
    .map((day) => {
      const dateStr = capitalize(
        format(new Date(day.date), "EEEE d. MMMM", {
          locale: nb,
        })
      );
      const intervals = day.freeIntervals
        .map((interval) => `${interval.start} - ${interval.end}`)
        .join(", ");
      return `${dateStr}: ${intervals || "Utilgjengelig"}`;
    })
    .join("\n");
}

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
