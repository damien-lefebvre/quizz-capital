import { useState } from "react";
import type { Country } from "../../../countries";
import { getFlagUrl } from "../../../utils";
import "./GameSummary.scss";

// =============================================================================
// Types
// =============================================================================

interface GameSummaryProps {
  capitalsFound: number;
  capitalsTotal: number;
  flagsCorrect: number;
  flagsTotal: number;
  failedCountries: Country[];
  score: number;
  maxCombo: number;
}

// =============================================================================
// Component
// =============================================================================

export function GameSummary({
  capitalsFound,
  capitalsTotal,
  flagsCorrect,
  flagsTotal,
  failedCountries,
  score,
  maxCombo,
}: GameSummaryProps) {
  const flagsPercent =
    flagsTotal > 0 ? Math.round((flagsCorrect / flagsTotal) * 100) : 0;

  // Take only the last 5 failed countries for display
  const displayedErrors = failedCountries.slice(-5);

  // Track which countries have been revealed
  const [revealedCountries, setRevealedCountries] = useState<Set<string>>(
    new Set(),
  );

  const handleReveal = (iso: string) => {
    setRevealedCountries((prev) => new Set(prev).add(iso));
  };

  return (
    <div className="game-summary">
      {/* Stats row */}
      <div className="game-summary__stats">
        <div className="game-summary__stat">
          <span className="game-summary__stat-fraction">
            <span className="game-summary__stat-primary">{capitalsFound}</span>
            <span className="game-summary__stat-secondary">
              /{capitalsTotal}
            </span>
          </span>
          <span className="game-summary__stat-label">Capitales</span>
        </div>
        <div className="game-summary__stat">
          <span className="game-summary__stat-percent">{flagsPercent}%</span>
          <span className="game-summary__stat-label">Drapeaux</span>
        </div>
      </div>

      {/* Failed countries grid */}
      <div className="game-summary__errors">
        <span className="game-summary__errors-title">Erreurs</span>
        <div className="game-summary__errors-grid">
          {/* Row 1: Flags */}
          {displayedErrors.map((country) => {
            const flagUrl = getFlagUrl(country.iso);
            const isRevealed = revealedCountries.has(country.iso);
            return (
              <div
                key={`flag-${country.iso}`}
                className={`game-summary__error-cell game-summary__error-item ${isRevealed ? "game-summary__error-item--revealed" : ""}`}
                onClick={() => handleReveal(country.iso)}
              >
                {flagUrl && (
                  <img
                    src={flagUrl}
                    alt={`Drapeau de ${country.name}`}
                    className="game-summary__error-flag"
                  />
                )}
              </div>
            );
          })}
          {/* Row 2: Country names */}
          {displayedErrors.map((country) => {
            const isRevealed = revealedCountries.has(country.iso);
            return (
              <span
                key={`name-${country.iso}`}
                className={`game-summary__error-country game-summary__error-item ${isRevealed ? "game-summary__error-item--revealed" : ""}`}
                onClick={() => handleReveal(country.iso)}
              >
                {country.name}
              </span>
            );
          })}
          {/* Row 3: Capitals */}
          {displayedErrors.map((country) => {
            const isRevealed = revealedCountries.has(country.iso);
            return (
              <span
                key={`capital-${country.iso}`}
                className={`game-summary__error-capital game-summary__error-item game-summary__error-capital--blurred ${isRevealed ? "game-summary__error-item--revealed" : ""}`}
                onClick={() => handleReveal(country.iso)}
              >
                {country.capital}
              </span>
            );
          })}
        </div>
      </div>

      {/* Score row */}
      <div className="game-summary__totals">
        <div className="game-summary__total">
          <span className="game-summary__total-value">{Math.floor(score)}</span>
          <span className="game-summary__total-label">Score</span>
        </div>
        <div className="game-summary__total">
          <span className="game-summary__total-value">{maxCombo}</span>
          <span className="game-summary__total-label">Combo max</span>
        </div>
      </div>
    </div>
  );
}
