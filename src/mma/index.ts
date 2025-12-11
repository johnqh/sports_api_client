/**
 * @module mma
 * @description API-MMA client library exports
 */

// Types
export type {
  ApiMmaConfig,
  ApiMmaResponse,
  MmaCategoriesParams,
  MmaCategory,
  MmaCountriesParams,
  MmaCountry,
  MmaFight,
  MmaFighter,
  MmaFightersParams,
  MmaFightResult,
  MmaFightsParams,
  MmaFightStatus,
  MmaLeague,
  MmaLeagueResponse,
  MmaLeaguesParams,
  MmaSeason,
  MmaSeasonsParams,
  MmaTimezone,
} from "./types";

// Network
export {
  ApiMmaClient,
  createApiMmaClient,
  MMA_API_BASE_URL,
  MMA_DEFAULT_HEADERS,
  MMA_ENDPOINTS,
  MMA_RAPIDAPI_HOST,
} from "./network";

// Store
export { createApiMmaStore, type ApiMmaState, type ApiMmaStore } from "./store";

// Hooks
export {
  ApiMmaProvider,
  apiMmaKeys,
  useApiMmaClient,
  useApiMmaStore,
  useApiMmaStoreContext,
  useMmaCategories,
  useMmaCountries,
  useMmaFighters,
  useMmaFights,
  useMmaLeagues,
  useMmaSeasons,
  useMmaTimezone,
  type ApiMmaProviderProps,
  type UseApiMmaQueryOptions,
  type UseApiMmaQueryOptionsRequired,
} from "./hooks";
