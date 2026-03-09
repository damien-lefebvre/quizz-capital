import { useEffect, useRef } from "react";
import { useGame } from "../../contexts";
import { useGameHistory } from "../../hooks";
import { GameSummary } from "./GameSummary";
import { HighScores } from "./HighScores";
import "./Result.scss";

// =============================================================================
// Component
// =============================================================================

export function Result() {
  const { score, stats, maxCombo, failedCountries, status, reset } = useGame();
  const { addGame, getTopScores } = useGameHistory();
  const hasSavedRef = useRef(false);

  // Save game on mount (only once)
  useEffect(() => {
    if (hasSavedRef.current) return;
    hasSavedRef.current = true;

    addGame({
      score: score.points,
      capitalsFound: stats.capitalsFound,
      capitalsAttempted: stats.flagsAsked,
      flagsFound: stats.flagsCorrect,
      flagsAttempted: stats.flagsAsked,
      failedCountries: failedCountries.map((c) => ({
        iso: c.iso,
        name: c.name,
        capital: c.capital,
      })),
      maxCombo,
    });
  }, [addGame, score.points, stats, failedCountries, maxCombo]);

  // Get top 5 scores (includes the game we just saved)
  const topScores = getTopScores(5);

  // Check for perfect score (100% capitals AND 100% flags)
  const isPerfectScore =
    stats.flagsAsked > 0 &&
    stats.capitalsFound === stats.flagsAsked &&
    stats.flagsCorrect === stats.flagsAsked;

  const isVictory = status === "win";

  return (
    <div className="result">
      {/* Header */}
      <header className="result__header">
        {isVictory ? (
          isPerfectScore ? (
            <h1 className="result__title result__title--perfect">
              Score parfait
            </h1>
          ) : (
            <h1 className="result__title result__title--victory">Victoire</h1>
          )
        ) : (
          <h1 className="result__title result__title--defeat">Défaite</h1>
        )}
        {topScores[0]?.score === score.points && !isPerfectScore && (
          <span className="result__highscore-badge">nouveau highscore</span>
        )}
      </header>

      {/* Main Content */}
      <main className="result__main">
        {/* Game Summary Section - 50% */}
        <section className="result__section result__section--summary">
          <GameSummary
            capitalsFound={stats.capitalsFound}
            capitalsTotal={stats.flagsAsked}
            flagsCorrect={stats.flagsCorrect}
            flagsTotal={stats.flagsAsked}
            failedCountries={failedCountries}
            score={score.points}
            maxCombo={maxCombo}
          />
        </section>

        {/* Separator */}
        <div className="result__separator" />

        {/* High Scores Section - 50% */}
        <section className="result__section result__section--highscores">
          <HighScores scores={topScores} currentScore={score.points} />
        </section>
      </main>

      {/* Actions */}
      <footer className="result__actions">
        <button
          className="action-button action-button--primary"
          onClick={reset}
        >
          Recommencer
        </button>
      </footer>
    </div>
  );
}
