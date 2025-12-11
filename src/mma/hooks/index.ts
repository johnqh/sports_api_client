/**
 * @module mma/hooks
 * @description Hook exports for API-MMA
 */

export {
  ApiMmaProvider,
  useApiMmaClient,
  useApiMmaStore,
  useApiMmaStoreContext,
  type ApiMmaProviderProps,
} from "./mma-context";

export {
  apiMmaKeys,
  type UseApiMmaQueryOptions,
  type UseApiMmaQueryOptionsRequired,
} from "./mma-types";

export { useMmaTimezone } from "./use-mma-timezone";
export { useMmaCountries } from "./use-mma-countries";
export { useMmaSeasons } from "./use-mma-seasons";
export { useMmaLeagues } from "./use-mma-leagues";
export { useMmaCategories } from "./use-mma-categories";
export { useMmaFighters } from "./use-mma-fighters";
export { useMmaFights } from "./use-mma-fights";
