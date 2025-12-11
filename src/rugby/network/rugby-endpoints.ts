/**
 * @module rugby/network/rugby-endpoints
 * @description API-Rugby endpoint definitions
 */

/**
 * Base URL for API-Rugby
 */
export const RUGBY_API_BASE_URL = "https://v1.rugby.api-sports.io";

/**
 * RapidAPI host for API-Rugby
 */
export const RUGBY_RAPIDAPI_HOST = "api-rugby.p.rapidapi.com";

/**
 * Default headers for API-Rugby requests
 */
export const RUGBY_DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

/**
 * API-Rugby endpoint paths
 */
export const RUGBY_ENDPOINTS = {
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
