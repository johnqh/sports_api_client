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
  FootballLogo,
  FootballBirth,
  FootballPagingParams,
  FootballRateLimitInfo,
} from "./common";

// Countries and Timezone types
export type {
  FootballCountry,
  FootballCountriesParams,
  FootballTimezone,
} from "./countries";

// Leagues and Seasons types
export type {
  FootballLeague,
  FootballSeason,
  FootballSeasonCoverage,
  FootballFixturesCoverage,
  FootballLeagueResponse,
  FootballLeaguesParams,
} from "./leagues";

// Teams and Venues types
export type {
  FootballTeam,
  FootballVenue,
  FootballTeamResponse,
  FootballTeamsParams,
  FootballVenuesParams,
  FootballTeamStatistics,
  FootballTeamFixturesStats,
  FootballTeamHomeAwayTotal,
  FootballTeamGoalsStats,
  FootballTeamGoalsDetail,
  FootballTeamBiggestStats,
  FootballTeamPenaltyStats,
  FootballTeamLineup,
  FootballTeamCardsStats,
  FootballTeamStatisticsParams,
} from "./teams";

// Fixtures types
export type {
  FootballFixture,
  FootballFixturePeriods,
  FootballFixtureVenue,
  FootballFixtureStatus,
  FootballFixtureStatusCode,
  FootballFixtureLeague,
  FootballFixtureTeams,
  FootballFixtureTeam,
  FootballFixtureGoals,
  FootballFixtureScore,
  FootballFixtureResponse,
  FootballFixturesParams,
  FootballHeadToHeadParams,
  FootballFixtureEvent,
  FootballFixtureEventsParams,
  FootballFixtureLineup,
  FootballTeamColors,
  FootballColorSet,
  FootballLineupPlayer,
  FootballFixtureLineupsParams,
  FootballFixtureStatistics,
  FootballStatisticItem,
  FootballFixtureStatisticsParams,
  FootballFixturePlayerStats,
  FootballPlayerFixtureStats,
  FootballPlayerStatDetail,
  FootballFixturePlayersParams,
} from "./fixtures";

// Standings types
export type {
  FootballStandingsResponse,
  FootballStandingsLeague,
  FootballStanding,
  FootballStandingTeam,
  FootballStandingStats,
  FootballStandingsParams,
} from "./standings";

// Players types
export type {
  FootballPlayer,
  FootballPlayerStatistics,
  FootballPlayerResponse,
  FootballPlayersParams,
  FootballPlayersSeasonParams,
  FootballSquadPlayer,
  FootballSquadResponse,
  FootballSquadsParams,
  FootballTopScorersParams,
  FootballTopAssistsParams,
  FootballTopCardsParams,
} from "./players";

// Transfers, Trophies, Sidelined, Coachs types
export type {
  FootballTransfer,
  FootballTransferResponse,
  FootballTransfersParams,
  FootballTrophy,
  FootballTrophiesParams,
  FootballSidelined,
  FootballSidelinedParams,
  FootballCoach,
  FootballCoachCareer,
  FootballCoachsParams,
  FootballInjury,
  FootballInjuriesParams,
} from "./transfers";

// Statistics types
export type {
  FootballStatValue,
  FootballPercentageStat,
  FootballMinuteStats,
  FootballFixtureStatType,
  FootballPlayerPosition,
  FootballCardType,
  FootballGoalType,
  FootballEventType,
  FootballVarDecision,
} from "./statistics";
