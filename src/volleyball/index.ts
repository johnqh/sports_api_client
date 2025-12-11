/**
 * @module volleyball
 * @description API-Volleyball client library exports
 */

// Types
export type {
  ApiVolleyballConfig,
  ApiVolleyballResponse,
  VolleyballCountriesParams,
  VolleyballCountry,
  VolleyballGame,
  VolleyballGamesParams,
  VolleyballGameScores,
  VolleyballGameStatus,
  VolleyballGameTeam,
  VolleyballH2HParams,
  VolleyballLeague,
  VolleyballLeagueCountry,
  VolleyballLeagueResponse,
  VolleyballLeagueSeason,
  VolleyballLeaguesParams,
  VolleyballSeason,
  VolleyballSeasonsParams,
  VolleyballSetScores,
  VolleyballStandingEntry,
  VolleyballStandingsParams,
  VolleyballStandingsResponse,
  VolleyballTeam,
  VolleyballTeamCountry,
  VolleyballTeamRecord,
  VolleyballTeamResponse,
  VolleyballTeamsParams,
  VolleyballTimezone,
} from "./types";

// Network
export {
  ApiVolleyballClient,
  createApiVolleyballClient,
  VOLLEYBALL_API_BASE_URL,
  VOLLEYBALL_DEFAULT_HEADERS,
  VOLLEYBALL_ENDPOINTS,
  VOLLEYBALL_RAPIDAPI_HOST,
} from "./network";

// Store
export {
  createApiVolleyballStore,
  type ApiVolleyballState,
  type ApiVolleyballStore,
} from "./store";

// Hooks
export {
  ApiVolleyballProvider,
  apiVolleyballKeys,
  useApiVolleyballClient,
  useApiVolleyballStore,
  useApiVolleyballStoreContext,
  useVolleyballCountries,
  useVolleyballGames,
  useVolleyballH2H,
  useVolleyballLeagues,
  useVolleyballSeasons,
  useVolleyballStandings,
  useVolleyballTeams,
  useVolleyballTimezone,
  type ApiVolleyballProviderProps,
  type UseApiVolleyballQueryOptions,
  type UseApiVolleyballQueryOptionsRequired,
} from "./hooks";
