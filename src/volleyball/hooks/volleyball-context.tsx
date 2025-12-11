/**
 * @module hooks/volleyball-context
 * @description React context for API-Volleyball client and store
 */

import React, {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
} from "react";
import type { StorageService } from "@sudobility/di";
import type { ApiVolleyballClient } from "../network/api-volleyball-client";
import {
  type ApiVolleyballState,
  type ApiVolleyballStore,
  createApiVolleyballStore,
  createStorageAdapter,
} from "../store";

/**
 * Context value containing the API client and store
 */
interface ApiVolleyballContextValue {
  client: ApiVolleyballClient;
  useStore: ApiVolleyballStore;
}

/**
 * React context for API-Volleyball client and store
 * @internal
 */
const ApiVolleyballContext = createContext<ApiVolleyballContextValue | null>(
  null,
);

/**
 * Props for ApiVolleyballProvider
 */
export interface ApiVolleyballProviderProps {
  /** The ApiVolleyballClient instance to provide */
  client: ApiVolleyballClient;
  /** Storage service from DI for cross-platform persistence */
  storageService: StorageService;
  /** Child components */
  children: ReactNode;
}

/**
 * Provider component for API-Volleyball hooks
 */
export function ApiVolleyballProvider({
  client,
  storageService,
  children,
}: ApiVolleyballProviderProps) {
  // Create store once with the provided storage service
  const useStore = useMemo(
    () => createApiVolleyballStore(createStorageAdapter(storageService)),
    [storageService],
  );

  const contextValue = useMemo(
    () => ({ client, useStore }),
    [client, useStore],
  );

  return (
    <ApiVolleyballContext.Provider value={contextValue}>
      {children}
    </ApiVolleyballContext.Provider>
  );
}

/**
 * Hook to access the ApiVolleyballClient from context
 */
export function useApiVolleyballClient(): ApiVolleyballClient {
  const context = useContext(ApiVolleyballContext);
  if (!context) {
    throw new Error(
      "useApiVolleyballClient must be used within an ApiVolleyballProvider",
    );
  }
  return context.client;
}

/**
 * Hook to access the API-Volleyball Zustand store from context
 */
export function useApiVolleyballStoreContext(): ApiVolleyballStore {
  const context = useContext(ApiVolleyballContext);
  if (!context) {
    throw new Error(
      "useApiVolleyballStoreContext must be used within an ApiVolleyballProvider",
    );
  }
  return context.useStore;
}

/**
 * Hook to access API-Volleyball store state
 */
export function useApiVolleyballStore(): ApiVolleyballState {
  const useStore = useApiVolleyballStoreContext();
  return useStore((state) => state);
}
