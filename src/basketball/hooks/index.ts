/**
 * @module basketball/hooks
 * @description React hooks for API-Basketball with React Query and Zustand caching
 *
 * All hooks integrate with React Query for data fetching and Zustand for
 * persistent caching. Cached data is automatically used as initial data
 * when available and valid.
 *
 * @example
 * ```typescript
 * import {
 *   ApiBasketballProvider,
 *   ApiBasketballClient,
 *   useBasketballLeagues,
 *   useBasketballGames,
 *   useBasketballStandings,
 *   apiBasketballKeys,
 * } from "@sudobility/sports_api_client";
 * import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
 *
 * const queryClient = new QueryClient();
 * const storageService = container.get<StorageService>(ServiceKeys.STORAGE);
 * const apiClient = new ApiBasketballClient(networkClient, { apiKey: "KEY" });
 *
 * function App() {
 *   return (
 *     <QueryClientProvider client={queryClient}>
 *       <ApiBasketballProvider client={apiClient} storageService={storageService}>
 *         <YourApp />
 *       </ApiBasketballProvider>
 *     </QueryClientProvider>
 *   );
 * }
 * ```
 */

// Context and provider
export {
  ApiBasketballProvider,
  useApiBasketballClient,
  useApiBasketballStore,
  useApiBasketballStoreContext,
} from "./basketball-context";
export type { ApiBasketballProviderProps } from "./basketball-context";

// Types and keys
export { apiBasketballKeys } from "./basketball-types";
export type {
  UseApiBasketballQueryOptions,
  UseApiBasketballQueryOptionsRequired,
} from "./basketball-types";

// Countries hook
export { useBasketballCountries } from "./use-basketball-countries";

// Games hooks
export {
  useBasketballGames,
  useBasketballGamesHeadToHead,
  useBasketballGameStatistics,
} from "./use-basketball-games";

// Leagues hook
export { useBasketballLeagues } from "./use-basketball-leagues";

// Seasons hook
export { useBasketballSeasons } from "./use-basketball-seasons";

// Standings hook
export { useBasketballStandings } from "./use-basketball-standings";

// Teams hooks
export {
  useBasketballTeams,
  useBasketballTeamStatistics,
} from "./use-basketball-teams";

// Timezone hook
export { useBasketballTimezone } from "./use-basketball-timezone";
