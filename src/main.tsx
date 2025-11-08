import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initializeMetaPixel } from "./lib/tracking";

// Initialize Meta Pixel
initializeMetaPixel();

createRoot(document.getElementById("root")!).render(<App />);
