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
 *   useFootballLeagues,
 *   useFootballFixtures,
 *   useFootballStandings,
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
} from "./football-context";
export type { ApiFootballProviderProps } from "./football-context";

// Types and keys
export { apiFootballKeys } from "./football-types";
export type {
  UseApiFootballQueryOptions,
  UseApiFootballQueryOptionsRequired,
} from "./football-types";

// Coaches hook
export { useFootballCoaches } from "./use-football-coaches";

// Countries hook
export { useFootballCountries } from "./use-football-countries";

// Fixtures hooks
export {
  useFootballFixtureEvents,
  useFootballFixtureLineups,
  useFootballFixturePlayers,
  useFootballFixtures,
  useFootballFixturesHeadToHead,
  useFootballFixtureStatistics,
} from "./use-football-fixtures";

// Injuries hook
export { useFootballInjuries } from "./use-football-injuries";

// Leagues hook
export { useFootballLeagues } from "./use-football-leagues";

// Players hooks
export {
  useFootballPlayers,
  useFootballPlayersSeasons,
  useFootballSquads,
  useFootballTopAssists,
  useFootballTopCards,
  useFootballTopScorers,
} from "./use-football-players";

// Seasons hook
export { useFootballSeasons } from "./use-football-seasons";

// Sidelined hook
export { useFootballSidelined } from "./use-football-sidelined";

// Standings hook
export { useFootballStandings } from "./use-football-standings";

// Teams hooks
export {
  useFootballTeams,
  useFootballTeamStatistics,
  useFootballVenues,
} from "./use-football-teams";

// Timezone hook
export { useFootballTimezone } from "./use-football-timezone";

// Transfers hook
export { useFootballTransfers } from "./use-football-transfers";

// Trophies hook
export { useFootballTrophies } from "./use-football-trophies";
