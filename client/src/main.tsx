import { createRoot } from "react-dom/client";
import App from "./App";

console.log("🚀 Starting React app...");

// Force hide loading screen
const loadingScreen = document.getElementById("loading-screen");
if (loadingScreen) {
  console.log("📱 Hiding loading screen...");
  loadingScreen.style.display = "none";
} else {
  console.log("⚠️ Loading screen not found");
}

// Ensure the root element exists
const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("❌ Root element not found!");
  document.body.innerHTML = '<div style="padding: 20px; color: red;">Error: Root element not found!</div>';
} else {
  console.log("✅ Root element found, rendering app...");
  try {
    const root = createRoot(rootElement);
    root.render(<App />);
    console.log("✅ React app rendered successfully!");
  } catch (error) {
    console.error("❌ Error rendering React app:", error);
    rootElement.innerHTML = '<div style="padding: 20px; color: red;">Error rendering React app: ' + error.message + '</div>';
  }
}
