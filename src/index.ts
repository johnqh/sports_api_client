/**
 * @sudobility/sports_api_client - API-Football v3 Client Library
 *
 * React and React Native compatible client for API-Football v3 API.
 * Uses dependency injection for network requests, React Query for data fetching,
 * and Zustand for persistent local caching.
 *
 * Note: Types from @sudobility/types are not re-exported.
 * Import them directly from @sudobility/types as a peer dependency.
 *
 * @example
 * ```typescript
 * // Using the client directly
 * import { ApiFootballClient, createApiFootballStore } from '@sudobility/sports_api_client';
 *
 * const client = new ApiFootballClient(networkClient, { apiKey: 'YOUR_KEY' });
 * const leagues = await client.getLeagues({ country: 'England' });
 *
 * // Using React hooks
 * import {
 *   ApiFootballProvider,
 *   useLeagues,
 *   useFixtures,
 * } from '@sudobility/sports_api_client';
 * import { QueryClientProvider } from '@tanstack/react-query';
 *
 * function App() {
 *   return (
 *     <QueryClientProvider client={queryClient}>
 *       <ApiFootballProvider client={apiClient}>
 *         <YourApp />
 *       </ApiFootballProvider>
 *     </QueryClientProvider>
 *   );
 * }
 *
 * function LeagueList() {
 *   const { data, isLoading } = useLeagues({ params: { country: 'England' } });
 *   // ...
 * }
 * ```
 */

// Export network client and factory
export * from "./football/network";

// Export store and cache utilities
export * from "./football/store";

// Export all types
export * from "./football/types";

// Export utilities
export * from "./utils";

// Export React hooks
export * from "./football/hooks";
