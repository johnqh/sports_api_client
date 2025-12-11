/**
 * @module mma/types
 * @description Type exports for API-MMA
 */

export type {
  ApiMmaConfig,
  ApiMmaResponse,
  MmaCountriesParams,
  MmaCountry,
  MmaSeasonsParams,
  MmaTimezone,
} from "./mma-common";

export type {
  MmaLeague,
  MmaLeagueResponse,
  MmaLeaguesParams,
  MmaSeason,
} from "./mma-leagues";

export type { MmaCategory, MmaCategoriesParams } from "./mma-categories";

export type { MmaFighter, MmaFightersParams } from "./mma-fighters";

export type {
  MmaFight,
  MmaFightResult,
  MmaFightsParams,
  MmaFightStatus,
} from "./mma-fights";
