/**
 * @module volleyball/network/volleyball-endpoints
 * @description API endpoints for API-Volleyball
 */

/**
 * Base URL for API-Volleyball v1
 */
export const VOLLEYBALL_API_BASE_URL = "https://v1.volleyball.api-sports.io";

/**
 * RapidAPI host for API-Volleyball
 */
export const VOLLEYBALL_RAPIDAPI_HOST = "api-volleyball.p.rapidapi.com";

/**
 * API-Volleyball endpoints
 */
export const VOLLEYBALL_ENDPOINTS = {
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
} as const;

/**
 * Default headers for API-Volleyball
 */
export const VOLLEYBALL_DEFAULT_HEADERS = {
  "x-rapidapi-host": VOLLEYBALL_RAPIDAPI_HOST,
} as const;
