import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

interface AzureSignInProps {
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export function AzureSignIn({ 
  className, 
  variant = "default", 
  size = "default" 
}: AzureSignInProps) {
  const handleAzureSignIn = () => {
    window.location.href = "/api/auth/azure";
  };

  return (
    <Button
      onClick={handleAzureSignIn}
      variant={variant}
      size={size}
      className={className}
    >
      <LogIn className="mr-2 h-4 w-4" />
      Sign in with Microsoft
    </Button>
  );
}
