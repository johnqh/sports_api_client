/**
 * @sudobility/sports_api_client - Multi-Sport API Client Library
 *
 * React and React Native compatible client for api-sports.io APIs.
 * Supports multiple sports: Football, Basketball, Hockey, NFL, and more.
 * Uses dependency injection for network requests, React Query for data fetching,
 * and Zustand for persistent local caching.
 *
 * Note: Types from @sudobility/types are not re-exported.
 * Import them directly from @sudobility/types as a peer dependency.
 *
 * @example
 * ```typescript
 * // Using the Football client directly
 * import { ApiFootballClient, createApiFootballStore } from '@sudobility/sports_api_client';
 *
 * const client = new ApiFootballClient(networkClient, { apiKey: 'YOUR_KEY' });
 * const leagues = await client.getLeagues({ country: 'England' });
 *
 * // Using React hooks
 * import {
 *   ApiFootballProvider,
 *   useFootballLeagues,
 *   useFootballFixtures,
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
 *   const { data, isLoading } = useFootballLeagues({ params: { country: 'England' } });
 *   // ...
 * }
 * ```
 */

// Export common/shared types
export * from "./common";

// Football exports
export * from "./football/network";

// Export store and cache utilities
export * from "./football/store";

// Export all types
export * from "./football/types";

// Export utilities
export * from "./utils";

// Export React hooks
export * from "./football/hooks";

// Basketball exports
export * from "./basketball";

// Hockey exports
export * from "./hockey";
