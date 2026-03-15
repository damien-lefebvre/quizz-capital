import { useLocalStorage } from "./useLocalStorage";
import { useCallback } from "react";

// =============================================================================
// Types
// =============================================================================

export interface GameRecord {
  id: string;
  date: string;
  score: number;
  capitalsFound: number;
  capitalsAttempted: number;
  flagsFound: number;
  flagsAttempted: number;
  /** ISO codes of countries where the capital was incorrectly guessed */
  failedCountriesIso: string[];
  maxCombo: number;
  /** List of ISO codes for capitals that were correctly guessed */
  capitalsSuccessful?: string[];
  /** List of ISO codes where the flag was incorrectly guessed */
  flagsFailed?: string[];
}

// =============================================================================
// Constants
// =============================================================================

const STORAGE_KEY = "quizz-capital-history";

// =============================================================================
// Hook
// =============================================================================

export function useGameHistory() {
  const [history, setHistory] = useLocalStorage<GameRecord[]>(STORAGE_KEY, []);

  const addGame = useCallback(
    (game: Omit<GameRecord, "id" | "date">) => {
      const newRecord: GameRecord = {
        ...game,
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
      };

      setHistory((prev) => [newRecord, ...prev]);

      return newRecord;
    },
    [setHistory],
  );

  const getTopScores = useCallback(
    (count: number = 5): GameRecord[] => {
      return [...history].sort((a, b) => b.score - a.score).slice(0, count);
    },
    [history],
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, [setHistory]);

  /**
   * Calculate stats for a specific capital (by ISO code).
   * Returns the number of times it was encountered and success rate.
   */
  const getCapitalStats = useCallback(
    (iso: string): { encounters: number; successRate: number } => {
      let successes = 0;
      let failures = 0;

      for (const game of history) {
        // Count successes
        if (game.capitalsSuccessful?.includes(iso)) {
          successes++;
        }
        // Count failures (capital was wrong = country ISO is in failedCountriesIso)
        if (game.failedCountriesIso?.includes(iso)) {
          failures++;
        }
      }

      const encounters = successes + failures;
      const successRate = encounters > 0 ? (successes / encounters) * 100 : 0;

      return { encounters, successRate };
    },
    [history],
  );

  return {
    history,
    addGame,
    getTopScores,
    clearHistory,
    getCapitalStats,
  };
}
