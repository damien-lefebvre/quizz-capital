import { useGame } from "../../contexts";
import { useGameHistory } from "../../hooks";
import { AnimatedScore } from "../AnimatedScore";
import "./GameHeader.scss";

// =============================================================================
// Types
// =============================================================================

type RankCategory = "first-try" | "total" | "recent";

interface RankResult {
  rank: number;
  category: RankCategory;
}

// =============================================================================
// Helper Functions
// =============================================================================

function getRankInList(
  currentScore: number,
  scores: { score: number }[],
): number | null {
  if (currentScore <= 0) return null;

  let rank = 1;
  for (const record of scores) {
    if (currentScore > record.score) {
      break;
    }
    rank++;
  }

  return rank <= 5 ? rank : null;
}

function getBestRank(
  currentScore: number,
  isFirstTryOfDay: boolean,
  topScores: { score: number }[],
  firstTryScores: { score: number }[],
  recentScores: { score: number }[],
): RankResult | null {
  // Priority: first-try > total > recent
  // Check first-try only if this is the first game of the day
  if (isFirstTryOfDay) {
    const firstTryRank = getRankInList(currentScore, firstTryScores);
    if (firstTryRank !== null) {
      return { rank: firstTryRank, category: "first-try" };
    }
  }

  const totalRank = getRankInList(currentScore, topScores);
  if (totalRank !== null) {
    return { rank: totalRank, category: "total" };
  }

  const recentRank = getRankInList(currentScore, recentScores);
  if (recentRank !== null) {
    return { rank: recentRank, category: "recent" };
  }

  return null;
}

// =============================================================================
// Component
// =============================================================================

export function GameHeader() {
  const { score, combo, life, stats, reset } = useGame();
  const { getTopScores, getFirstTryScores, getRecentScores, history } =
    useGameHistory();

  // Get scores for each category
  const topScores = getTopScores(10);
  const firstTryScores = getFirstTryScores(10);
  const recentScores = getRecentScores(10);

  // Check if this is the first game of the day
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const isFirstTryOfDay = !history.some((record) => {
    const recordDate = new Date(record.date);
    const recordKey = `${recordDate.getFullYear()}-${String(recordDate.getMonth() + 1).padStart(2, "0")}-${String(recordDate.getDate()).padStart(2, "0")}`;
    return recordKey === todayKey;
  });

  // Calculate best rank across all categories
  const rankResult = getBestRank(
    score.points,
    isFirstTryOfDay,
    topScores,
    firstTryScores,
    recentScores,
  );

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
            {rankResult && (
              <span
                key={`${rankResult.rank}-${rankResult.category}`}
                className={`game-header__rank game-header__rank--${rankResult.category}`}
              >
                #{rankResult.rank}
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
      <div className="game-header__lives-row">
        <button
          className="game-header__button"
          //          onClick={() =}
          aria-label="Accéder aux statistiques"
          title="Statistiques"
        >
          ↻
        </button>
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
        <button
          className="game-header__button"
          onClick={reset}
          aria-label="Recommencer la partie"
          title="Recommencer"
        >
          ↻
        </button>
      </div>
    </header>
  );
}
