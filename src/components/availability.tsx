"use client";

import LoginWithGoogleButton from "@/components/login-with-google-button";
import { calculateAvailability } from "@/utils/availability";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { H1, H2, H3, P } from "@/components/typography";
import {
  capitalize,
  formatAvailabilityText,
  getWeekDateRange,
  getWeekNumber,
} from "@/utils/utils";
import { User } from "@supabase/supabase-js";
import CopyButton from "@/components/copy-button";
import SelectFields from "@/components/select-fields";
import { Separator } from "@/components/ui/separator";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { AvailabilitySkeleton } from "@/components/availability-skeleton";
import { getCalendarEventsAction } from "@/app/actions";

export default function Availability({ user }: { user: User }) {
  const searchParams = useSearchParams();

  const weekNumber = searchParams.get("week")
    ? parseInt(searchParams.get("week")!)
    : getWeekNumber(new Date());
  const year = new Date().getFullYear();

  const workStartTime = searchParams.get("startTime") || "09:00";
  const workEndTime = searchParams.get("endTime") || "17:00";

  const { data, isLoading, error } = useQuery({
    queryKey: ["availability", weekNumber, workStartTime, workEndTime],
    queryFn: async () => {
      const {
        events,
        weekNumber: currentWeekNumber,
        year: currentYear,
      } = await getCalendarEventsAction(weekNumber, year);

      const { startDate, endDate } = getWeekDateRange(
        currentWeekNumber,
        currentYear
      );

      // Calculate availability
      const availability = calculateAvailability(
        events,
        workStartTime,
        workEndTime,
        startDate,
        endDate
      );

      return availability;
    },
    enabled: !!user,
  });

  return (
    <main className="flex-1 flex flex-col gap-6 px-4">
      {!user && (
        <div className="flex flex-col justify-center items-center gap-4 mt-10">
          <H1 className="text-center">Velkommen til Ledig</H1>
          <P className="text-center max-w-md">
            Se og eksporter enkelt din tilgjengelighet basert på dine Google
            Kalender-hendelser. Logg inn for å komme i gang.
          </P>
          <LoginWithGoogleButton />
        </div>
      )}

      {user && (
        <>
          <SelectFields
            weekNumber={weekNumber}
            workStartTime={workStartTime}
            workEndTime={workEndTime}
          />

          <Separator />

          {isLoading ? (
            <AvailabilitySkeleton />
          ) : data && data.length === 0 ? (
            <div className="flex flex-col items-center">
              <H2>Ingen tilgjengelighet funnet</H2>
              <P>
                Du har ingen ledige tidsrom for den valgte perioden. Vennligst
                sjekk kalenderen din eller juster arbeidstidene dine.
              </P>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex gap-2 justify-center items-center">
                <H2>Din tilgjengelighet for uke {weekNumber}</H2>
              </div>
              <div className="mt-6">
                {data &&
                  data.map((day) => (
                    <div key={day.date} className="mb-6">
                      <H3>
                        {capitalize(
                          format(new Date(day.date), "EEEE d. MMMM", {
                            locale: nb,
                          })
                        )}
                      </H3>
                      {day.freeIntervals.length > 0 ? (
                        <ul className="list-disc pl-6">
                          {day.freeIntervals.map((interval, index) => (
                            <li key={index}>
                              {interval.start} - {interval.end}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <P>Ingen tilgjengelighet</P>
                      )}
                    </div>
                  ))}
              </div>

              <Separator />

              {data && (
                <CopyButton
                  textToCopy={formatAvailabilityText(data)}
                  className="mt-4 w-full"
                />
              )}
            </div>
          )}
        </>
      )}
    </main>
  );
}
