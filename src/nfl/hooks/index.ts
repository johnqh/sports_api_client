/**
 * @module nfl/hooks
 * @description React hooks for API-NFL with React Query and Zustand caching
 */

// Context and provider
export {
  ApiNflProvider,
  useApiNflClient,
  useApiNflStore,
  useApiNflStoreContext,
} from "./nfl-context";
export type { ApiNflProviderProps } from "./nfl-context";

// Types and keys
export { apiNflKeys } from "./nfl-types";
export type {
  UseApiNflQueryOptions,
  UseApiNflQueryOptionsRequired,
} from "./nfl-types";

// Countries hook
export { useNflCountries } from "./use-nfl-countries";

// Games hooks
export {
  useNflGames,
  useNflGamesHeadToHead,
  useNflGameStatistics,
} from "./use-nfl-games";

// Leagues hook
export { useNflLeagues } from "./use-nfl-leagues";

// Seasons hook
export { useNflSeasons } from "./use-nfl-seasons";

// Standings hook
export { useNflStandings } from "./use-nfl-standings";

// Teams hooks
export { useNflTeams, useNflTeamStatistics } from "./use-nfl-teams";

// Timezone hook
export { useNflTimezone } from "./use-nfl-timezone";
