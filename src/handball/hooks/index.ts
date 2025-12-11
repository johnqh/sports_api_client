/**
 * @module handball/hooks
 * @description Hook exports for API-Handball
 */

export {
  ApiHandballProvider,
  useApiHandballClient,
  useApiHandballStore,
  useApiHandballStoreContext,
  type ApiHandballProviderProps,
} from "./handball-context";

export {
  apiHandballKeys,
  type UseApiHandballQueryOptions,
  type UseApiHandballQueryOptionsRequired,
} from "./handball-types";

export { useHandballTimezone } from "./use-handball-timezone";
export { useHandballCountries } from "./use-handball-countries";
export { useHandballSeasons } from "./use-handball-seasons";
export { useHandballLeagues } from "./use-handball-leagues";
export { useHandballTeams } from "./use-handball-teams";
export { useHandballStandings } from "./use-handball-standings";
export { useHandballGames } from "./use-handball-games";
export { useHandballH2H } from "./use-handball-h2h";
export { useHandballOdds } from "./use-handball-odds";
