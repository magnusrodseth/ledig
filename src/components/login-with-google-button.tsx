"use client";

import { signInWithGoogleAction } from "@/app/actions";
import { Icons } from "./icons";
import { Button } from "./ui/button";

const LoginWithGoogleButton = () => {
  const handleLoginWithGoogle = async () => {
    await signInWithGoogleAction();
  };

  return (
    <Button
      variant="outline"
      className="flex gap-2"
      onClick={handleLoginWithGoogle}
    >
      <Icons.google className="w-4 h-4 " />
      Sign in with Google
    </Button>
  );
};

export default LoginWithGoogleButton;
