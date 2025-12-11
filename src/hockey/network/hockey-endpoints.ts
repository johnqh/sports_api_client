/**
 * API-Hockey endpoint constants
 */

/**
 * Base URL for API-Hockey direct access
 */
export const HOCKEY_API_BASE_URL = "https://v1.hockey.api-sports.io";

/**
 * RapidAPI host for API-Hockey
 */
export const HOCKEY_RAPIDAPI_HOST = "api-hockey.p.rapidapi.com";

/**
 * API-Hockey endpoints
 */
export const HOCKEY_ENDPOINTS = {
  // General
  TIMEZONE: "/timezone",
  COUNTRIES: "/countries",
  SEASONS: "/seasons",

  // Leagues
  LEAGUES: "/leagues",

  // Teams
  TEAMS: "/teams",
  TEAMS_STATISTICS: "/teams/statistics",

  // Games
  GAMES: "/games",
  GAMES_HEAD_TO_HEAD: "/games/h2h",
  GAMES_STATISTICS: "/games/statistics",

  // Standings
  STANDINGS: "/standings",
} as const;

/**
 * Default headers for API-Hockey requests
 */
export const HOCKEY_DEFAULT_HEADERS: Record<string, string> = {
  "Content-Type": "application/json",
  Accept: "application/json",
} as const;
