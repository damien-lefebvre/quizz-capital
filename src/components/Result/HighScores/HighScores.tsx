import type { GameRecord } from "../../../hooks";
import "./HighScores.scss";

// =============================================================================
// Types
// =============================================================================

interface HighScoresProps {
  scores: GameRecord[];
  currentScore?: number;
}

// =============================================================================
// Helper Functions
// =============================================================================

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

function formatPercent(found: number, total: number): string {
  if (total === 0) return "0%";
  return `${Math.round((found / total) * 100)}%`;
}

// =============================================================================
// Component
// =============================================================================

export function HighScores({ scores, currentScore }: HighScoresProps) {
  if (scores.length === 0) {
    return (
      <div className="high-scores">
        <h3 className="high-scores__title">Meilleurs scores</h3>
        <p className="high-scores__empty">Aucun score enregistré</p>
      </div>
    );
  }

  return (
    <div className="high-scores">
      <h3 className="high-scores__title">Meilleurs scores</h3>

      {/* Table Header */}
      <div className="high-scores__header">
        <span className="high-scores__col high-scores__col--rank"></span>
        <span className="high-scores__col high-scores__col--stat">
          Capitales
        </span>
        <span className="high-scores__col high-scores__col--stat">
          Drapeaux
        </span>
        <span className="high-scores__col high-scores__col--combo">Combo</span>
        <span className="high-scores__col high-scores__col--score">Score</span>
      </div>

      {/* Scores List */}
      <div className="high-scores__list">
        {scores.map((record, index) => {
          const isCurrent =
            currentScore !== undefined && record.score === currentScore;
          const rank = index + 1;

          return (
            <div
              key={record.id}
              className={`high-scores__row ${isCurrent ? "high-scores__row--current" : ""}`}
            >
              {/* Rank + Date */}
              <div className="high-scores__col high-scores__col--rank">
                <span className="high-scores__rank">#{rank}</span>
                <span className="high-scores__date">
                  {formatDate(record.date)}
                </span>
              </div>

              {/* Capitals */}
              <div className="high-scores__col high-scores__col--stat">
                <span className="high-scores__fraction">
                  <span className="high-scores__fraction-primary">
                    {record.capitalsFound}
                  </span>
                  <span className="high-scores__fraction-secondary">
                    /{record.capitalsAttempted}
                  </span>
                </span>
              </div>

              {/* Flags */}
              <div className="high-scores__col high-scores__col--stat">
                <span className="high-scores__percent">
                  {formatPercent(record.flagsFound, record.flagsAttempted)}
                </span>
              </div>

              {/* Combo */}
              <div className="high-scores__col high-scores__col--combo">
                <span className="high-scores__combo-value">
                  {record.maxCombo}
                </span>
                <span className="high-scores__combo-icon">🔥</span>
              </div>

              {/* Score */}
              <div className="high-scores__col high-scores__col--score">
                <span className="high-scores__score-value">
                  {Math.floor(record.score)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
