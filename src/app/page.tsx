import LoginWithGoogleButton from "@/components/login-with-google-button";
import { createClient } from "@/utils/supabase/server";
import { calculateAvailability, DayAvailability } from "@/utils/availability";
import { format } from "date-fns";
import { getCalendarEvents } from "@/lib/google-calendar";
import { Muted } from "@/components/typography";
import { getWeekDateRange } from "@/utils/utils";
import { RouteProps } from "@/types";
import { User } from "@supabase/supabase-js";

export default async function Index({ searchParams }: RouteProps) {
  const supabase = createClient();

  // Get week number and year from query parameters if provided
  const weekNumber = searchParams.week
    ? parseInt(searchParams.week)
    : undefined;
  const year = searchParams.year ? parseInt(searchParams.year) : undefined;

  let availability: DayAvailability[] = [];
  let user: User | null = null;

  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;

    if (user) {
      const {
        events,
        weekNumber: currentWeekNumber,
        year: currentYear,
      } = await getCalendarEvents(weekNumber, year);

      const { startDate, endDate } = getWeekDateRange(
        currentWeekNumber,
        currentYear
      );

      // Define working hours (adjust as needed)
      const workStartTime = "09:00";
      const workEndTime = "17:00";

      // Calculate availability
      availability = calculateAvailability(
        events,
        workStartTime,
        workEndTime,
        startDate,
        endDate
      );
    }
  } catch (error) {
    console.error("Error fetching calendar events:", error);
  }

  return (
    <>
      <main className="flex-1 flex flex-col gap-6 px-4">
        {!user && (
          <div className="flex flex-col justify-center items-center gap-2">
            <Muted>Please sign in to view your availability.</Muted>
            <LoginWithGoogleButton />
          </div>
        )}

        {user && availability.length === 0 && (
          <p>No availability left for this week.</p>
        )}

        {availability.length > 0 && (
          <div>
            <h1>Your Availability for Week {weekNumber || "Current"}:</h1>
            <ul>
              {availability.map((day) => (
                <li key={day.date}>
                  <strong>{format(new Date(day.date), "EEEE, MMMM d")}</strong>
                  {day.freeIntervals.length > 0 ? (
                    <ul>
                      {day.freeIntervals.map((interval, index) => (
                        <li key={index}>
                          {interval.start} - {interval.end}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No availability</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </>
  );
}
