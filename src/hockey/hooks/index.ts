/**
 * @module hockey/hooks
 * @description React hooks for API-Hockey with React Query and Zustand caching
 */

// Context and provider
export {
  ApiHockeyProvider,
  useApiHockeyClient,
  useApiHockeyStore,
  useApiHockeyStoreContext,
} from "./hockey-context";
export type { ApiHockeyProviderProps } from "./hockey-context";

// Types and keys
export { apiHockeyKeys } from "./hockey-types";
export type {
  UseApiHockeyQueryOptions,
  UseApiHockeyQueryOptionsRequired,
} from "./hockey-types";

// Countries hook
export { useHockeyCountries } from "./use-hockey-countries";

// Games hooks
export { useHockeyGames, useHockeyGamesHeadToHead } from "./use-hockey-games";

// Leagues hook
export { useHockeyLeagues } from "./use-hockey-leagues";

// Seasons hook
export { useHockeySeasons } from "./use-hockey-seasons";

// Standings hook
export { useHockeyStandings } from "./use-hockey-standings";

// Teams hooks
export { useHockeyTeams, useHockeyTeamStatistics } from "./use-hockey-teams";

// Timezone hook
export { useHockeyTimezone } from "./use-hockey-timezone";
