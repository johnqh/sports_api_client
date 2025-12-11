/**
 * @module hooks/f1-context
 * @description React context for API-Formula-1 client and store
 */

import React, {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
} from "react";
import type { StorageService } from "@sudobility/di";
import type { ApiF1Client } from "../network/api-f1-client";
import {
  type ApiF1State,
  type ApiF1Store,
  createApiF1Store,
  createStorageAdapter,
} from "../store";

/**
 * Context value containing the API client and store
 */
interface ApiF1ContextValue {
  client: ApiF1Client;
  useStore: ApiF1Store;
}

/**
 * React context for API-Formula-1 client and store
 * @internal
 */
const ApiF1Context = createContext<ApiF1ContextValue | null>(null);

/**
 * Props for ApiF1Provider
 */
export interface ApiF1ProviderProps {
  /** The ApiF1Client instance to provide */
  client: ApiF1Client;
  /** Storage service from DI for cross-platform persistence */
  storageService: StorageService;
  /** Child components */
  children: ReactNode;
}

/**
 * Provider component for API-Formula-1 hooks
 *
 * @param props - Provider props including client, storageService, and children
 * @returns Provider component
 */
export function ApiF1Provider({
  client,
  storageService,
  children,
}: ApiF1ProviderProps) {
  // Create store once with the provided storage service
  const useStore = useMemo(
    () => createApiF1Store(createStorageAdapter(storageService)),
    [storageService],
  );

  const contextValue = useMemo(
    () => ({ client, useStore }),
    [client, useStore],
  );

  return (
    <ApiF1Context.Provider value={contextValue}>
      {children}
    </ApiF1Context.Provider>
  );
}

/**
 * Hook to access the ApiF1Client from context
 *
 * @returns The ApiF1Client instance
 * @throws Error if used outside of ApiF1Provider
 */
export function useApiF1Client(): ApiF1Client {
  const context = useContext(ApiF1Context);
  if (!context) {
    throw new Error("useApiF1Client must be used within an ApiF1Provider");
  }
  return context.client;
}

/**
 * Hook to access the API-Formula-1 Zustand store from context
 *
 * @returns The Zustand store hook for API-Formula-1 state
 * @throws Error if used outside of ApiF1Provider
 */
export function useApiF1StoreContext(): ApiF1Store {
  const context = useContext(ApiF1Context);
  if (!context) {
    throw new Error(
      "useApiF1StoreContext must be used within an ApiF1Provider",
    );
  }
  return context.useStore;
}

/**
 * Hook to access API-Formula-1 store state
 *
 * @returns Full store state with getters, setters, and cached data
 * @throws Error if used outside of ApiF1Provider
 */
export function useApiF1Store(): ApiF1State {
  const useStore = useApiF1StoreContext();
  return useStore((state) => state);
}
