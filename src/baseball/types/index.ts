/**
 * @module baseball/types
 * @description Type exports for API-Baseball
 */

export type {
  ApiBaseballConfig,
  ApiBaseballResponse,
  BaseballCountriesParams,
  BaseballCountry,
  BaseballSeasonsParams,
  BaseballTimezone,
} from "./baseball-common";

export type {
  BaseballLeague,
  BaseballLeagueResponse,
  BaseballLeaguesParams,
  BaseballSeason,
} from "./baseball-leagues";

export type {
  BaseballTeam,
  BaseballTeamResponse,
  BaseballTeamsParams,
  BaseballTeamStatistics,
  BaseballTeamStatisticsParams,
} from "./baseball-teams";

export type {
  BaseballGame,
  BaseballGamesParams,
  BaseballGameStatus,
  BaseballHeadToHeadParams,
  BaseballScores,
} from "./baseball-games";

export type {
  BaseballStanding,
  BaseballStandingsParams,
} from "./baseball-standings";
