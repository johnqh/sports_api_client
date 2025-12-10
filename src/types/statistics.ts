/**
 * Additional statistics types
 * Re-exports and additional stat-related types
 */

import type { Optional } from "@sudobility/types";

/**
 * Generic statistic value that can be number, string, or percentage
 */
export type StatValue = Optional<number | string>;

/**
 * Percentage statistic with value and percentage
 */
export interface PercentageStat {
  /** Absolute value */
  total: Optional<number>;
  /** Percentage string (e.g., "45%") */
  percentage: Optional<string>;
}

/**
 * Minute range statistic breakdown
 */
export interface MinuteStats {
  "0-15": PercentageStat;
  "16-30": PercentageStat;
  "31-45": PercentageStat;
  "46-60": PercentageStat;
  "61-75": PercentageStat;
  "76-90": PercentageStat;
  "91-105": PercentageStat;
  "106-120": PercentageStat;
}

/**
 * Common statistic types for fixture statistics
 */
export type FixtureStatType =
  | "Shots on Goal"
  | "Shots off Goal"
  | "Total Shots"
  | "Blocked Shots"
  | "Shots insidebox"
  | "Shots outsidebox"
  | "Fouls"
  | "Corner Kicks"
  | "Offsides"
  | "Ball Possession"
  | "Yellow Cards"
  | "Red Cards"
  | "Goalkeeper Saves"
  | "Total passes"
  | "Passes accurate"
  | "Passes %"
  | "expected_goals";

/**
 * Player position types
 */
export type PlayerPosition =
  | "Goalkeeper"
  | "Defender"
  | "Midfielder"
  | "Attacker";

/**
 * Card type
 */
export type CardType = "Yellow Card" | "Red Card" | "Yellow/Red Card";

/**
 * Goal type
 */
export type GoalType =
  | "Normal Goal"
  | "Own Goal"
  | "Penalty"
  | "Missed Penalty";

/**
 * Event type
 */
export type EventType = "Goal" | "Card" | "subst" | "Var";

/**
 * VAR decision types
 */
export type VarDecision =
  | "Goal cancelled"
  | "Penalty confirmed"
  | "Goal confirmed"
  | "Card upgrade"
  | "Penalty cancelled";
