import { useGame } from "../../contexts";
import "./GameHeader.scss";

// =============================================================================
// Component
// =============================================================================

export function GameHeader() {
  const { score, combo, life, stats } = useGame();

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
                <>
                  <span className="game-header__stat-primary">
                    {stats.capitalsFound}
                  </span>
                  <span className="game-header__stat-secondary">
                    /{stats.flagsAsked}
                  </span>
                </>
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
          <span className="game-header__score-label">Score</span>
          <span className="game-header__score-value">
            {Math.floor(score.points)}
          </span>
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
