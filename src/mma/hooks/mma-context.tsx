/**
 * @module hooks/mma-context
 * @description React context for API-MMA client and store
 */

import React, {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
} from "react";
import type { StorageService } from "@sudobility/di";
import type { ApiMmaClient } from "../network/api-mma-client";
import {
  type ApiMmaState,
  type ApiMmaStore,
  createApiMmaStore,
  createStorageAdapter,
} from "../store";

interface ApiMmaContextValue {
  client: ApiMmaClient;
  useStore: ApiMmaStore;
}

const ApiMmaContext = createContext<ApiMmaContextValue | null>(null);

export interface ApiMmaProviderProps {
  client: ApiMmaClient;
  storageService: StorageService;
  children: ReactNode;
}

export function ApiMmaProvider({
  client,
  storageService,
  children,
}: ApiMmaProviderProps) {
  const useStore = useMemo(
    () => createApiMmaStore(createStorageAdapter(storageService)),
    [storageService],
  );

  const contextValue = useMemo(
    () => ({ client, useStore }),
    [client, useStore],
  );

  return (
    <ApiMmaContext.Provider value={contextValue}>
      {children}
    </ApiMmaContext.Provider>
  );
}

export function useApiMmaClient(): ApiMmaClient {
  const context = useContext(ApiMmaContext);
  if (!context) {
    throw new Error("useApiMmaClient must be used within an ApiMmaProvider");
  }
  return context.client;
}

export function useApiMmaStoreContext(): ApiMmaStore {
  const context = useContext(ApiMmaContext);
  if (!context) {
    throw new Error(
      "useApiMmaStoreContext must be used within an ApiMmaProvider",
    );
  }
  return context.useStore;
}

export function useApiMmaStore(): ApiMmaState {
  const useStore = useApiMmaStoreContext();
  return useStore((state) => state);
}
