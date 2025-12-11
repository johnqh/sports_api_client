/**
 * @module hooks/basketball-context
 * @description React context for API-Basketball client and store
 *
 * Provides the ApiBasketballClient and store instances to all hooks via React context.
 * Must wrap your app with ApiBasketballProvider to use the hooks.
 *
 * @example
 * ```typescript
 * import { ApiBasketballProvider } from "@sudobility/sports_api_client";
 * import type { StorageService } from "@sudobility/di";
 *
 * const storageService = container.get<StorageService>(ServiceKeys.STORAGE);
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

import React, {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
} from "react";
import type { StorageService } from "@sudobility/di";
import type { ApiBasketballClient } from "../network/api-basketball-client";
import {
  type ApiBasketballState,
  type ApiBasketballStore,
  createApiBasketballStore,
  createStorageAdapter,
} from "../store";

/**
 * Context value containing the API client and store
 */
interface ApiBasketballContextValue {
  client: ApiBasketballClient;
  useStore: ApiBasketballStore;
}

/**
 * React context for API-Basketball client and store
 * @internal
 */
const ApiBasketballContext = createContext<ApiBasketballContextValue | null>(
  null,
);

/**
 * Props for ApiBasketballProvider
 */
export interface ApiBasketballProviderProps {
  /** The ApiBasketballClient instance to provide */
  client: ApiBasketballClient;
  /** Storage service from DI for cross-platform persistence */
  storageService: StorageService;
  /** Child components */
  children: ReactNode;
}

/**
 * Provider component for API-Basketball hooks
 *
 * Wrap your application with this provider to enable API-Basketball hooks.
 * You must also wrap with QueryClientProvider from @tanstack/react-query.
 *
 * @param props - Provider props including client, storageService, and children
 * @returns Provider component
 *
 * @example
 * ```typescript
 * import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
 * import { ApiBasketballProvider, ApiBasketballClient } from "@sudobility/sports_api_client";
 *
 * const queryClient = new QueryClient();
 * const storageService = container.get<StorageService>(ServiceKeys.STORAGE);
 * const apiClient = new ApiBasketballClient(networkClient, { apiKey: "YOUR_KEY" });
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
export function ApiBasketballProvider({
  client,
  storageService,
  children,
}: ApiBasketballProviderProps) {
  // Create store once with the provided storage service
  const useStore = useMemo(
    () => createApiBasketballStore(createStorageAdapter(storageService)),
    [storageService],
  );

  const contextValue = useMemo(
    () => ({ client, useStore }),
    [client, useStore],
  );

  return (
    <ApiBasketballContext.Provider value={contextValue}>
      {children}
    </ApiBasketballContext.Provider>
  );
}

/**
 * Hook to access the ApiBasketballClient from context
 *
 * @returns The ApiBasketballClient instance
 * @throws Error if used outside of ApiBasketballProvider
 */
export function useApiBasketballClient(): ApiBasketballClient {
  const context = useContext(ApiBasketballContext);
  if (!context) {
    throw new Error(
      "useApiBasketballClient must be used within an ApiBasketballProvider",
    );
  }
  return context.client;
}

/**
 * Hook to access the API-Basketball Zustand store from context
 *
 * @returns The Zustand store hook for API-Basketball state
 * @throws Error if used outside of ApiBasketballProvider
 */
export function useApiBasketballStoreContext(): ApiBasketballStore {
  const context = useContext(ApiBasketballContext);
  if (!context) {
    throw new Error(
      "useApiBasketballStoreContext must be used within an ApiBasketballProvider",
    );
  }
  return context.useStore;
}

/**
 * Hook to access API-Basketball store state
 *
 * Convenience hook that combines context access with store selection.
 * Returns the full state object with all methods and data.
 *
 * @returns Full store state with getters, setters, and cached data
 * @throws Error if used outside of ApiBasketballProvider
 */
export function useApiBasketballStore(): ApiBasketballState {
  const useStore = useApiBasketballStoreContext();
  return useStore((state) => state);
}
