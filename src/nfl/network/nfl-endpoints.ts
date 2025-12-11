/**
 * API-American-Football (NFL) endpoint constants
 */

/**
 * Base URL for API-NFL direct access
 */
export const NFL_API_BASE_URL = "https://v1.american-football.api-sports.io";

/**
 * RapidAPI host for API-NFL
 */
export const NFL_RAPIDAPI_HOST = "api-american-football.p.rapidapi.com";

/**
 * API-NFL endpoints
 */
export const NFL_ENDPOINTS = {
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
 * Default headers for API-NFL requests
 */
export const NFL_DEFAULT_HEADERS: Record<string, string> = {
  "Content-Type": "application/json",
  Accept: "application/json",
} as const;
