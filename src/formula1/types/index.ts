/**
 * @module formula1/types
 * @description Type exports for API-Formula-1
 */

export type {
  ApiF1Config,
  ApiF1Response,
  F1SeasonsParams,
  F1Timezone,
} from "./f1-common";

export type { F1Circuit, F1CircuitsParams } from "./f1-circuits";

export type { F1Competition, F1CompetitionsParams } from "./f1-competitions";

export type { F1Team, F1TeamsParams } from "./f1-teams";

export type { F1Driver, F1DriversParams } from "./f1-drivers";

export type { F1Race, F1RacesParams, F1RaceStatus } from "./f1-races";

export type {
  F1DriverRanking,
  F1DriverRankingsParams,
  F1TeamRanking,
  F1TeamRankingsParams,
} from "./f1-rankings";

export type { F1PitStop, F1PitStopsParams } from "./f1-pitstops";
