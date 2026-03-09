import { useLocalStorage } from "./useLocalStorage";
import { useCallback } from "react";

// =============================================================================
// Types
// =============================================================================

export interface FailedCountryRecord {
  iso: string;
  name: string;
  capital: string;
}

export interface GameRecord {
  id: string;
  date: string;
  score: number;
  capitalsFound: number;
  capitalsAttempted: number;
  flagsFound: number;
  flagsAttempted: number;
  failedCountries: FailedCountryRecord[];
  maxCombo: number;
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

  return {
    history,
    addGame,
    getTopScores,
    clearHistory,
  };
}
