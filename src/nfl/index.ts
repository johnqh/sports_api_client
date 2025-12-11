/**
 * @module nfl
 * @description API-NFL (American Football) client library exports
 *
 * Provides type-safe access to the API-American-Football API with React hooks,
 * Zustand caching, and React Query integration.
 */

// Types
export type {
  ApiNflConfig,
  ApiNflResponse,
  NflCountriesParams,
  NflCountry,
  NflGame,
  NflGamesParams,
  NflGameStatus,
  NflHeadToHeadParams,
  NflLeague,
  NflLeagueResponse,
  NflLeaguesParams,
  NflScores,
  NflSeason,
  NflSeasonsParams,
  NflStanding,
  NflStandingsParams,
  NflTeam,
  NflTeamResponse,
  NflTeamsParams,
  NflTeamStatistics,
  NflTeamStatisticsParams,
  NflTimezone,
} from "./types";

// Network
export {
  ApiNflClient,
  createApiNflClient,
  NFL_API_BASE_URL,
  NFL_DEFAULT_HEADERS,
  NFL_ENDPOINTS,
  NFL_RAPIDAPI_HOST,
} from "./network";

// Store
export { createApiNflStore, type ApiNflState, type ApiNflStore } from "./store";

// Hooks
export {
  ApiNflProvider,
  apiNflKeys,
  useApiNflClient,
  useApiNflStore,
  useApiNflStoreContext,
  useNflCountries,
  useNflGames,
  useNflGamesHeadToHead,
  useNflLeagues,
  useNflSeasons,
  useNflStandings,
  useNflTeams,
  useNflTeamStatistics,
  useNflTimezone,
  type ApiNflProviderProps,
  type UseApiNflQueryOptions,
  type UseApiNflQueryOptionsRequired,
} from "./hooks";
