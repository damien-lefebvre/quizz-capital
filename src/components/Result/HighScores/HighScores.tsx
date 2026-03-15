import { useState, useMemo } from "react";
import type { GameRecord } from "../../../hooks";
import { countries } from "../../../countries";
import "./HighScores.scss";

// =============================================================================
// Types
// =============================================================================

type TabType = "first-try" | "total" | "three-months";

interface HighScoresProps {
  history: GameRecord[];
  currentRecordId?: string;
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

function isPerfectScore(record: GameRecord): boolean {
  return (
    record.capitalsFound === countries.length &&
    record.capitalsFound === record.capitalsAttempted &&
    record.flagsFound === record.flagsAttempted
  );
}

function getDateKey(isoDate: string): string {
  const date = new Date(isoDate);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function getFirstTryScores(history: GameRecord[]): GameRecord[] {
  // Group by date, keep only the first (earliest) game per day that has at least one capital found
  const byDate = new Map<string, GameRecord>();

  // Sort by date ascending to find first game of each day
  const sorted = [...history].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  for (const record of sorted) {
    const dateKey = getDateKey(record.date);
    // Keep only the first game of each day (first attempt)
    if (!byDate.has(dateKey) && record.capitalsFound > 0) {
      byDate.set(dateKey, record);
    }
  }

  return [...byDate.values()].sort((a, b) => b.score - a.score);
}

function getThreeMonthsScores(history: GameRecord[]): GameRecord[] {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  return history
    .filter((record) => new Date(record.date) >= threeMonthsAgo)
    .sort((a, b) => b.score - a.score);
}

// =============================================================================
// Component
// =============================================================================

const TABS: { id: TabType; label: string }[] = [
  { id: "first-try", label: "Premier essai" },
  { id: "total", label: "Total" },
  { id: "three-months", label: "Récent" },
];

export function HighScores({ history, currentRecordId }: HighScoresProps) {
  const [activeTab, setActiveTab] = useState<TabType>("total");

  // Find current record to get its score
  const currentRecord = currentRecordId
    ? history.find((r) => r.id === currentRecordId)
    : undefined;

  // Calculate rank for each category
  const getRankInCategory = (categoryScores: GameRecord[]): number | null => {
    if (!currentRecord) return null;
    const index = categoryScores.findIndex((r) => r.id === currentRecordId);
    if (index === -1 || index >= 5) return null;
    return index + 1;
  };

  // Pre-calculate scores for each category
  const firstTryScoresList = useMemo(
    () => getFirstTryScores(history),
    [history],
  );
  const totalScoresList = useMemo(
    () => [...history].sort((a, b) => b.score - a.score),
    [history],
  );
  const threeMonthsScoresList = useMemo(
    () => getThreeMonthsScores(history),
    [history],
  );

  // Get rank for each tab
  const tabRanks: Record<TabType, number | null> = {
    "first-try": getRankInCategory(firstTryScoresList),
    total: getRankInCategory(totalScoresList),
    "three-months": getRankInCategory(threeMonthsScoresList),
  };

  const scores = useMemo(() => {
    let filtered: GameRecord[];
    switch (activeTab) {
      case "first-try":
        filtered = firstTryScoresList;
        break;
      case "three-months":
        filtered = threeMonthsScoresList;
        break;
      case "total":
      default:
        filtered = totalScoresList;
    }
    return filtered.slice(0, 10);
  }, [activeTab, firstTryScoresList, totalScoresList, threeMonthsScoresList]);

  return (
    <div className="high-scores">
      {/* Tabs */}
      <div className="high-scores__tabs">
        {TABS.map((tab) => {
          const rank = tabRanks[tab.id];
          return (
            <button
              key={tab.id}
              className={`high-scores__tab high-scores__tab--${tab.id} ${
                activeTab === tab.id ? "high-scores__tab--active" : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {rank && (
                <span
                  className={`high-scores__tab-rank high-scores__tab-rank--${tab.id}`}
                >
                  #{rank}
                </span>
              )}
              <span className="high-scores__tab-label">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {scores.length === 0 ? (
        <p className="high-scores__empty">Aucun score enregistré</p>
      ) : (
        <>
          {/* Table Header */}
          <div className="high-scores__header">
            <span className="high-scores__col high-scores__col--rank"></span>
            <span className="high-scores__col high-scores__col--date"></span>
            <span className="high-scores__col high-scores__col--stat">
              Cap.
            </span>
            <span className="high-scores__col high-scores__col--stat">
              Drap.
            </span>
            <span className="high-scores__col high-scores__col--combo">
              Combo
            </span>
            <span className="high-scores__col high-scores__col--score">
              Score
            </span>
          </div>

          {/* Scores List */}
          <div className="high-scores__list">
            {scores.map((record, index) => {
              const isCurrent =
                currentRecordId !== undefined && record.id === currentRecordId;
              const rank = index + 1;
              const perfect = isPerfectScore(record);

              return (
                <div
                  key={record.id}
                  className={`high-scores__row ${isCurrent ? "high-scores__row--current" : ""} ${perfect ? "high-scores__row--perfect" : ""}`}
                >
                  {/* Rank */}
                  <div className="high-scores__col high-scores__col--rank">
                    <span
                      className={`high-scores__rank high-scores__rank--${activeTab}`}
                    >
                      #{rank}
                    </span>
                  </div>

                  {/* Date */}
                  <div className="high-scores__col high-scores__col--date">
                    <span className="high-scores__date">
                      {formatDate(record.date)}
                    </span>
                  </div>

                  {perfect ? (
                    /* Perfect Score - spans all stats columns */
                    <div className="high-scores__col high-scores__col--perfect">
                      <span className="high-scores__perfect-label">
                        ✨ Perfect Score ✨
                      </span>
                    </div>
                  ) : (
                    <>
                      {/* Capitals */}
                      <div className="high-scores__col high-scores__col--stat">
                        <span
                          className={`high-scores__fraction ${record.capitalsFound === countries.length ? `high-scores__fraction--perfect high-scores__fraction--${activeTab}` : ""}`}
                        >
                          <span className="high-scores__fraction-primary">
                            {record.capitalsFound}
                          </span>
                        </span>
                      </div>

                      {/* Flags */}
                      <div className="high-scores__col high-scores__col--stat">
                        <span
                          className={`high-scores__percent ${record.flagsFound === record.flagsAttempted && record.flagsAttempted > 0 ? `high-scores__percent--perfect high-scores__percent--${activeTab}` : ""}`}
                        >
                          {formatPercent(
                            record.flagsFound,
                            record.flagsAttempted,
                          )}
                        </span>
                      </div>

                      {/* Combo */}
                      <div className="high-scores__col high-scores__col--combo">
                        <span
                          className={`high-scores__combo-value ${record.maxCombo === countries.length ? `high-scores__combo-value--perfect high-scores__combo-value--${activeTab}` : ""}`}
                        >
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
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
