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

export type { MmaCategory, MmaCategoriesParams } from "./mma-categories";

export type {
  MmaFighter,
  MmaFightersParams,
  MmaFightFighter,
  MmaTeam,
} from "./mma-fighters";

export type { MmaFight, MmaFightsParams, MmaFightStatus } from "./mma-fights";
