/**
 * @module formula1
 * @description API-Formula-1 client library exports
 *
 * Provides type-safe access to the API-Formula-1 API with React hooks,
 * Zustand caching, and React Query integration.
 */

// Types
export type {
  ApiF1Config,
  ApiF1Response,
  F1Circuit,
  F1CircuitsParams,
  F1Competition,
  F1CompetitionsParams,
  F1Driver,
  F1DriverRanking,
  F1DriverRankingsParams,
  F1DriversParams,
  F1PitStop,
  F1PitStopsParams,
  F1Race,
  F1RacesParams,
  F1RaceStatus,
  F1SeasonsParams,
  F1Team,
  F1TeamRanking,
  F1TeamRankingsParams,
  F1TeamsParams,
  F1Timezone,
} from "./types";

// Network
export {
  ApiF1Client,
  createApiF1Client,
  F1_API_BASE_URL,
  F1_DEFAULT_HEADERS,
  F1_ENDPOINTS,
  F1_RAPIDAPI_HOST,
} from "./network";

// Store
export { createApiF1Store, type ApiF1State, type ApiF1Store } from "./store";

// Hooks
export {
  ApiF1Provider,
  apiF1Keys,
  useApiF1Client,
  useApiF1Store,
  useApiF1StoreContext,
  useF1Circuits,
  useF1Competitions,
  useF1DriverRankings,
  useF1Drivers,
  useF1PitStops,
  useF1Races,
  useF1Seasons,
  useF1TeamRankings,
  useF1Teams,
  useF1Timezone,
  type ApiF1ProviderProps,
  type UseApiF1QueryOptions,
  type UseApiF1QueryOptionsRequired,
} from "./hooks";
