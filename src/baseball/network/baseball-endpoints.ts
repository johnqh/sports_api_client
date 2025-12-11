/**
 * @module baseball/network/baseball-endpoints
 * @description API-Baseball endpoint definitions
 */

/**
 * Base URL for API-Baseball
 */
export const BASEBALL_API_BASE_URL = "https://v1.baseball.api-sports.io";

/**
 * RapidAPI host for API-Baseball
 */
export const BASEBALL_RAPIDAPI_HOST = "api-baseball.p.rapidapi.com";

/**
 * Default headers for API-Baseball requests
 */
export const BASEBALL_DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

/**
 * API-Baseball endpoint paths
 */
export const BASEBALL_ENDPOINTS = {
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

  // Standings
  STANDINGS: "/standings",
} as const;
