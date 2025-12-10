/**
 * API-Football Client Type Definitions
 *
 * This module exports all TypeScript types for the API-Football v3 API.
 * Types from @sudobility/types are NOT re-exported.
 * Import them directly from @sudobility/types as a peer dependency.
 */

// Common types
export type {
  ApiFootballResponse,
  ApiFootballPaging,
  ApiFootballConfig,
  Logo,
  Birth,
  PagingParams,
  RateLimitInfo,
} from "./common";

// Countries and Timezone types
export type { Country, CountriesParams, Timezone } from "./countries";

// Leagues and Seasons types
export type {
  League,
  Season,
  SeasonCoverage,
  FixturesCoverage,
  LeagueResponse,
  LeaguesParams,
} from "./leagues";

// Teams and Venues types
export type {
  Team,
  Venue,
  TeamResponse,
  TeamsParams,
  VenuesParams,
  TeamStatistics,
  TeamFixturesStats,
  TeamHomeAwayTotal,
  TeamGoalsStats,
  TeamGoalsDetail,
  TeamBiggestStats,
  TeamPenaltyStats,
  TeamLineup,
  TeamCardsStats,
  TeamStatisticsParams,
} from "./teams";

// Fixtures types
export type {
  Fixture,
  FixturePeriods,
  FixtureVenue,
  FixtureStatus,
  FixtureStatusCode,
  FixtureLeague,
  FixtureTeams,
  FixtureTeam,
  FixtureGoals,
  FixtureScore,
  FixtureResponse,
  FixturesParams,
  HeadToHeadParams,
  FixtureEvent,
  FixtureEventsParams,
  FixtureLineup,
  TeamColors,
  ColorSet,
  LineupPlayer,
  FixtureLineupsParams,
  FixtureStatistics,
  StatisticItem,
  FixtureStatisticsParams,
  FixturePlayerStats,
  PlayerFixtureStats,
  PlayerStatDetail,
  FixturePlayersParams,
} from "./fixtures";

// Standings types
export type {
  StandingsResponse,
  StandingsLeague,
  Standing,
  StandingTeam,
  StandingStats,
  StandingsParams,
} from "./standings";

// Players types
export type {
  Player,
  PlayerStatistics,
  PlayerResponse,
  PlayersParams,
  PlayersSeasonParams,
  SquadPlayer,
  SquadResponse,
  SquadsParams,
  TopScorersParams,
  TopAssistsParams,
  TopCardsParams,
} from "./players";

// Transfers, Trophies, Sidelined, Coachs types
export type {
  Transfer,
  TransferResponse,
  TransfersParams,
  Trophy,
  TrophiesParams,
  Sidelined,
  SidelinedParams,
  Coach,
  CoachCareer,
  CoachsParams,
  Injury,
  InjuriesParams,
} from "./transfers";

// Statistics types
export type {
  StatValue,
  PercentageStat,
  MinuteStats,
  FixtureStatType,
  PlayerPosition,
  CardType,
  GoalType,
  EventType,
  VarDecision,
} from "./statistics";
