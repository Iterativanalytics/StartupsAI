import { createRoot } from "react-dom/client";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { FeatureFlagsProvider } from "@/contexts/FeatureFlagsContext";
import { TooltipProvider } from "@/components/ui/tooltip";

// Ensure the root element exists
const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("Root element not found!");
  document.body.innerHTML = '<div style="padding: 20px; color: red;">Error: Root element not found!</div>';
} else {
  console.log("Root element found, rendering app...");
  createRoot(rootElement).render(
    <FeatureFlagsProvider>
      <TooltipProvider delayDuration={200} skipDelayDuration={0}>
        <App />
      </TooltipProvider>
    </FeatureFlagsProvider>
  );
}
