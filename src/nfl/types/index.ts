/**
 * API-NFL Client Type Definitions
 */

// Common types
export type {
  ApiNflConfig,
  ApiNflResponse,
  NflCountriesParams,
  NflCountry,
  NflTimezone,
} from "./nfl-common";

// Leagues and Seasons types
export type {
  NflLeague,
  NflLeagueResponse,
  NflLeaguesParams,
  NflSeason,
  NflSeasonsParams,
} from "./nfl-leagues";

// Teams types
export type {
  NflTeam,
  NflTeamResponse,
  NflTeamsParams,
  NflTeamStatistics,
  NflTeamStatisticsParams,
} from "./nfl-teams";

// Games types
export type {
  NflGame,
  NflGamesParams,
  NflGameStatus,
  NflHeadToHeadParams,
  NflScores,
} from "./nfl-games";

// Standings types
export type { NflStanding, NflStandingsParams } from "./nfl-standings";

// Statistics types
export type {
  NflGameStatistics,
  NflGameStatisticsParams,
  NflStatItem,
  NflStatType,
} from "./nfl-statistics";
