/**
 * @module handball/network/handball-endpoints
 * @description API endpoints for API-Handball
 */

/**
 * Base URL for API-Handball v1
 */
export const HANDBALL_API_BASE_URL = "https://v1.handball.api-sports.io";

/**
 * RapidAPI host for API-Handball
 */
export const HANDBALL_RAPIDAPI_HOST = "api-handball.p.rapidapi.com";

/**
 * API-Handball endpoints
 */
export const HANDBALL_ENDPOINTS = {
  /** Get available timezones */
  TIMEZONE: "/timezone",
  /** Get countries */
  COUNTRIES: "/countries",
  /** Get seasons */
  SEASONS: "/seasons",
  /** Get leagues */
  LEAGUES: "/leagues",
  /** Get teams */
  TEAMS: "/teams",
  /** Get standings */
  STANDINGS: "/standings",
  /** Get games */
  GAMES: "/games",
  /** Get head-to-head */
  H2H: "/games/h2h",
  /** Get odds */
  ODDS: "/odds",
} as const;

/**
 * Default headers for API-Handball
 */
export const HANDBALL_DEFAULT_HEADERS = {
  "x-rapidapi-host": HANDBALL_RAPIDAPI_HOST,
} as const;
