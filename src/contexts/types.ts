import { createContext } from "react";
import type { Country } from "../countries";

// =============================================================================
// Types
// =============================================================================

export type GameStatus = "playing" | "win" | "loose";

export interface Score {
  points: number;
}

export interface Stats {
  capitalsFound: number;
  flagsAsked: number;
  flagsCorrect: number;
}

export interface NextCountryResult {
  foundFlag: boolean;
  foundCapital: boolean;
}

export interface GameContextValue {
  // States
  currentCountry: Country;
  life: number;
  score: Score;
  status: GameStatus;
  combo: number;
  maxCombo: number;
  stats: Stats;
  failedCountries: Country[];
  /** ISO codes of capitals correctly guessed in this game */
  capitalsSuccessful: string[];
  /** ISO codes where the flag was incorrectly guessed */
  flagsFailed: string[];

  // Methods
  nextCountry: (result: NextCountryResult) => void;
  reset: () => void;
}

// =============================================================================
// Context
// =============================================================================

export const GameContext = createContext<GameContextValue | null>(null);
