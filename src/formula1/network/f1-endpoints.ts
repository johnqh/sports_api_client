/**
 * @module formula1/network/f1-endpoints
 * @description API-Formula-1 endpoint definitions
 */

/**
 * Base URL for API-Formula-1
 */
export const F1_API_BASE_URL = "https://v1.formula-1.api-sports.io";

/**
 * RapidAPI host for API-Formula-1
 */
export const F1_RAPIDAPI_HOST = "api-formula-1.p.rapidapi.com";

/**
 * Default headers for API-Formula-1 requests
 */
export const F1_DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

/**
 * API-Formula-1 endpoint paths
 */
export const F1_ENDPOINTS = {
  // General
  TIMEZONE: "/timezone",
  SEASONS: "/seasons",

  // Circuits
  CIRCUITS: "/circuits",

  // Competitions
  COMPETITIONS: "/competitions",

  // Teams
  TEAMS: "/teams",

  // Drivers
  DRIVERS: "/drivers",

  // Races
  RACES: "/races",

  // Rankings
  RANKINGS_DRIVERS: "/rankings/drivers",
  RANKINGS_TEAMS: "/rankings/teams",

  // Pit Stops
  PITSTOPS: "/pitstops",
} as const;
