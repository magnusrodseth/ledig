import { calendar_v3 } from "googleapis";

export type RouteProps = {
  params: {
    id: string;
    [key: string]: string | undefined;
  };
  searchParams: {
    [key: string]: string | undefined;
  };
};

export type GoogleCalendarEvent = calendar_v3.Schema$Event;
