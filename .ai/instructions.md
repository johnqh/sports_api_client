# API-Football Client Library - Detailed AI Context

This document provides comprehensive context for AI assistants working on the API-Football client library.

## Project Purpose

This library provides a TypeScript client for the API-Football v3 API, enabling React and React Native applications to access comprehensive football (soccer) data.

### Key Use Cases

1. **Web-based football apps** using React
2. **Mobile sports apps** using React Native
3. **Fantasy football platforms** needing live data
4. **Sports analytics dashboards**
5. **Match trackers** with real-time updates

## Current State Analysis

### Implemented Endpoints (27 total)

| Category | Endpoints |
|----------|-----------|
| General | `getTimezone`, `getCountries`, `getSeasons` |
| Leagues | `getLeagues` |
| Teams | `getTeams`, `getTeamStatistics`, `getVenues` |
| Standings | `getStandings` |
| Fixtures | `getFixtures`, `getFixturesHeadToHead`, `getFixtureStatistics`, `getFixtureEvents`, `getFixtureLineups`, `getFixturePlayers` |
| Players | `getPlayers`, `getPlayersSeasons`, `getSquads`, `getTopScorers`, `getTopAssists`, `getTopCards` |
| Transfers | `getTransfers` |
| Trophies | `getTrophies` |
| Sidelined | `getSidelined` |
| Coaches | `getCoachs` |
| Injuries | `getInjuries` |

### React Hooks (24 total)

| Hook | Purpose |
|------|---------|
| `useTimezone` | Fetch available timezones |
| `useCountries` | Fetch countries |
| `useSeasons` | Fetch available seasons |
| `useLeagues` | Fetch leagues/cups |
| `useTeams` | Fetch teams |
| `useTeamStatistics` | Fetch team stats |
| `useVenues` | Fetch stadiums |
| `useStandings` | Fetch league tables |
| `useFixtures` | Fetch matches |
| `useFixturesHeadToHead` | Fetch H2H history |
| `useFixtureStatistics` | Fetch match stats |
| `useFixtureEvents` | Fetch goals, cards, etc. |
| `useFixtureLineups` | Fetch team lineups |
| `useFixturePlayers` | Fetch player stats in match |
| `usePlayers` | Fetch player info |
| `usePlayersSeasons` | Fetch player seasons |
| `useSquads` | Fetch team squads |
| `useTopScorers` | Fetch top scorers |
| `useTopAssists` | Fetch top assisters |
| `useTopCards` | Fetch most carded players |
| `useTransfers` | Fetch transfer history |
| `useTrophies` | Fetch trophies |
| `useSidelined` | Fetch injured/suspended |
| `useCoaches` | Fetch coach info |
| `useInjuries` | Fetch current injuries |

### Strengths

1. **Type Safety**: Comprehensive TypeScript types for all API responses
2. **Dual Caching**: React Query + Zustand for optimal performance
3. **Cross-Platform**: Works with React and React Native
4. **DI Pattern**: NetworkClient injection for flexibility
5. **Well-Tested**: Unit tests for client and store
6. **Clean Architecture**: Separation of concerns

### Potential Improvements

1. **More Endpoints**: API-Football has many more endpoints (predictions, odds, etc.)
2. **Offline Support**: Enhanced offline-first capabilities
3. **Real-time Updates**: WebSocket support for live matches
4. **Pagination Helpers**: Utilities for paginated results
5. **Rate Limiting**: Built-in rate limit handling

## Technical Architecture

### Data Flow

```
User Action
    ↓
React Component
    ↓
useX Hook (React Query)
    ↓
Check Zustand Cache (initialData)
    ↓
ApiFootballClient
    ↓
NetworkClient (DI)
    ↓
API-Football v3 API
    ↓
Response → Update Zustand Cache
    ↓
React Query Cache
    ↓
Component Re-render
```

### File Structure

```
src/
├── index.ts                    # Main exports
├── network/
│   ├── api-football-client.ts  # Main client class (27 methods)
│   ├── api-football-client.test.ts
│   ├── endpoints.ts            # API endpoint constants
│   └── index.ts
├── hooks/
│   ├── context.tsx             # ApiFootballProvider
│   ├── types.ts                # Query keys factory
│   ├── index.ts                # Hook exports
│   ├── use-timezone.ts
│   ├── use-countries.ts
│   ├── use-seasons.ts
│   ├── use-leagues.ts
│   ├── use-teams.ts
│   ├── use-standings.ts
│   ├── use-fixtures.ts
│   ├── use-players.ts
│   ├── use-transfers.ts
│   ├── use-trophies.ts
│   ├── use-sidelined.ts
│   ├── use-coaches.ts
│   └── use-injuries.ts
├── store/
│   ├── api-football-store.ts   # Zustand store
│   ├── api-football-store.test.ts
│   ├── cache-utils.ts          # Cache key generation
│   └── index.ts
├── types/
│   ├── common.ts               # Base types (ApiFootballResponse, etc.)
│   ├── countries.ts
│   ├── leagues.ts
│   ├── teams.ts
│   ├── fixtures.ts
│   ├── statistics.ts
│   ├── standings.ts
│   ├── players.ts
│   ├── transfers.ts
│   └── index.ts
└── utils/
    ├── query-params.ts         # Query string builder
    └── index.ts
```

### Query Key Factory Pattern

All hooks use `apiFootballKeys` for consistent cache key management:

```typescript
export const apiFootballKeys = {
  all: BASE_KEY,
  timezone: () => [...BASE_KEY, "timezone"] as const,
  countries: {
    all: [...BASE_KEY, "countries"] as const,
    list: (params?: object) => [...BASE_KEY, "countries", params ?? {}] as const,
  },
  fixtures: {
    all: [...BASE_KEY, "fixtures"] as const,
    list: (params?: object) => [...BASE_KEY, "fixtures", params ?? {}] as const,
    headToHead: (params: object) => [...BASE_KEY, "fixtures", "h2h", params] as const,
    // ...
  },
  // ...
} as const;
```

### Hook Implementation Pattern

Every hook follows this structure:

```typescript
export function useFeature(
  options: UseApiFootballQueryOptionsRequired<ResponseType, ParamsType>,
) {
  // 1. Get client from context
  const client = useApiFootballClient();

  // 2. Get cache methods from Zustand
  const { getCache, setCache, cacheTTL } = useApiFootballStore();

  // 3. Extract params and query options
  const { params, ...queryOptions } = options;

  // 4. Generate cache key
  const cacheKey = generateCacheKey("feature", params as unknown as Record<string, unknown>);

  // 5. Return React Query hook
  return useQuery({
    queryKey: apiFootballKeys.feature.list(params),

    queryFn: async () => {
      const response = await client.getFeature(params);
      // Update Zustand cache
      setCache(cacheKey, response.response);
      return response;
    },

    // Use Zustand as initialData
    initialData: () => {
      const cached = getCache(cacheKey);
      if (cached) {
        return {
          get: "feature",
          parameters: {} as Record<string, string>,
          errors: [] as string[],
          results: cached.length,
          paging: { current: 1, total: 1 },
          response: cached,
        };
      }
      return undefined;
    },

    staleTime: cacheTTL,
    ...queryOptions,
  });
}
```

### Zustand Store Structure

```typescript
interface ApiFootballState {
  // Cache TTL (default 5 minutes)
  cacheTTL: number;
  setCacheTTL: (ttl: number) => void;

  // Validation helper
  isCacheValid: (timestamp: number) => boolean;

  // Each data type has get/set with timestamps
  timezones: CacheEntry<string[]> | null;
  setTimezones: (data: string[]) => void;

  countries: CacheEntry<Country[]> | null;
  setCountries: (data: Country[]) => void;

  // Dynamic caches use key-based storage
  leagues: Map<string, LeagueResponse[]>;
  getLeagues: (key: string) => LeagueResponse[] | null;
  setLeagues: (key: string, data: LeagueResponse[]) => void;

  // ... other caches
}
```

## Development Patterns

### Adding a New Endpoint

**Step 1: Add Types**
```typescript
// In src/types/newfeature.ts
export interface NewFeatureParams {
  id?: number;
  name?: string;
}

export interface NewFeature {
  id: number;
  name: string;
  // ...
}
```

**Step 2: Add Endpoint Constant**
```typescript
// In src/network/endpoints.ts
export const ENDPOINTS = {
  // ...existing
  NEW_FEATURE: "/newfeature",
};
```

**Step 3: Add Client Method**
```typescript
// In src/network/api-football-client.ts
async getNewFeature(
  params: NewFeatureParams,
): Promise<ApiFootballResponse<NewFeature>> {
  const query = buildQueryString(params);
  return this.request<NewFeature>(`${ENDPOINTS.NEW_FEATURE}${query}`);
}
```

**Step 4: Add Store Cache**
```typescript
// In src/store/api-football-store.ts
newFeature: Map<string, NewFeature[]>;
getNewFeature: (key: string) => NewFeature[] | null;
setNewFeature: (key: string, data: NewFeature[]) => void;
```

**Step 5: Add Query Keys**
```typescript
// In src/hooks/types.ts
export const apiFootballKeys = {
  // ...existing
  newFeature: {
    all: [...BASE_KEY, "newfeature"] as const,
    list: (params?: object) => [...BASE_KEY, "newfeature", params ?? {}] as const,
  },
};
```

**Step 6: Create Hook**
```typescript
// In src/hooks/use-new-feature.ts
export function useNewFeature(
  options: UseApiFootballQueryOptionsRequired<NewFeature, NewFeatureParams>,
) {
  // ... follow the pattern
}
```

**Step 7: Export**
```typescript
// In src/hooks/index.ts
export { useNewFeature } from "./use-new-feature";

// In src/types/index.ts
export * from "./newfeature";
```

**Step 8: Test**
```typescript
// Add tests for new functionality
npm run check-all
```

### Testing Strategy

#### Unit Tests
- Mock NetworkClient responses
- Test success and error paths
- Verify cache updates
- Test edge cases

#### Test File Organization
- `*.test.ts` adjacent to source files
- Use Vitest and happy-dom
- Mock external dependencies

## API Reference

### Authentication

The client supports two authentication methods:

1. **Direct API-Sports Authentication**
```typescript
const client = new ApiFootballClient(networkClient, {
  apiKey: "YOUR_API_KEY",
});
```

2. **RapidAPI Authentication**
```typescript
const client = new ApiFootballClient(networkClient, {
  apiKey: "YOUR_RAPIDAPI_KEY",
  useRapidApi: true,
  rapidApiHost: "api-football-v1.p.rapidapi.com",
});
```

### Response Format

All API responses follow this structure:

```typescript
interface ApiFootballResponse<T> {
  get: string;           // Endpoint name
  parameters: Record<string, string>;  // Request params
  errors: string[];      // Error messages
  results: number;       // Number of results
  paging: {
    current: number;
    total: number;
  };
  response: T[];         // Data array
}
```

### Common Parameters

Most endpoints accept these common parameters:

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | Filter by specific ID |
| `league` | number | Filter by league ID |
| `season` | number | Filter by season year (YYYY) |
| `team` | number | Filter by team ID |
| `search` | string | Search by name (min 3 chars) |

### Endpoint-Specific Notes

**Fixtures**
- Use `live: "all"` for live matches
- Use `date: "YYYY-MM-DD"` for specific dates
- `next` and `last` parameters for upcoming/past matches

**Standings**
- Requires both `league` and `season` parameters
- Returns nested standings arrays (for group stages)

**Players**
- Paginated results (default 20 per page)
- Use `page` parameter for pagination

## Common Issues and Solutions

### Issue: Type conversion errors
**Solution**: Use `as unknown as TargetType` pattern
```typescript
const cacheKey = generateCacheKey(
  "feature",
  params as unknown as Record<string, unknown>
);
```

### Issue: React Query initialData type mismatch
**Solution**: Return full response structure from initialData:
```typescript
initialData: () => {
  const cached = getCache(key);
  if (cached) {
    return {
      get: "endpoint",
      parameters: {} as Record<string, string>,
      errors: [] as string[],
      results: cached.length,
      paging: { current: 1, total: 1 },
      response: cached,
    };
  }
  return undefined;
}
```

### Issue: refetchInterval type error
**Solution**: Use `false` instead of `undefined`:
```typescript
refetchInterval: isLive ? 30000 : false
```

## Code Quality Standards

### TypeScript
- Strict mode enabled
- No `any` types (use `unknown`)
- Explicit parameter types
- Use interfaces for object shapes

### React Hooks
- One hook per file
- Follow naming convention: `use<Feature>`
- Integrate both caches (React Query + Zustand)
- Use query key factory

### Testing
- Minimum 80% coverage target
- Test success and error paths
- Mock external dependencies

## Dependencies

### Peer Dependencies
```json
{
  "react": "^19.2.0",
  "@tanstack/react-query": "^5.0.0",
  "@sudobility/di": "^1.4.17",
  "@sudobility/types": "^1.9.12",
  "zustand": "^5.0.0"
}
```

### Dev Dependencies
- TypeScript 5.9+
- Vitest for testing
- ESLint + Prettier
- happy-dom for React testing

## Scripts Reference

```bash
npm run check-all     # Lint + typecheck + test (run before commits)
npm run lint          # ESLint
npm run lint:fix      # ESLint with auto-fix
npm run typecheck     # TypeScript compilation check
npm run test          # Vitest watch mode
npm run test:run      # Vitest single run
npm run build         # Build for distribution
```

## AI Assistant Checklist

When working on this project:

- [ ] Follow one-hook-per-file pattern
- [ ] Use `apiFootballKeys` for query keys
- [ ] Integrate Zustand cache as `initialData`
- [ ] Add types to appropriate `src/types/*.ts` file
- [ ] Export new code from index files
- [ ] Run `npm run check-all` before completing
- [ ] No `any` types - use proper TypeScript
- [ ] Consider React Native compatibility
- [ ] Follow existing patterns for consistency

---

Last Updated: 2025-12-04
