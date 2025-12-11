/**
 * @module volleyball/hooks
 * @description Hook exports for API-Volleyball
 */

export {
  ApiVolleyballProvider,
  useApiVolleyballClient,
  useApiVolleyballStore,
  useApiVolleyballStoreContext,
  type ApiVolleyballProviderProps,
} from "./volleyball-context";

export {
  apiVolleyballKeys,
  type UseApiVolleyballQueryOptions,
  type UseApiVolleyballQueryOptionsRequired,
} from "./volleyball-types";

export { useVolleyballTimezone } from "./use-volleyball-timezone";
export { useVolleyballCountries } from "./use-volleyball-countries";
export { useVolleyballSeasons } from "./use-volleyball-seasons";
export { useVolleyballLeagues } from "./use-volleyball-leagues";
export { useVolleyballTeams } from "./use-volleyball-teams";
export { useVolleyballStandings } from "./use-volleyball-standings";
export { useVolleyballGames } from "./use-volleyball-games";
export { useVolleyballH2H } from "./use-volleyball-h2h";
