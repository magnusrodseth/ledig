"use server";

import { scopes } from "@/lib/scopes";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { google } from "googleapis";
import { addDays } from "date-fns";
import { getWeekDateRange, getWeekNumber } from "@/utils/utils";
import { GoogleCalendarEvent } from "@/types";

export async function getCalendarEventsAction(
  weekNumber?: number,
  year?: number
) {
  const supabase = createClient();

  // Get the user session and user data
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    throw new Error("User not authenticated");
  }

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

  const _weekNumber = weekNumber || getWeekNumber(new Date());
  const _year = year || new Date().getFullYear();

  // Determine the date range for the specified week
  const { startDate, endDate } = getWeekDateRange(_weekNumber, _year);

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

  return {
    events: allEvents,
    weekNumber: _weekNumber,
    year: _year,
  };
}

export const signOutAction = async () => {
  const supabase = createClient();
  await supabase.auth.signOut();
  return redirect("/");
};

export const signInWithGoogleAction = async () => {
  const supabase = createClient();
  const origin = headers().get("origin");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
      scopes: scopes,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (data.url) {
    redirect(data.url); // use the redirect API for your server framework
  }
};
