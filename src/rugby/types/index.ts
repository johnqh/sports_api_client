/**
 * @module rugby/types
 * @description Type exports for API-Rugby
 */

export type {
  ApiRugbyConfig,
  ApiRugbyResponse,
  RugbyCountriesParams,
  RugbyCountry,
  RugbySeasonsParams,
  RugbyTimezone,
} from "./rugby-common";

export type {
  RugbyLeague,
  RugbyLeagueResponse,
  RugbyLeaguesParams,
  RugbySeason,
} from "./rugby-leagues";

export type {
  RugbyTeam,
  RugbyTeamResponse,
  RugbyTeamsParams,
  RugbyTeamStatistics,
  RugbyTeamStatisticsParams,
} from "./rugby-teams";

export type {
  RugbyGame,
  RugbyGamesParams,
  RugbyGameStatus,
  RugbyHeadToHeadParams,
  RugbyScores,
} from "./rugby-games";

export type { RugbyStanding, RugbyStandingsParams } from "./rugby-standings";

export type {
  RugbyGameStatistics,
  RugbyGameStatisticsParams,
  RugbyStatItem,
  RugbyStatType,
  RugbyTeamGameStats,
} from "./rugby-statistics";
