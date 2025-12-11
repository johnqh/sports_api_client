/**
 * @module hooks/context
 * @description React context for API-Football client and store
 *
 * Provides the ApiFootballClient and store instances to all hooks via React context.
 * Must wrap your app with ApiFootballProvider to use the hooks.
 *
 * Uses DI pattern for cross-platform compatibility (React and React Native).
 *
 * @example
 * ```typescript
 * import { ApiFootballProvider } from "@sudobility/sports_api_client";
 * import type { StorageService } from "@sudobility/di";
 *
 * // Get services from your DI container
 * const storageService = container.get<StorageService>(ServiceKeys.STORAGE);
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

import React, {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
} from "react";
import type { StorageService } from "@sudobility/di";
import type { ApiFootballClient } from "../network/api-football-client";
import {
  type ApiFootballState,
  type ApiFootballStore,
  createApiFootballStore,
  createStorageAdapter,
} from "../store";

/**
 * Context value containing the API client and store
 */
interface ApiFootballContextValue {
  client: ApiFootballClient;
  useStore: ApiFootballStore;
}

/**
 * React context for API-Football client and store
 * @internal
 */
const ApiFootballContext = createContext<ApiFootballContextValue | null>(null);

/**
 * Props for ApiFootballProvider
 */
export interface ApiFootballProviderProps {
  /** The ApiFootballClient instance to provide */
  client: ApiFootballClient;
  /** Storage service from DI for cross-platform persistence */
  storageService: StorageService;
  /** Child components */
  children: ReactNode;
}

/**
 * Provider component for API-Football hooks
 *
 * Wrap your application with this provider to enable API-Football hooks.
 * You must also wrap with QueryClientProvider from @tanstack/react-query.
 *
 * Requires a StorageService from your DI container for cross-platform
 * React Native compatibility.
 *
 * @param props - Provider props including client, storageService, and children
 * @returns Provider component
 *
 * @example
 * ```typescript
 * import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
 * import { ApiFootballProvider, ApiFootballClient } from "@sudobility/sports_api_client";
 * import type { StorageService, NetworkClient } from "@sudobility/di";
 *
 * const queryClient = new QueryClient();
 *
 * // Get services from your DI container
 * const networkClient = container.get<NetworkClient>(ServiceKeys.NETWORK);
 * const storageService = container.get<StorageService>(ServiceKeys.STORAGE);
 *
 * const apiClient = new ApiFootballClient(networkClient, { apiKey: "YOUR_KEY" });
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
export function ApiFootballProvider({
  client,
  storageService,
  children,
}: ApiFootballProviderProps) {
  // Create store once with the provided storage service
  const useStore = useMemo(
    () => createApiFootballStore(createStorageAdapter(storageService)),
    [storageService],
  );

  const contextValue = useMemo(
    () => ({ client, useStore }),
    [client, useStore],
  );

  return (
    <ApiFootballContext.Provider value={contextValue}>
      {children}
    </ApiFootballContext.Provider>
  );
}

/**
 * Hook to access the ApiFootballClient from context
 *
 * @returns The ApiFootballClient instance
 * @throws Error if used outside of ApiFootballProvider
 *
 * @example
 * ```typescript
 * function MyComponent() {
 *   const client = useApiFootballClient();
 *   // Use client directly if needed
 * }
 * ```
 */
export function useApiFootballClient(): ApiFootballClient {
  const context = useContext(ApiFootballContext);
  if (!context) {
    throw new Error(
      "useApiFootballClient must be used within an ApiFootballProvider",
    );
  }
  return context.client;
}

/**
 * Hook to access the API-Football Zustand store from context
 *
 * @returns The Zustand store hook for API-Football state
 * @throws Error if used outside of ApiFootballProvider
 *
 * @example
 * ```typescript
 * function MyComponent() {
 *   const useStore = useApiFootballStoreContext();
 *   const { getLeagues, setLeagues, cacheTTL } = useStore();
 *   // ...
 * }
 * ```
 */
export function useApiFootballStoreContext(): ApiFootballStore {
  const context = useContext(ApiFootballContext);
  if (!context) {
    throw new Error(
      "useApiFootballStoreContext must be used within an ApiFootballProvider",
    );
  }
  return context.useStore;
}

/**
 * Hook to access API-Football store state
 *
 * Convenience hook that combines context access with store selection.
 * Returns the full state object with all methods and data.
 *
 * @returns Full store state with getters, setters, and cached data
 * @throws Error if used outside of ApiFootballProvider
 *
 * @example
 * ```typescript
 * function MyComponent() {
 *   const { getLeagues, setLeagues, cacheTTL } = useApiFootballStore();
 *   // ...
 * }
 * ```
 */
export function useApiFootballStore(): ApiFootballState {
  const useStore = useApiFootballStoreContext();
  return useStore((state) => state);
}
