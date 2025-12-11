/**
 * @module basketball
 * @description API-Basketball client library exports
 *
 * Provides type-safe access to the API-Basketball API with React hooks,
 * Zustand caching, and React Query integration.
 */

// Types
export type {
  ApiBasketballConfig,
  ApiBasketballResponse,
  BasketballCountriesParams,
  BasketballCountry,
  BasketballGame,
  BasketballGamesParams,
  BasketballGameStatus,
  BasketballHeadToHeadParams,
  BasketballLeague,
  BasketballLeagueResponse,
  BasketballLeaguesParams,
  BasketballScores,
  BasketballSeason,
  BasketballSeasonsParams,
  BasketballStanding,
  BasketballStandingsParams,
  BasketballTeam,
  BasketballTeamResponse,
  BasketballTeamsParams,
  BasketballTeamStatistics,
  BasketballTeamStatisticsParams,
  BasketballTimezone,
} from "./types";

// Network
export {
  ApiBasketballClient,
  BASKETBALL_API_BASE_URL,
  BASKETBALL_DEFAULT_HEADERS,
  BASKETBALL_ENDPOINTS,
  BASKETBALL_RAPIDAPI_HOST,
  createApiBasketballClient,
} from "./network";

// Store
export {
  createApiBasketballStore,
  type ApiBasketballState,
  type ApiBasketballStore,
} from "./store";

// Hooks
export {
  ApiBasketballProvider,
  apiBasketballKeys,
  useApiBasketballClient,
  useApiBasketballStore,
  useApiBasketballStoreContext,
  useBasketballCountries,
  useBasketballGames,
  useBasketballGamesHeadToHead,
  useBasketballLeagues,
  useBasketballSeasons,
  useBasketballStandings,
  useBasketballTeams,
  useBasketballTeamStatistics,
  useBasketballTimezone,
  type ApiBasketballProviderProps,
  type UseApiBasketballQueryOptions,
  type UseApiBasketballQueryOptionsRequired,
} from "./hooks";
