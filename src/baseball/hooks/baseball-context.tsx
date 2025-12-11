/**
 * @module hooks/baseball-context
 * @description React context for API-Baseball client and store
 */

import React, {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
} from "react";
import type { StorageService } from "@sudobility/di";
import type { ApiBaseballClient } from "../network/api-baseball-client";
import {
  type ApiBaseballState,
  type ApiBaseballStore,
  createApiBaseballStore,
  createStorageAdapter,
} from "../store";

/**
 * Context value containing the API client and store
 */
interface ApiBaseballContextValue {
  client: ApiBaseballClient;
  useStore: ApiBaseballStore;
}

/**
 * React context for API-Baseball client and store
 * @internal
 */
const ApiBaseballContext = createContext<ApiBaseballContextValue | null>(null);

/**
 * Props for ApiBaseballProvider
 */
export interface ApiBaseballProviderProps {
  /** The ApiBaseballClient instance to provide */
  client: ApiBaseballClient;
  /** Storage service from DI for cross-platform persistence */
  storageService: StorageService;
  /** Child components */
  children: ReactNode;
}

/**
 * Provider component for API-Baseball hooks
 *
 * @param props - Provider props including client, storageService, and children
 * @returns Provider component
 */
export function ApiBaseballProvider({
  client,
  storageService,
  children,
}: ApiBaseballProviderProps) {
  // Create store once with the provided storage service
  const useStore = useMemo(
    () => createApiBaseballStore(createStorageAdapter(storageService)),
    [storageService],
  );

  const contextValue = useMemo(
    () => ({ client, useStore }),
    [client, useStore],
  );

  return (
    <ApiBaseballContext.Provider value={contextValue}>
      {children}
    </ApiBaseballContext.Provider>
  );
}

/**
 * Hook to access the ApiBaseballClient from context
 *
 * @returns The ApiBaseballClient instance
 * @throws Error if used outside of ApiBaseballProvider
 */
export function useApiBaseballClient(): ApiBaseballClient {
  const context = useContext(ApiBaseballContext);
  if (!context) {
    throw new Error(
      "useApiBaseballClient must be used within an ApiBaseballProvider",
    );
  }
  return context.client;
}

/**
 * Hook to access the API-Baseball Zustand store from context
 *
 * @returns The Zustand store hook for API-Baseball state
 * @throws Error if used outside of ApiBaseballProvider
 */
export function useApiBaseballStoreContext(): ApiBaseballStore {
  const context = useContext(ApiBaseballContext);
  if (!context) {
    throw new Error(
      "useApiBaseballStoreContext must be used within an ApiBaseballProvider",
    );
  }
  return context.useStore;
}

/**
 * Hook to access API-Baseball store state
 *
 * @returns Full store state with getters, setters, and cached data
 * @throws Error if used outside of ApiBaseballProvider
 */
export function useApiBaseballStore(): ApiBaseballState {
  const useStore = useApiBaseballStoreContext();
  return useStore((state) => state);
}
