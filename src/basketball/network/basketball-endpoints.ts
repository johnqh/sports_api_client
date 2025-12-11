/**
 * API-Basketball endpoint constants
 */

/**
 * Base URL for API-Basketball direct access
 */
export const BASKETBALL_API_BASE_URL = "https://v1.basketball.api-sports.io";

/**
 * RapidAPI host for API-Basketball
 */
export const BASKETBALL_RAPIDAPI_HOST = "api-basketball.p.rapidapi.com";

/**
 * API-Basketball endpoints
 */
export const BASKETBALL_ENDPOINTS = {
  // General
  TIMEZONE: "/timezone",
  COUNTRIES: "/countries",
  SEASONS: "/seasons",

  // Leagues
  LEAGUES: "/leagues",

  // Teams
  TEAMS: "/teams",
  TEAMS_STATISTICS: "/statistics",

  // Games
  GAMES: "/games",
  GAMES_HEAD_TO_HEAD: "/games/h2h",

  // Standings
  STANDINGS: "/standings",
} as const;

/**
 * Default headers for API-Basketball requests
 */
export const BASKETBALL_DEFAULT_HEADERS: Record<string, string> = {
  "Content-Type": "application/json",
  Accept: "application/json",
} as const;
