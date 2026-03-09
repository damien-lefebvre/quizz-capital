import { useEffect, useRef, useState } from "react";
import "./AnimatedScore.scss";

// =============================================================================
// Types
// =============================================================================

interface AnimatedScoreProps {
  value: number;
  className?: string;
}

// =============================================================================
// Constants
// =============================================================================

// Duration of the entire animation in milliseconds
const ANIMATION_DURATION = 400;
// Minimum step duration to ensure animation is visible
const MIN_STEP_DURATION = 15;
// Maximum number of steps to keep animation smooth
const MAX_STEPS = 25;

// =============================================================================
// Component
// =============================================================================

export function AnimatedScore({ value, className = "" }: AnimatedScoreProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const previousValueRef = useRef(value);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const previousValue = previousValueRef.current;
    const targetValue = Math.floor(value);

    // Skip animation if value hasn't changed or decreased
    if (targetValue <= previousValue) {
      setDisplayValue(targetValue);
      previousValueRef.current = targetValue;
      return;
    }

    // Cancel any ongoing animation
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
    }

    const difference = targetValue - previousValue;

    // Calculate number of steps and duration per step
    const steps = Math.min(difference, MAX_STEPS);
    const stepDuration = Math.max(
      ANIMATION_DURATION / steps,
      MIN_STEP_DURATION,
    );
    const increment = difference / steps;

    let currentStep = 0;
    let lastTimestamp: number | null = null;

    const animate = (timestamp: number) => {
      if (lastTimestamp === null) {
        lastTimestamp = timestamp;
      }

      const elapsed = timestamp - lastTimestamp;

      if (elapsed >= stepDuration) {
        currentStep++;
        const newValue = Math.min(
          Math.floor(previousValue + increment * currentStep),
          targetValue,
        );
        setDisplayValue(newValue);
        lastTimestamp = timestamp;

        if (currentStep >= steps || newValue >= targetValue) {
          setDisplayValue(targetValue);
          previousValueRef.current = targetValue;
          animationRef.current = null;
          return;
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value]);

  const isAnimating = displayValue !== Math.floor(value);

  return (
    <span
      className={`animated-score ${className}`.trim()}
      data-animating={isAnimating}
    >
      {displayValue}
    </span>
  );
}
