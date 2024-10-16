// src/components/availability-skeleton.tsx

import { Skeleton } from "@/components/ui/skeleton";
import { H2, H3 } from "@/components/typography";
import { Separator } from "@/components/ui/separator";

export function AvailabilitySkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 justify-center items-center">
        <Skeleton className="h-12 w-11/12" />
      </div>
      <div className="mt-6">
        {[...Array(3)].map((_, idx) => (
          <div key={idx} className="mb-6 flex flex-col gap-2">
            <H3>
              <Skeleton className="h-8 w-52" />
            </H3>
            <ul className="pl-6 flex flex-col gap-2">
              {[...Array(2)].map((_, i) => (
                <li key={i}>
                  <Skeleton className="h-6 w-32" />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <Separator />

      <Skeleton className="mt-4 h-10 w-full" />
    </div>
  );
}
