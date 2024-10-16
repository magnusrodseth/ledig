// src/components/copy-button.tsx

"use client";

import { ClipboardCopy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CopyButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  textToCopy: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({
  textToCopy,
  className,
  ...props
}) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy);
    toast.success("Tilgjengelighet kopiert til utklippstavlen!");
  };

  return (
    <Button
      variant="outline"
      className={cn("flex gap-2 items-center", className)}
      onClick={handleCopy}
      {...props}
    >
      <ClipboardCopy className="w-4 h-4" />
      Kopier tilgjengelighet
    </Button>
  );
};

export default CopyButton;
