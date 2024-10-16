"use client";

import { H1, P } from "@/components/typography";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Home } from "lucide-react";
import Link from "next/link";

export default function ErrorPage() {
  return (
    <div className="flex gap-2 flex-col justify-center items-center">
      <H1>Oisann!</H1>
      <P>Noe gikk galt.</P>
      <Link
        href="/"
        className={cn("flex gap-2", buttonVariants({ variant: "outline" }))}
      >
        <Home className="w-4 h-4" />
        Ta meg hjem
      </Link>
    </div>
  );
}
