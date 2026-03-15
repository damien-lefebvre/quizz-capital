import { useState, useCallback, useMemo, type ReactNode } from "react";
import { countries, type Country } from "../countries";
import { pickRandomCapital, COMBO_WEIGHTS_30 } from "../utils/random";
import {
  GameContext,
  type GameContextValue,
  type Score,
  type Stats,
  type GameStatus,
  type NextCountryResult,
} from "./types";

// =============================================================================
// Constants
// =============================================================================

const INITIAL_LIVES = 5;

/**
 * Multiplicateur basé sur la difficulté du drapeau
 * - Difficulté 1: x1 si trouvé, x0.75 si pas trouvé
 * - Difficulté 2: x1.25
 * - Difficulté 3: x1.5
 * - Difficulté 4: x2
 * - Difficulté 5: x3
 */
const FLAG_MULTIPLIERS: Record<number, number> = {
  1: 1,
  2: 1.25,
  3: 1.5,
  4: 2,
  5: 3,
};

const FLAG_WRONG_MULTIPLIER_LEVEL_1 = 0.75;

// =============================================================================
// Helper functions
// =============================================================================

/**
 * Utilise le système de combo pour tirer un pays au hasard
 * en utilisant capitalLevel comme difficulté
 */
function pickRandomCountry(pool: Country[], combo: number): Country | null {
  if (pool.length === 0) return null;

  // Map le pool pour avoir la propriété 'difficulty' requise par pickRandomCapital
  const poolWithDifficulty = pool.map((c) => ({
    ...c,
    difficulty: c.capitalLevel,
  }));

  const result = pickRandomCapital(poolWithDifficulty, combo, COMBO_WEIGHTS_30);
  if (!result) return null;

  // Retrouve le pays original dans le pool
  return pool.find((c) => c.iso === result.iso) ?? null;
}

function removeCountryFromPool(pool: Country[], country: Country): Country[] {
  return pool.filter((c) => c.iso !== country.iso);
}

function calculateMultiplier(flagLevel: number, foundFlag: boolean): number {
  if (flagLevel === 1) {
    return foundFlag ? FLAG_MULTIPLIERS[1] : FLAG_WRONG_MULTIPLIER_LEVEL_1;
  }
  return foundFlag ? (FLAG_MULTIPLIERS[flagLevel] ?? 1) : 1;
}

function calculatePoints(
  capitalLevel: number,
  multiplier: number,
  combo: number,
): number {
  return combo + capitalLevel * multiplier;
}

// =============================================================================
// Provider
// =============================================================================

interface GameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  // Game state
  const [currentCountry, setCurrentCountry] = useState<Country>(() => {
    // Combo 0 au démarrage (ou 1 si on veut utiliser la progression dès le début)
    return pickRandomCountry([...countries], 1) ?? countries[0];
  });
  const [life, setLife] = useState(INITIAL_LIVES);
  const [score, setScore] = useState<Score>({ points: 0 });
  const [status, setStatus] = useState<GameStatus>("playing");
  const [combo, setCombo] = useState(0);
  const [stats, setStats] = useState<Stats>({
    capitalsFound: 0,
    flagsAsked: 0,
    flagsCorrect: 0,
  });
  const [maxCombo, setMaxCombo] = useState(0);

  // Pool management
  const [pool, setPool] = useState<Country[]>(() => {
    const initialPool = [...countries];
    return removeCountryFromPool(initialPool, currentCountry);
  });
  const [failedCountries, setFailedCountries] = useState<Country[]>([]);
  const [capitalsSuccessful, setCapitalsSuccessful] = useState<string[]>([]);
  const [flagsFailed, setFlagsFailed] = useState<string[]>([]);

  /**
   * Pick next country from pool or refill from failed countries.
   * Returns true if a country was picked, false if no countries available.
   */
  const pickNextFromPool = useCallback(
    (
      currentPool: Country[],
      currentFailed: Country[],
      currentCombo: number,
    ): boolean => {
      if (currentPool.length > 0) {
        const nextC = pickRandomCountry(currentPool, currentCombo);
        if (nextC) {
          setCurrentCountry(nextC);
          setPool(removeCountryFromPool(currentPool, nextC));
          return true;
        }
      }
      if (currentFailed.length > 0) {
        // Refill pool with failed countries
        const newPool = [...currentFailed];
        const nextC = pickRandomCountry(newPool, currentCombo);
        if (nextC) {
          setCurrentCountry(nextC);
          setPool(removeCountryFromPool(newPool, nextC));
          setFailedCountries([]);
          return true;
        }
      }
      return false;
    },
    [],
  );

  const nextCountry = useCallback(
    (result: NextCountryResult) => {
      const { foundFlag, foundCapital } = result;

      // Update stats
      setStats((prev) => ({
        capitalsFound: prev.capitalsFound + (foundCapital ? 1 : 0),
        flagsAsked: prev.flagsAsked + 1,
        flagsCorrect: prev.flagsCorrect + (foundFlag ? 1 : 0),
      }));

      // Track flag failures
      if (!foundFlag) {
        setFlagsFailed((prev) => [...prev, currentCountry.iso]);
      }

      if (foundCapital) {
        // Track successful capitals
        setCapitalsSuccessful((prev) => [...prev, currentCountry.iso]);

        // Correct answer - calculate points
        const newCombo = combo + 1;
        const multiplier = calculateMultiplier(
          currentCountry.flagLevel,
          foundFlag,
        );
        const pointsEarned = calculatePoints(
          currentCountry.capitalLevel,
          multiplier,
          newCombo,
        );

        setCombo(newCombo);
        setMaxCombo((prev) => Math.max(prev, newCombo));
        setScore((prev) => ({ points: prev.points + pointsEarned }));

        // Pick next country or win if all found (use newCombo for difficulty)
        const hasNext = pickNextFromPool(pool, failedCountries, newCombo);
        if (!hasNext) {
          setStatus("win");
        }
      } else {
        // Wrong answer
        setCombo(0);
        const newLife = life - 1;
        setLife(newLife);

        // Add current country to failed list for later
        setFailedCountries((prev) => [...prev, currentCountry]);

        if (newLife <= 0) {
          setStatus("loose");
        } else {
          // Pick next country from pool (combo reset, use 1 for easiest difficulty)
          pickNextFromPool(pool, failedCountries, 1);
        }
      }
    },
    [currentCountry, pool, failedCountries, combo, life, pickNextFromPool],
  );

  const reset = useCallback(() => {
    const initialPool = [...countries];
    const firstCountry = pickRandomCountry(initialPool, 1) ?? countries[0];

    setCurrentCountry(firstCountry);
    setPool(removeCountryFromPool(initialPool, firstCountry));
    setFailedCountries([]);
    setCapitalsSuccessful([]);
    setFlagsFailed([]);
    setLife(INITIAL_LIVES);
    setScore({ points: 0 });
    setStatus("playing");
    setCombo(0);
    setMaxCombo(0);
    setStats({ capitalsFound: 0, flagsAsked: 0, flagsCorrect: 0 });
  }, []);

  const value = useMemo<GameContextValue>(
    () => ({
      currentCountry,
      life,
      score,
      status,
      combo,
      maxCombo,
      stats,
      failedCountries,
      capitalsSuccessful,
      flagsFailed,
      nextCountry,
      reset,
    }),
    [
      currentCountry,
      life,
      score,
      status,
      combo,
      maxCombo,
      stats,
      failedCountries,
      capitalsSuccessful,
      flagsFailed,
      nextCountry,
      reset,
    ],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
