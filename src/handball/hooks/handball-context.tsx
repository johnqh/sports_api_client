/**
 * @module hooks/handball-context
 * @description React context for API-Handball client and store
 */

import React, {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
} from "react";
import type { StorageService } from "@sudobility/di";
import type { ApiHandballClient } from "../network/api-handball-client";
import {
  type ApiHandballState,
  type ApiHandballStore,
  createApiHandballStore,
  createStorageAdapter,
} from "../store";

/**
 * Context value containing the API client and store
 */
interface ApiHandballContextValue {
  client: ApiHandballClient;
  useStore: ApiHandballStore;
}

/**
 * React context for API-Handball client and store
 * @internal
 */
const ApiHandballContext = createContext<ApiHandballContextValue | null>(null);

/**
 * Props for ApiHandballProvider
 */
export interface ApiHandballProviderProps {
  /** The ApiHandballClient instance to provide */
  client: ApiHandballClient;
  /** Storage service from DI for cross-platform persistence */
  storageService: StorageService;
  /** Child components */
  children: ReactNode;
}

/**
 * Provider component for API-Handball hooks
 */
export function ApiHandballProvider({
  client,
  storageService,
  children,
}: ApiHandballProviderProps) {
  // Create store once with the provided storage service
  const useStore = useMemo(
    () => createApiHandballStore(createStorageAdapter(storageService)),
    [storageService],
  );

  const contextValue = useMemo(
    () => ({ client, useStore }),
    [client, useStore],
  );

  return (
    <ApiHandballContext.Provider value={contextValue}>
      {children}
    </ApiHandballContext.Provider>
  );
}

/**
 * Hook to access the ApiHandballClient from context
 */
export function useApiHandballClient(): ApiHandballClient {
  const context = useContext(ApiHandballContext);
  if (!context) {
    throw new Error(
      "useApiHandballClient must be used within an ApiHandballProvider",
    );
  }
  return context.client;
}

/**
 * Hook to access the API-Handball Zustand store from context
 */
export function useApiHandballStoreContext(): ApiHandballStore {
  const context = useContext(ApiHandballContext);
  if (!context) {
    throw new Error(
      "useApiHandballStoreContext must be used within an ApiHandballProvider",
    );
  }
  return context.useStore;
}

/**
 * Hook to access API-Handball store state
 */
export function useApiHandballStore(): ApiHandballState {
  const useStore = useApiHandballStoreContext();
  return useStore((state) => state);
}
