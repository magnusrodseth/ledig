"use client";

import { DoorClosed, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { signOutAction } from "@/app/actions";
import { toast } from "sonner";

const SignOutButton = () => {
  const handleSignOut = async () => {
    toast.promise(signOutAction(), {
      loading: "Signing out...",
      success: "Successfully signed out!",
      error: "An error occurred while signing out. Please try again.",
    });
  };

  return (
    <Button className="flex gap-2" variant="outline" onClick={handleSignOut}>
      <LogOut className="w-4 h-4" />
      Sign out
    </Button>
  );
};

export default SignOutButton;
