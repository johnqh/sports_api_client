/**
 * @module formula1/hooks
 * @description Hook exports for API-Formula-1
 */

export {
  ApiF1Provider,
  useApiF1Client,
  useApiF1Store,
  useApiF1StoreContext,
  type ApiF1ProviderProps,
} from "./f1-context";

export {
  apiF1Keys,
  type UseApiF1QueryOptions,
  type UseApiF1QueryOptionsRequired,
} from "./f1-types";

export { useF1Timezone } from "./use-f1-timezone";
export { useF1Seasons } from "./use-f1-seasons";
export { useF1Circuits } from "./use-f1-circuits";
export { useF1Competitions } from "./use-f1-competitions";
export { useF1Teams } from "./use-f1-teams";
export { useF1Drivers } from "./use-f1-drivers";
export { useF1Races } from "./use-f1-races";
export { useF1DriverRankings, useF1TeamRankings } from "./use-f1-rankings";
export { useF1PitStops } from "./use-f1-pitstops";
