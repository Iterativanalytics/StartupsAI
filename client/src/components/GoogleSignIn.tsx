
import { Button } from "@/components/ui/button";
import { Chrome } from "lucide-react";

interface GoogleSignInProps {
  className?: string;
}

export function GoogleSignIn({ className }: GoogleSignInProps) {
  const handleGoogleSignIn = () => {
    window.location.href = "/api/auth/google";
  };

  return (
    <Button
      onClick={handleGoogleSignIn}
      variant="outline"
      className={`w-full ${className}`}
    >
      <Chrome className="mr-2 h-4 w-4" />
      Continue with Google
    </Button>
  );
}
