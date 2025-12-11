/**
 * @module hockey
 * @description API-Hockey client library exports
 *
 * Provides type-safe access to the API-Hockey API with React hooks,
 * Zustand caching, and React Query integration.
 */

// Types
export type {
  ApiHockeyConfig,
  ApiHockeyResponse,
  HockeyCountriesParams,
  HockeyCountry,
  HockeyGame,
  HockeyGameEvent,
  HockeyGamesParams,
  HockeyGameStatistics,
  HockeyGameStatisticsParams,
  HockeyGameStatus,
  HockeyHeadToHeadParams,
  HockeyLeague,
  HockeyLeagueResponse,
  HockeyLeaguesParams,
  HockeyScores,
  HockeySeason,
  HockeySeasonsParams,
  HockeyStanding,
  HockeyStandingsParams,
  HockeyStatItem,
  HockeyStatType,
  HockeyTeam,
  HockeyTeamResponse,
  HockeyTeamsParams,
  HockeyTeamStatistics,
  HockeyTeamStatisticsParams,
  HockeyTimezone,
} from "./types";

// Network
export {
  ApiHockeyClient,
  createApiHockeyClient,
  HOCKEY_API_BASE_URL,
  HOCKEY_DEFAULT_HEADERS,
  HOCKEY_ENDPOINTS,
  HOCKEY_RAPIDAPI_HOST,
} from "./network";

// Store
export {
  createApiHockeyStore,
  type ApiHockeyState,
  type ApiHockeyStore,
} from "./store";

// Hooks
export {
  ApiHockeyProvider,
  apiHockeyKeys,
  useApiHockeyClient,
  useApiHockeyStore,
  useApiHockeyStoreContext,
  useHockeyCountries,
  useHockeyGames,
  useHockeyGamesHeadToHead,
  useHockeyGameStatistics,
  useHockeyLeagues,
  useHockeySeasons,
  useHockeyStandings,
  useHockeyTeams,
  useHockeyTeamStatistics,
  useHockeyTimezone,
  type ApiHockeyProviderProps,
  type UseApiHockeyQueryOptions,
  type UseApiHockeyQueryOptionsRequired,
} from "./hooks";
