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

  /**
   * Get first-try scores (first game of each day with at least one capital found)
   */
  const getFirstTryScores = useCallback(
    (count: number = 10): GameRecord[] => {
      const byDate = new Map<string, GameRecord>();

      // Sort by date ascending to find first game of each day
      const sorted = [...history].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );

      for (const record of sorted) {
        const date = new Date(record.date);
        const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
        // Keep only the first game of each day (first attempt)
        if (!byDate.has(dateKey) && record.capitalsFound > 0) {
          byDate.set(dateKey, record);
        }
      }

      return [...byDate.values()]
        .sort((a, b) => b.score - a.score)
        .slice(0, count);
    },
    [history],
  );

  /**
   * Get recent scores (last 3 months)
   */
  const getRecentScores = useCallback(
    (count: number = 10): GameRecord[] => {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      return history
        .filter((record) => new Date(record.date) >= threeMonthsAgo)
        .sort((a, b) => b.score - a.score)
        .slice(0, count);
    },
    [history],
  );

  return {
    history,
    addGame,
    getTopScores,
    getFirstTryScores,
    getRecentScores,
    clearHistory,
    getCapitalStats,
  };
}
