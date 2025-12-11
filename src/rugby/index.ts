/**
 * @module rugby
 * @description API-Rugby client library exports
 *
 * Provides type-safe access to the API-Rugby API with React hooks,
 * Zustand caching, and React Query integration.
 */

// Types
export type {
  ApiRugbyConfig,
  ApiRugbyResponse,
  RugbyCountriesParams,
  RugbyCountry,
  RugbyGame,
  RugbyGamesParams,
  RugbyGameStatus,
  RugbyHeadToHeadParams,
  RugbyLeague,
  RugbyLeagueResponse,
  RugbyLeaguesParams,
  RugbyScores,
  RugbySeason,
  RugbySeasonsParams,
  RugbyStanding,
  RugbyStandingsParams,
  RugbyTeam,
  RugbyTeamResponse,
  RugbyTeamsParams,
  RugbyTeamStatistics,
  RugbyTeamStatisticsParams,
  RugbyTimezone,
} from "./types";

// Network
export {
  ApiRugbyClient,
  createApiRugbyClient,
  RUGBY_API_BASE_URL,
  RUGBY_DEFAULT_HEADERS,
  RUGBY_ENDPOINTS,
  RUGBY_RAPIDAPI_HOST,
} from "./network";

// Store
export {
  createApiRugbyStore,
  type ApiRugbyState,
  type ApiRugbyStore,
} from "./store";

// Hooks
export {
  ApiRugbyProvider,
  apiRugbyKeys,
  useApiRugbyClient,
  useApiRugbyStore,
  useApiRugbyStoreContext,
  useRugbyCountries,
  useRugbyGames,
  useRugbyGamesHeadToHead,
  useRugbyLeagues,
  useRugbySeasons,
  useRugbyStandings,
  useRugbyTeams,
  useRugbyTeamStatistics,
  useRugbyTimezone,
  type ApiRugbyProviderProps,
  type UseApiRugbyQueryOptions,
  type UseApiRugbyQueryOptionsRequired,
} from "./hooks";
