"use client";

import { DoorClosed, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { signOutAction } from "@/app/actions";
import { toast } from "sonner";

const SignOutButton = () => {
  const handleSignOut = async () => {
    toast.promise(signOutAction(), {
      loading: "Logger ut...",
      success: "Suksess! Du er nå logget ut.",
      error: "En feil oppstod under utlogging. Vennligst prøv igjen.",
    });
  };

  return (
    <Button className="flex gap-2" variant="outline" onClick={handleSignOut}>
      <LogOut className="w-4 h-4" />
      Logg ut
    </Button>
  );
};

export default SignOutButton;
