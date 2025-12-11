/**
 * @module volleyball/types
 * @description Type exports for API-Volleyball
 */

export type {
  ApiVolleyballConfig,
  ApiVolleyballResponse,
  VolleyballCountriesParams,
  VolleyballCountry,
  VolleyballSeason,
  VolleyballSeasonsParams,
  VolleyballTimezone,
} from "./volleyball-common";

export type {
  VolleyballLeague,
  VolleyballLeagueCountry,
  VolleyballLeagueResponse,
  VolleyballLeagueSeason,
  VolleyballLeaguesParams,
} from "./volleyball-leagues";

export type {
  VolleyballTeam,
  VolleyballTeamCountry,
  VolleyballTeamResponse,
  VolleyballTeamsParams,
} from "./volleyball-teams";

export type {
  VolleyballGame,
  VolleyballGamesParams,
  VolleyballGameScores,
  VolleyballGameStatus,
  VolleyballGameTeam,
  VolleyballH2HParams,
  VolleyballSetScores,
} from "./volleyball-games";

export type {
  VolleyballStandingEntry,
  VolleyballStandingsParams,
  VolleyballStandingsResponse,
  VolleyballTeamRecord,
} from "./volleyball-standings";
