import { useState, useCallback, useEffect, useRef } from "react";
import { useGame } from "../../contexts";
import { getFlagUrl } from "../../utils";
import { GameHeader } from "../GameHeader";
import "./Question.scss";

// =============================================================================
// Types
// =============================================================================

type QuestionStep =
  | "FlagQuestion"
  | "FlagResult"
  | "CapitalQuestion"
  | "CapitalResult"
  | "Summary";

// =============================================================================
// Constants
// =============================================================================

const FLAG_MULTIPLIERS: Record<number, number> = {
  1: 1,
  2: 1.25,
  3: 1.5,
  4: 2,
  5: 3,
};

const FLAG_WRONG_MULTIPLIER_LEVEL_1 = 0.75;
const SUMMARY_DELAY_SUCCESS_MS = 5000;
const SUMMARY_DELAY_ERROR_MS = 3000;

function calculateMultiplier(flagLevel: number, foundFlag: boolean): number {
  if (flagLevel === 1) {
    return foundFlag ? FLAG_MULTIPLIERS[1] : FLAG_WRONG_MULTIPLIER_LEVEL_1;
  }
  return foundFlag ? (FLAG_MULTIPLIERS[flagLevel] ?? 1) : 1;
}

// =============================================================================
// Component
// =============================================================================

export function Question() {
  const { currentCountry, nextCountry, combo, life } = useGame();
  const [step, setStep] = useState<QuestionStep>("FlagQuestion");
  const [foundFlag, setFoundFlag] = useState(false);
  const [foundCapital, setFoundCapital] = useState(false);
  const [comboAtAnswer, setComboAtAnswer] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flagUrl = getFlagUrl(currentCountry.iso);

  // Calculate multiplier for display
  const multiplier = calculateMultiplier(currentCountry.flagLevel, foundFlag);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // ===========================================================================
  // Handlers
  // ===========================================================================

  const handleRevealCountry = useCallback(() => {
    setStep("FlagResult");
  }, []);

  const handleFlagResult = useCallback((correct: boolean) => {
    setFoundFlag(correct);
    setStep("CapitalQuestion");
  }, []);

  const handleRevealCapital = useCallback(() => {
    setStep("CapitalResult");
  }, []);

  const handleCapitalResult = useCallback(
    (correct: boolean) => {
      setFoundCapital(correct);
      // Store combo at the moment of answer (before it gets updated)
      setComboAtAnswer(correct ? combo + 1 : 0);
      setStep("Summary");

      // Auto advance after delay (shorter for errors)
      const delay = correct ? SUMMARY_DELAY_SUCCESS_MS : SUMMARY_DELAY_ERROR_MS;
      timerRef.current = setTimeout(() => {
        nextCountry({ foundFlag, foundCapital: correct });
        // Reset for next country
        setStep("FlagQuestion");
        setFoundFlag(false);
        setFoundCapital(false);
        setComboAtAnswer(0);
      }, delay);
    },
    [nextCountry, foundFlag, combo],
  );

  // ===========================================================================
  // Render helpers
  // ===========================================================================

  // Check which elements should be visible based on step progression
  const showCountryName = step !== "FlagQuestion";
  const showFlagButtons = step === "FlagResult";
  const showCapitalSection = [
    "CapitalQuestion",
    "CapitalResult",
    "Summary",
  ].includes(step);
  const showCapitalName = ["CapitalResult", "Summary"].includes(step);
  const showCapitalButtons = step === "CapitalResult";
  const showSummary = step === "Summary";

  // Determine color state for country/capital names
  const countryNameClass =
    step === "FlagResult" ? "pending" : foundFlag ? "success" : "error";
  const capitalNameClass =
    step === "CapitalResult" ? "pending" : foundCapital ? "success" : "error";

  // Calculate points for display in summary
  const pointsEarned = foundCapital
    ? comboAtAnswer + currentCountry.capitalLevel * multiplier
    : 0;

  const renderContent = () => {
    return (
      <div className="question__content">
        {/* Flag - always visible */}
        {flagUrl && (
          <img
            src={flagUrl}
            alt={
              showCountryName
                ? `Drapeau de ${currentCountry.name}`
                : "Drapeau à identifier"
            }
            className="question__flag"
          />
        )}

        {/* Country name - appears after FlagQuestion */}
        {showCountryName ? (
          <div className="question__country-result">
            <span
              className={`question__country-name question__country-name--${countryNameClass}`}
            >
              {currentCountry.name}
            </span>
            {step !== "FlagResult" && multiplier !== 1 && (
              <div className="question__multiplier-badge">
                <span className="question__multiplier-label">
                  {multiplier < 1 ? "malus" : "bonus"}
                </span>
                <span className="question__multiplier-value">
                  ×{multiplier}
                </span>
              </div>
            )}
          </div>
        ) : (
          <p className="question__prompt">Quel est ce pays ?</p>
        )}

        {/* Separator and Capital section */}
        {showCapitalSection && (
          <>
            <div className="question__separator" />
            {showCapitalName ? (
              <span
                className={`question__capital-name question__capital-name--${capitalNameClass}`}
              >
                {currentCountry.capital}
              </span>
            ) : (
              <p className="question__prompt">Quelle est la capitale ?</p>
            )}
          </>
        )}

        {/* Summary with point calculation */}
        {showSummary && (
          <div className="question__summary">
            {foundCapital ? (
              <div className="question__points-calc">
                <div className="question__points-row">
                  <div className="question__points-item">
                    <span className="question__points-value">
                      {currentCountry.capitalLevel}
                    </span>
                    <span className="question__points-label">Difficulté</span>
                  </div>
                  <span className="question__points-operator">×</span>
                  <div className="question__points-item">
                    <span className="question__points-value">{multiplier}</span>
                    <span className="question__points-label">Multi.</span>
                  </div>
                  <span className="question__points-operator">+</span>
                  <div className="question__points-item">
                    <span className="question__points-value">
                      {comboAtAnswer}
                    </span>
                    <span className="question__points-label">Combo</span>
                  </div>
                  <span className="question__points-operator">=</span>
                  <div className="question__points-item question__points-item--total">
                    <span className="question__points-value">
                      +{Math.floor(pointsEarned)}
                    </span>
                    <span className="question__points-label">Total</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="question__heart-break">
                <span className="question__heart-half question__heart-half--left">
                  💔
                </span>
                <span className="question__heart-half question__heart-half--right">
                  💔
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderActions = () => {
    if (step === "FlagQuestion") {
      return (
        <button
          className="action-button action-button--primary"
          onClick={handleRevealCountry}
        >
          Révéler
        </button>
      );
    }

    if (showFlagButtons) {
      return (
        <div className="action-buttons-row">
          <button
            className="action-button action-button--success"
            onClick={() => handleFlagResult(true)}
          >
            Correct
          </button>
          <button
            className="action-button action-button--error"
            onClick={() => handleFlagResult(false)}
          >
            Faux
          </button>
        </div>
      );
    }

    if (step === "CapitalQuestion") {
      return (
        <button
          className="action-button action-button--primary"
          onClick={handleRevealCapital}
        >
          Révéler
        </button>
      );
    }

    if (showCapitalButtons) {
      return (
        <div className="action-buttons-row">
          <button
            className="action-button action-button--success"
            onClick={() => handleCapitalResult(true)}
          >
            Correct
          </button>
          <button
            className="action-button action-button--error"
            onClick={() => handleCapitalResult(false)}
          >
            Faux
          </button>
        </div>
      );
    }

    // Summary step - countdown bar + manual next button
    if (showSummary) {
      const handleManualNext = () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        nextCountry({ foundFlag, foundCapital });
        setStep("FlagQuestion");
        setFoundFlag(false);
        setFoundCapital(false);
        setComboAtAnswer(0);
      };

      const countdownDuration = foundCapital
        ? SUMMARY_DELAY_SUCCESS_MS
        : SUMMARY_DELAY_ERROR_MS;

      return (
        <div className="question__summary-actions">
          <div className="question__countdown">
            <div
              className="question__countdown-bar"
              style={
                {
                  "--countdown-duration": `${countdownDuration}ms`,
                } as React.CSSProperties
              }
            />
          </div>
          <button
            className="action-button action-button--primary action-button--small"
            onClick={handleManualNext}
          >
            {!foundCapital && life <= 1 ? "Résultat" : "Question suivante"}
          </button>
        </div>
      );
    }

    return null;
  };

  // ===========================================================================
  // Main render
  // ===========================================================================

  return (
    <div className="question">
      <GameHeader />

      <main className="question__main">{renderContent()}</main>

      <footer className="question__actions">{renderActions()}</footer>
    </div>
  );
}
