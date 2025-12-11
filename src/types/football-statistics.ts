/**
 * Additional statistics types
 * Re-exports and additional stat-related types
 */

import type { Optional } from "@sudobility/types";

/**
 * Generic statistic value that can be number, string, or percentage
 */
export type FootballStatValue = Optional<number | string>;

/**
 * Percentage statistic with value and percentage
 */
export interface FootballPercentageStat {
  /** Absolute value */
  total: Optional<number>;
  /** Percentage string (e.g., "45%") */
  percentage: Optional<string>;
}

/**
 * Minute range statistic breakdown
 */
export interface FootballMinuteStats {
  "0-15": FootballPercentageStat;
  "16-30": FootballPercentageStat;
  "31-45": FootballPercentageStat;
  "46-60": FootballPercentageStat;
  "61-75": FootballPercentageStat;
  "76-90": FootballPercentageStat;
  "91-105": FootballPercentageStat;
  "106-120": FootballPercentageStat;
}

/**
 * Common statistic types for fixture statistics
 */
export type FootballFixtureStatType =
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
export type FootballPlayerPosition =
  | "Goalkeeper"
  | "Defender"
  | "Midfielder"
  | "Attacker";

/**
 * Card type
 */
export type FootballCardType = "Yellow Card" | "Red Card" | "Yellow/Red Card";

/**
 * Goal type
 */
export type FootballGoalType =
  | "Normal Goal"
  | "Own Goal"
  | "Penalty"
  | "Missed Penalty";

/**
 * Event type
 */
export type FootballEventType = "Goal" | "Card" | "subst" | "Var";

/**
 * VAR decision types
 */
export type FootballVarDecision =
  | "Goal cancelled"
  | "Penalty confirmed"
  | "Goal confirmed"
  | "Card upgrade"
  | "Penalty cancelled";
