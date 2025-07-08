// src/lib/superdev/client.ts
import { customClient } from "@/lib/customClient";

// Debug environment variables (optional)
console.log("[MedVision] Environment Variables:", {
  appId: import.meta.env.VITE_APP_ID,
  baseUrl: import.meta.env.VITE_SUPERDEV_BASE_URL
});

// Simplified client export
export const superdevClient = {
  ...customClient,
  initialized: true,
  onReady: (callback: () => void) => {
    console.log("Simulating Superdev initialization");
    setTimeout(callback, 100); // Small delay to mimic async init
  },
  auth: {
    ...customClient.auth,
    isAuthenticated: true // Force authenticated state
  }
};

// Type augmentation for compatibility
declare global {
  interface Window {
    superdevClient: typeof superdevClient;
  }
}
window.superdevClient = superdevClient; // For debug access