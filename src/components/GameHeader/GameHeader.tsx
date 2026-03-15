import { useGame } from "../../contexts";
import { useGameHistory } from "../../hooks";
import { AnimatedScore } from "../AnimatedScore";
import "./GameHeader.scss";

// =============================================================================
// Helper Functions
// =============================================================================

function getCurrentRank(
  currentScore: number,
  topScores: { score: number }[],
): number | null {
  if (currentScore <= 0) return null;

  // Find where current score would rank (1-indexed)
  let rank = 1;
  for (const record of topScores) {
    if (currentScore > record.score) {
      break;
    }
    rank++;
  }

  // Only return rank if it's in top 5
  return rank <= 5 ? rank : null;
}

// =============================================================================
// Component
// =============================================================================

export function GameHeader() {
  const { score, combo, life, stats } = useGame();
  const { getTopScores } = useGameHistory();

  // Calculate current rank in top 10
  const topScores = getTopScores(10);
  const currentRank = getCurrentRank(score.points, topScores);

  // Check if game has started (at least one question asked)
  const gameStarted = stats.flagsAsked > 0;

  // Calculate flag percentage (avoid division by zero)
  const flagPercentage = gameStarted
    ? Math.floor((stats.flagsCorrect / stats.flagsAsked) * 100)
        .toString()
        .padStart(2, " ")
    : "-";

  // Format combo display (show "-" when 0 or not started)
  const comboDisplay = combo > 0 ? combo : "-";

  return (
    <header className="game-header">
      {/* Top row with stats */}
      <div className="game-header__row">
        {/* Left section - Capitals and Flags as text lines */}
        <div className="game-header__left">
          <div className="game-header__stat-line">
            <span className="game-header__stat-value">
              {gameStarted ? (
                <span className="game-header__stat-primary">
                  {stats.capitalsFound}
                </span>
              ) : (
                "-"
              )}
            </span>
            <span className="game-header__stat-label">Capitales</span>
          </div>
          <div className="game-header__stat-line">
            <span className="game-header__stat-value">
              {gameStarted ? (
                <>
                  <span className="game-header__stat-primary">
                    {flagPercentage}
                  </span>
                  <span className="game-header__stat-secondary">%</span>
                </>
              ) : (
                "-"
              )}
            </span>
            <span className="game-header__stat-label">Drapeau</span>
          </div>
        </div>

        {/* Center section - Score */}
        <div className="game-header__center">
          <div className="game-header__score-label-container">
            {currentRank && (
              <span key={currentRank} className="game-header__rank">
                #{currentRank}
              </span>
            )}
            <span className="game-header__score-label">Score</span>
          </div>
          <AnimatedScore
            value={score.points}
            className="game-header__score-value"
          />
        </div>

        {/* Right section - Combo */}
        <div className="game-header__right">
          <span className="game-header__combo-label">Combo</span>
          <span
            key={combo}
            className="game-header__combo-value"
            data-active={combo > 0}
          >
            {comboDisplay}
            {combo > 0 && " 🔥"}
          </span>
        </div>
      </div>

      {/* Lives row */}
      <div className="game-header__lives">
        {Array.from({ length: 5 }, (_, i) => (
          <span
            key={i}
            className={`game-header__heart ${i < life ? "game-header__heart--active" : "game-header__heart--empty"}`}
          >
            {i < life ? "❤️" : "🖤"}
          </span>
        ))}
      </div>
    </header>
  );
}
