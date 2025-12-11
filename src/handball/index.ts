/**
 * @module handball
 * @description API-Handball client library exports
 */

// Types
export type {
  ApiHandballConfig,
  ApiHandballResponse,
  HandballBet,
  HandballBetValue,
  HandballBookmaker,
  HandballCountriesParams,
  HandballCountry,
  HandballGame,
  HandballGamesParams,
  HandballGameScores,
  HandballGameStatus,
  HandballGameTeam,
  HandballH2HParams,
  HandballLeague,
  HandballLeagueCountry,
  HandballLeagueResponse,
  HandballLeagueSeason,
  HandballLeaguesParams,
  HandballOdds,
  HandballOddsParams,
  HandballPeriodScores,
  HandballSeason,
  HandballSeasonsParams,
  HandballStandingEntry,
  HandballStandingsParams,
  HandballStandingsResponse,
  HandballTeam,
  HandballTeamCountry,
  HandballTeamRecord,
  HandballTeamResponse,
  HandballTeamsParams,
  HandballTimezone,
} from "./types";

// Network
export {
  ApiHandballClient,
  createApiHandballClient,
  HANDBALL_API_BASE_URL,
  HANDBALL_DEFAULT_HEADERS,
  HANDBALL_ENDPOINTS,
  HANDBALL_RAPIDAPI_HOST,
} from "./network";

// Store
export {
  createApiHandballStore,
  type ApiHandballState,
  type ApiHandballStore,
} from "./store";

// Hooks
export {
  ApiHandballProvider,
  apiHandballKeys,
  useApiHandballClient,
  useApiHandballStore,
  useApiHandballStoreContext,
  useHandballCountries,
  useHandballGames,
  useHandballH2H,
  useHandballLeagues,
  useHandballOdds,
  useHandballSeasons,
  useHandballStandings,
  useHandballTeams,
  useHandballTimezone,
  type ApiHandballProviderProps,
  type UseApiHandballQueryOptions,
  type UseApiHandballQueryOptionsRequired,
} from "./hooks";
