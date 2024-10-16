import { calendar_v3, google } from "googleapis";
import { createClient } from "@/utils/supabase/server";
import { GoogleCalendarEvent } from "@/types";
import { addDays } from "date-fns";

export async function getCalendarEvents(weekNumber?: number, year?: number) {
  const supabase = createClient();

  // Get the user session and user data
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (sessionError || userError || !sessionData.session || !userData.user) {
    throw new Error("User not authenticated");
  }

  const session = sessionData.session;
  const { provider_token, provider_refresh_token } = session;

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: provider_token,
    refresh_token: provider_refresh_token,
  });

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  // Get the list of calendar IDs
  const calendarList = await calendar.calendarList.list();
  const calendarIds = calendarList.data.items
    ?.map((item) => item.id)
    .filter(Boolean) as string[];

  // Determine the date range for the specified week
  const { startDate, endDate } = getWeekDateRange(weekNumber, year);

  const timeMin = startDate.toISOString();
  const timeMax = endDate.toISOString();

  let allEvents: GoogleCalendarEvent[] = [];

  // Fetch events from all calendars within the date range
  for (const calendarId of calendarIds) {
    const eventsResponse = await calendar.events.list({
      calendarId,
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = eventsResponse.data.items || [];
    allEvents = allEvents.concat(events);
  }

  const _weekNumber = weekNumber || getWeekNumber(new Date());
  const _year = year || new Date().getFullYear();

  return {
    events: allEvents,
    weekNumber: _weekNumber,
    year: _year,
  };
}

// Helper functions
function getWeekDateRange(weekNumber?: number, year?: number) {
  const currentDate = new Date();
  const currentYear = year || currentDate.getFullYear();
  const currentWeekNumber = weekNumber || getWeekNumber(currentDate);

  const firstDayOfYear = new Date(currentYear, 0, 1);
  const daysOffset =
    (currentWeekNumber - 1) * 7 +
    (firstDayOfYear.getDay() > 4
      ? 8 - firstDayOfYear.getDay()
      : 1 - firstDayOfYear.getDay());
  const startDate = new Date(firstDayOfYear.getTime() + daysOffset * 86400000);

  const endDate = addDays(startDate, 7);

  return { startDate, endDate };
}

function getWeekNumber(date: Date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}
