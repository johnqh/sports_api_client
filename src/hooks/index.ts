/**
 * @module hooks
 * @description React hooks for API-Football with React Query and Zustand caching
 *
 * All hooks integrate with React Query for data fetching and Zustand for
 * persistent caching. Cached data is automatically used as initial data
 * when available and valid.
 *
 * Uses DI pattern for cross-platform React/React Native compatibility.
 * Requires StorageService from @sudobility/di for persistent caching.
 *
 * @example
 * ```typescript
 * import {
 *   ApiFootballProvider,
 *   ApiFootballClient,
 *   useLeagues,
 *   useFixtures,
 *   useStandings,
 *   apiFootballKeys,
 * } from "@sudobility/sports_api_client";
 * import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
 * import type { StorageService, NetworkClient } from "@sudobility/di";
 *
 * const queryClient = new QueryClient();
 *
 * // Get services from your DI container
 * const networkClient = container.get<NetworkClient>(ServiceKeys.NETWORK);
 * const storageService = container.get<StorageService>(ServiceKeys.STORAGE);
 *
 * const apiClient = new ApiFootballClient(networkClient, { apiKey: "KEY" });
 *
 * function App() {
 *   return (
 *     <QueryClientProvider client={queryClient}>
 *       <ApiFootballProvider client={apiClient} storageService={storageService}>
 *         <YourApp />
 *       </ApiFootballProvider>
 *     </QueryClientProvider>
 *   );
 * }
 * ```
 */

// Context and provider
export {
  ApiFootballProvider,
  useApiFootballClient,
  useApiFootballStore,
  useApiFootballStoreContext,
} from "./context";
export type { ApiFootballProviderProps } from "./context";

// Types and keys
export { apiFootballKeys } from "./types";
export type {
  UseApiFootballQueryOptions,
  UseApiFootballQueryOptionsRequired,
} from "./types";

// Coaches hook
export { useCoaches } from "./use-coaches";

// Countries hook
export { useCountries } from "./use-countries";

// Fixtures hooks
export {
  useFixtureEvents,
  useFixtureLineups,
  useFixturePlayers,
  useFixtures,
  useFixturesHeadToHead,
  useFixtureStatistics,
} from "./use-fixtures";

// Injuries hook
export { useInjuries } from "./use-injuries";

// Leagues hook
export { useLeagues } from "./use-leagues";

// Players hooks
export {
  usePlayers,
  usePlayersSeasons,
  useSquads,
  useTopAssists,
  useTopCards,
  useTopScorers,
} from "./use-players";

// Seasons hook
export { useSeasons } from "./use-seasons";

// Sidelined hook
export { useSidelined } from "./use-sidelined";

// Standings hook
export { useStandings } from "./use-standings";

// Teams hooks
export { useTeams, useTeamStatistics, useVenues } from "./use-teams";

// Timezone hook
export { useTimezone } from "./use-timezone";

// Transfers hook
export { useTransfers } from "./use-transfers";

// Trophies hook
export { useTrophies } from "./use-trophies";
