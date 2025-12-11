/**
 * @module baseball
 * @description API-Baseball client library exports
 *
 * Provides type-safe access to the API-Baseball API with React hooks,
 * Zustand caching, and React Query integration.
 */

// Types
export type {
  ApiBaseballConfig,
  ApiBaseballResponse,
  BaseballCountriesParams,
  BaseballCountry,
  BaseballGame,
  BaseballGamesParams,
  BaseballGameStatistics,
  BaseballGameStatisticsParams,
  BaseballGameStatus,
  BaseballHeadToHeadParams,
  BaseballLeague,
  BaseballLeagueResponse,
  BaseballLeaguesParams,
  BaseballScores,
  BaseballSeason,
  BaseballSeasonsParams,
  BaseballStanding,
  BaseballStandingsParams,
  BaseballStatItem,
  BaseballStatType,
  BaseballTeam,
  BaseballTeamGameStats,
  BaseballTeamResponse,
  BaseballTeamsParams,
  BaseballTeamStatistics,
  BaseballTeamStatisticsParams,
  BaseballTimezone,
} from "./types";

// Network
export {
  ApiBaseballClient,
  createApiBaseballClient,
  BASEBALL_API_BASE_URL,
  BASEBALL_DEFAULT_HEADERS,
  BASEBALL_ENDPOINTS,
  BASEBALL_RAPIDAPI_HOST,
} from "./network";

// Store
export {
  createApiBaseballStore,
  type ApiBaseballState,
  type ApiBaseballStore,
} from "./store";

// Hooks
export {
  ApiBaseballProvider,
  apiBaseballKeys,
  useApiBaseballClient,
  useApiBaseballStore,
  useApiBaseballStoreContext,
  useBaseballCountries,
  useBaseballGames,
  useBaseballGamesHeadToHead,
  useBaseballGameStatistics,
  useBaseballLeagues,
  useBaseballSeasons,
  useBaseballStandings,
  useBaseballTeams,
  useBaseballTeamStatistics,
  useBaseballTimezone,
  type ApiBaseballProviderProps,
  type UseApiBaseballQueryOptions,
  type UseApiBaseballQueryOptionsRequired,
} from "./hooks";
