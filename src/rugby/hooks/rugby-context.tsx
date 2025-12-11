/**
 * @module hooks/rugby-context
 * @description React context for API-Rugby client and store
 */

import React, {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
} from "react";
import type { StorageService } from "@sudobility/di";
import type { ApiRugbyClient } from "../network/api-rugby-client";
import {
  type ApiRugbyState,
  type ApiRugbyStore,
  createApiRugbyStore,
  createStorageAdapter,
} from "../store";

/**
 * Context value containing the API client and store
 */
interface ApiRugbyContextValue {
  client: ApiRugbyClient;
  useStore: ApiRugbyStore;
}

/**
 * React context for API-Rugby client and store
 * @internal
 */
const ApiRugbyContext = createContext<ApiRugbyContextValue | null>(null);

/**
 * Props for ApiRugbyProvider
 */
export interface ApiRugbyProviderProps {
  /** The ApiRugbyClient instance to provide */
  client: ApiRugbyClient;
  /** Storage service from DI for cross-platform persistence */
  storageService: StorageService;
  /** Child components */
  children: ReactNode;
}

/**
 * Provider component for API-Rugby hooks
 *
 * @param props - Provider props including client, storageService, and children
 * @returns Provider component
 */
export function ApiRugbyProvider({
  client,
  storageService,
  children,
}: ApiRugbyProviderProps) {
  // Create store once with the provided storage service
  const useStore = useMemo(
    () => createApiRugbyStore(createStorageAdapter(storageService)),
    [storageService],
  );

  const contextValue = useMemo(
    () => ({ client, useStore }),
    [client, useStore],
  );

  return (
    <ApiRugbyContext.Provider value={contextValue}>
      {children}
    </ApiRugbyContext.Provider>
  );
}

/**
 * Hook to access the ApiRugbyClient from context
 *
 * @returns The ApiRugbyClient instance
 * @throws Error if used outside of ApiRugbyProvider
 */
export function useApiRugbyClient(): ApiRugbyClient {
  const context = useContext(ApiRugbyContext);
  if (!context) {
    throw new Error(
      "useApiRugbyClient must be used within an ApiRugbyProvider",
    );
  }
  return context.client;
}

/**
 * Hook to access the API-Rugby Zustand store from context
 *
 * @returns The Zustand store hook for API-Rugby state
 * @throws Error if used outside of ApiRugbyProvider
 */
export function useApiRugbyStoreContext(): ApiRugbyStore {
  const context = useContext(ApiRugbyContext);
  if (!context) {
    throw new Error(
      "useApiRugbyStoreContext must be used within an ApiRugbyProvider",
    );
  }
  return context.useStore;
}

/**
 * Hook to access API-Rugby store state
 *
 * @returns Full store state with getters, setters, and cached data
 * @throws Error if used outside of ApiRugbyProvider
 */
export function useApiRugbyStore(): ApiRugbyState {
  const useStore = useApiRugbyStoreContext();
  return useStore((state) => state);
}
