/**
 * API-Hockey Client Type Definitions
 */

// Common types
export type {
  ApiHockeyConfig,
  ApiHockeyResponse,
  HockeyCountriesParams,
  HockeyCountry,
  HockeyTimezone,
} from "./hockey-common";

// Leagues and Seasons types
export type {
  HockeyLeague,
  HockeyLeagueResponse,
  HockeyLeaguesParams,
  HockeySeason,
  HockeySeasonsParams,
} from "./hockey-leagues";

// Teams types
export type {
  HockeyTeam,
  HockeyTeamResponse,
  HockeyTeamsParams,
  HockeyTeamStatistics,
  HockeyTeamStatisticsParams,
} from "./hockey-teams";

// Games types
export type {
  HockeyGame,
  HockeyGameEvent,
  HockeyGamesParams,
  HockeyGameStatus,
  HockeyHeadToHeadParams,
  HockeyScores,
} from "./hockey-games";

// Standings types
export type { HockeyStanding, HockeyStandingsParams } from "./hockey-standings";
