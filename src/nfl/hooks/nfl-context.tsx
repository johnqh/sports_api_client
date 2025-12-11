/**
 * @module hooks/nfl-context
 * @description React context for API-NFL client and store
 */

import React, {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
} from "react";
import type { StorageService } from "@sudobility/di";
import type { ApiNflClient } from "../network/api-nfl-client";
import {
  type ApiNflState,
  type ApiNflStore,
  createApiNflStore,
  createStorageAdapter,
} from "../store";

/**
 * Context value containing the API client and store
 */
interface ApiNflContextValue {
  client: ApiNflClient;
  useStore: ApiNflStore;
}

/**
 * React context for API-NFL client and store
 * @internal
 */
const ApiNflContext = createContext<ApiNflContextValue | null>(null);

/**
 * Props for ApiNflProvider
 */
export interface ApiNflProviderProps {
  /** The ApiNflClient instance to provide */
  client: ApiNflClient;
  /** Storage service from DI for cross-platform persistence */
  storageService: StorageService;
  /** Child components */
  children: ReactNode;
}

/**
 * Provider component for API-NFL hooks
 *
 * @param props - Provider props including client, storageService, and children
 * @returns Provider component
 */
export function ApiNflProvider({
  client,
  storageService,
  children,
}: ApiNflProviderProps) {
  // Create store once with the provided storage service
  const useStore = useMemo(
    () => createApiNflStore(createStorageAdapter(storageService)),
    [storageService],
  );

  const contextValue = useMemo(
    () => ({ client, useStore }),
    [client, useStore],
  );

  return (
    <ApiNflContext.Provider value={contextValue}>
      {children}
    </ApiNflContext.Provider>
  );
}

/**
 * Hook to access the ApiNflClient from context
 *
 * @returns The ApiNflClient instance
 * @throws Error if used outside of ApiNflProvider
 */
export function useApiNflClient(): ApiNflClient {
  const context = useContext(ApiNflContext);
  if (!context) {
    throw new Error("useApiNflClient must be used within an ApiNflProvider");
  }
  return context.client;
}

/**
 * Hook to access the API-NFL Zustand store from context
 *
 * @returns The Zustand store hook for API-NFL state
 * @throws Error if used outside of ApiNflProvider
 */
export function useApiNflStoreContext(): ApiNflStore {
  const context = useContext(ApiNflContext);
  if (!context) {
    throw new Error(
      "useApiNflStoreContext must be used within an ApiNflProvider",
    );
  }
  return context.useStore;
}

/**
 * Hook to access API-NFL store state
 *
 * @returns Full store state with getters, setters, and cached data
 * @throws Error if used outside of ApiNflProvider
 */
export function useApiNflStore(): ApiNflState {
  const useStore = useApiNflStoreContext();
  return useStore((state) => state);
}
