/**
 * @module hooks/hockey-context
 * @description React context for API-Hockey client and store
 */

import React, {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
} from "react";
import type { StorageService } from "@sudobility/di";
import type { ApiHockeyClient } from "../network/api-hockey-client";
import {
  type ApiHockeyState,
  type ApiHockeyStore,
  createApiHockeyStore,
  createStorageAdapter,
} from "../store";

/**
 * Context value containing the API client and store
 */
interface ApiHockeyContextValue {
  client: ApiHockeyClient;
  useStore: ApiHockeyStore;
}

/**
 * React context for API-Hockey client and store
 * @internal
 */
const ApiHockeyContext = createContext<ApiHockeyContextValue | null>(null);

/**
 * Props for ApiHockeyProvider
 */
export interface ApiHockeyProviderProps {
  /** The ApiHockeyClient instance to provide */
  client: ApiHockeyClient;
  /** Storage service from DI for cross-platform persistence */
  storageService: StorageService;
  /** Child components */
  children: ReactNode;
}

/**
 * Provider component for API-Hockey hooks
 *
 * @param props - Provider props including client, storageService, and children
 * @returns Provider component
 */
export function ApiHockeyProvider({
  client,
  storageService,
  children,
}: ApiHockeyProviderProps) {
  // Create store once with the provided storage service
  const useStore = useMemo(
    () => createApiHockeyStore(createStorageAdapter(storageService)),
    [storageService],
  );

  const contextValue = useMemo(
    () => ({ client, useStore }),
    [client, useStore],
  );

  return (
    <ApiHockeyContext.Provider value={contextValue}>
      {children}
    </ApiHockeyContext.Provider>
  );
}

/**
 * Hook to access the ApiHockeyClient from context
 *
 * @returns The ApiHockeyClient instance
 * @throws Error if used outside of ApiHockeyProvider
 */
export function useApiHockeyClient(): ApiHockeyClient {
  const context = useContext(ApiHockeyContext);
  if (!context) {
    throw new Error(
      "useApiHockeyClient must be used within an ApiHockeyProvider",
    );
  }
  return context.client;
}

/**
 * Hook to access the API-Hockey Zustand store from context
 *
 * @returns The Zustand store hook for API-Hockey state
 * @throws Error if used outside of ApiHockeyProvider
 */
export function useApiHockeyStoreContext(): ApiHockeyStore {
  const context = useContext(ApiHockeyContext);
  if (!context) {
    throw new Error(
      "useApiHockeyStoreContext must be used within an ApiHockeyProvider",
    );
  }
  return context.useStore;
}

/**
 * Hook to access API-Hockey store state
 *
 * @returns Full store state with getters, setters, and cached data
 * @throws Error if used outside of ApiHockeyProvider
 */
export function useApiHockeyStore(): ApiHockeyState {
  const useStore = useApiHockeyStoreContext();
  return useStore((state) => state);
}
