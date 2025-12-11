/**
 * API-Basketball Client Type Definitions
 */

// Common types
export type {
  ApiBasketballConfig,
  ApiBasketballResponse,
  BasketballCountry,
  BasketballCountriesParams,
  BasketballTimezone,
} from "./basketball-common";

// Leagues and Seasons types
export type {
  BasketballLeague,
  BasketballLeagueResponse,
  BasketballLeaguesParams,
  BasketballSeason,
  BasketballSeasonsParams,
} from "./basketball-leagues";

// Teams types
export type {
  BasketballTeam,
  BasketballTeamResponse,
  BasketballTeamStatistics,
  BasketballTeamStatisticsParams,
  BasketballTeamsParams,
} from "./basketball-teams";

// Games types
export type {
  BasketballGame,
  BasketballGamesParams,
  BasketballGameStatus,
  BasketballHeadToHeadParams,
  BasketballScores,
} from "./basketball-games";

// Standings types
export type {
  BasketballStanding,
  BasketballStandingsParams,
} from "./basketball-standings";
