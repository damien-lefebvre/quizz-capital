import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.scss";
import App from "./App.tsx";
import { GameProvider } from "./contexts";
import { runStorageMigrations } from "./utils";

// Run storage migrations before any localStorage access
runStorageMigrations();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GameProvider>
      <App />
    </GameProvider>
  </StrictMode>,
);
