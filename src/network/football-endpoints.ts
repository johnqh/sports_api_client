/**
 * API-Football v3 endpoint definitions
 */

/**
 * Base URL for API-Football v3
 */
export const FOOTBALL_API_BASE_URL = "https://v3.football.api-sports.io";

/**
 * RapidAPI host for API-Football
 */
export const FOOTBALL_RAPIDAPI_HOST = "api-football-v1.p.rapidapi.com";

/**
 * All API-Football v3 endpoints
 */
export const FOOTBALL_ENDPOINTS = {
  // General
  TIMEZONE: "/timezone",
  COUNTRIES: "/countries",

  // Leagues
  LEAGUES: "/leagues",
  LEAGUES_SEASONS: "/leagues/seasons",

  // Teams
  TEAMS: "/teams",
  TEAMS_STATISTICS: "/teams/statistics",
  TEAMS_SEASONS: "/teams/seasons",
  TEAMS_COUNTRIES: "/teams/countries",

  // Venues
  VENUES: "/venues",

  // Standings
  STANDINGS: "/standings",

  // Fixtures
  FIXTURES: "/fixtures",
  FIXTURES_ROUNDS: "/fixtures/rounds",
  FIXTURES_HEAD_TO_HEAD: "/fixtures/headtohead",
  FIXTURES_STATISTICS: "/fixtures/statistics",
  FIXTURES_EVENTS: "/fixtures/events",
  FIXTURES_LINEUPS: "/fixtures/lineups",
  FIXTURES_PLAYERS: "/fixtures/players",

  // Players
  PLAYERS: "/players",
  PLAYERS_SEASONS: "/players/seasons",
  PLAYERS_SQUADS: "/players/squads",
  PLAYERS_TOP_SCORERS: "/players/topscorers",
  PLAYERS_TOP_ASSISTS: "/players/topassists",
  PLAYERS_TOP_CARDS: "/players/topcards",

  // Transfers
  TRANSFERS: "/transfers",

  // Trophies
  TROPHIES: "/trophies",

  // Sidelined
  SIDELINED: "/sidelined",

  // Coachs
  COACHS: "/coachs",

  // Injuries
  INJURIES: "/injuries",
} as const;

/**
 * Default headers for API-Football
 */
export const FOOTBALL_DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
};
