/**
 * @module handball/types
 * @description Type exports for API-Handball
 */

export type {
  ApiHandballConfig,
  ApiHandballResponse,
  HandballCountriesParams,
  HandballCountry,
  HandballSeason,
  HandballSeasonsParams,
  HandballTimezone,
} from "./handball-common";

export type {
  HandballLeague,
  HandballLeagueCountry,
  HandballLeagueResponse,
  HandballLeagueSeason,
  HandballLeaguesParams,
} from "./handball-leagues";

export type {
  HandballTeam,
  HandballTeamCountry,
  HandballTeamResponse,
  HandballTeamsParams,
} from "./handball-teams";

export type {
  HandballGame,
  HandballGamesParams,
  HandballGameScores,
  HandballGameStatus,
  HandballGameTeam,
  HandballH2HParams,
  HandballPeriodScores,
} from "./handball-games";

export type {
  HandballStandingEntry,
  HandballStandingsParams,
  HandballStandingsResponse,
  HandballTeamRecord,
} from "./handball-standings";

export type {
  HandballBet,
  HandballBetValue,
  HandballBookmaker,
  HandballOdds,
  HandballOddsParams,
} from "./handball-odds";
