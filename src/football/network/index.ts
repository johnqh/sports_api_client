/**
 * @fileoverview Network module exports for API-Football.
 *
 * Exports the API client class, factory function, endpoint definitions,
 * and default configuration constants.
 */

export {
  ApiFootballClient,
  createApiFootballClient,
} from "./api-football-client";
export {
  FOOTBALL_API_BASE_URL,
  FOOTBALL_RAPIDAPI_HOST,
  FOOTBALL_ENDPOINTS,
  FOOTBALL_DEFAULT_HEADERS,
} from "./football-endpoints";
