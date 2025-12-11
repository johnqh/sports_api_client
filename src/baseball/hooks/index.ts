/**
 * @module baseball/hooks
 * @description Hook exports for API-Baseball
 */

export {
  ApiBaseballProvider,
  useApiBaseballClient,
  useApiBaseballStore,
  useApiBaseballStoreContext,
  type ApiBaseballProviderProps,
} from "./baseball-context";

export {
  apiBaseballKeys,
  type UseApiBaseballQueryOptions,
  type UseApiBaseballQueryOptionsRequired,
} from "./baseball-types";

export { useBaseballTimezone } from "./use-baseball-timezone";
export { useBaseballCountries } from "./use-baseball-countries";
export { useBaseballSeasons } from "./use-baseball-seasons";
export { useBaseballLeagues } from "./use-baseball-leagues";
export {
  useBaseballTeams,
  useBaseballTeamStatistics,
} from "./use-baseball-teams";
export {
  useBaseballGames,
  useBaseballGamesHeadToHead,
  useBaseballGameStatistics,
} from "./use-baseball-games";
export { useBaseballStandings } from "./use-baseball-standings";
