// src/components/login-with-google-button.tsx

"use client";

import { signInWithGoogleAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";

const LoginWithGoogleButton = () => {
  const [isPending, startTransition] = useTransition();

  const handleLoginWithGoogle = () => {
    startTransition(() => {
      signInWithGoogleAction();
    });
  };

  return (
    <Button
      variant="outline"
      className="flex gap-2"
      onClick={handleLoginWithGoogle}
      disabled={isPending}
    >
      Logg inn med Google
    </Button>
  );
};

export default LoginWithGoogleButton;
