/**
 * @module rugby/hooks
 * @description Hook exports for API-Rugby
 */

export {
  ApiRugbyProvider,
  useApiRugbyClient,
  useApiRugbyStore,
  useApiRugbyStoreContext,
  type ApiRugbyProviderProps,
} from "./rugby-context";

export {
  apiRugbyKeys,
  type UseApiRugbyQueryOptions,
  type UseApiRugbyQueryOptionsRequired,
} from "./rugby-types";

export { useRugbyTimezone } from "./use-rugby-timezone";
export { useRugbyCountries } from "./use-rugby-countries";
export { useRugbySeasons } from "./use-rugby-seasons";
export { useRugbyLeagues } from "./use-rugby-leagues";
export { useRugbyTeams, useRugbyTeamStatistics } from "./use-rugby-teams";
export {
  useRugbyGames,
  useRugbyGamesHeadToHead,
  useRugbyGameStatistics,
} from "./use-rugby-games";
export { useRugbyStandings } from "./use-rugby-standings";
