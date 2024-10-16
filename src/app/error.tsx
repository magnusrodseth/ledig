"use client";

import { H1, P } from "@/components/typography";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Home } from "lucide-react";
import Link from "next/link";

export default function ErrorPage() {
  return (
    <div>
      <H1>Oops!</H1>
      <P>Something went wrong.</P>
      <Link
        href="/"
        className={cn("flex gap-2", buttonVariants({ variant: "outline" }))}
      >
        <Home className="w-4 h-4" />
        Take me home
      </Link>
    </div>
  );
}
