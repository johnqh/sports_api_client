# Multi-Sport API Client Implementation Plan

This document outlines the coding guidelines and phased implementation plan for extending the sports_api_client library to support multiple sports APIs from api-sports.io.

## Overview

**Current State:** Football API implementation complete
**Target:** Support for multiple sports with consistent patterns
**Priority Order:** Basketball → Hockey → NFL (then others as needed)

## Available Sports APIs

| Sport | API Base URL | Status |
|-------|-------------|--------|
| Football | v3.football.api-sports.io | ✅ Implemented |
| Basketball | v1.basketball.api-sports.io | 🔜 Priority 1 |
| Hockey | v1.hockey.api-sports.io | 🔜 Priority 2 |
| NFL | v1.american-football.api-sports.io | 🔜 Priority 3 |
| Baseball | v1.baseball.api-sports.io | Planned |
| Formula-1 | v1.formula-1.api-sports.io | Planned |
| Rugby | v1.rugby.api-sports.io | Planned |
| AFL | v1.afl.api-sports.io | Planned |
| Handball | v1.handball.api-sports.io | Planned |
| MMA | v1.mma.api-sports.io | Planned |
| Volleyball | v1.volleyball.api-sports.io | Planned |
| NBA | v2.nba.api-sports.io | Planned |

---

## Part 1: Coding Guidelines

### 1.1 Directory Structure

Each sport MUST have its own directory under `/src`:

```
src/
├── common/                    # NEW: Shared base classes and utilities
│   ├── base-client.ts         # Abstract base API client
│   ├── base-store.ts          # Abstract base store factory
│   ├── base-context.tsx       # Abstract context/provider pattern
│   ├── base-types.ts          # Shared API response types
│   └── index.ts
│
├── football/                  # Existing implementation
│   ├── network/
│   ├── hooks/
│   ├── store/
│   └── types/
│
├── basketball/                # New sport (same structure)
│   ├── network/
│   │   ├── api-basketball-client.ts
│   │   ├── api-basketball-client.test.ts
│   │   ├── basketball-endpoints.ts
│   │   └── index.ts
│   ├── hooks/
│   │   ├── basketball-context.tsx
│   │   ├── basketball-types.ts
│   │   ├── use-basketball-*.ts
│   │   └── index.ts
│   ├── store/
│   │   ├── api-basketball-store.ts
│   │   ├── api-basketball-store.test.ts
│   │   └── index.ts
│   └── types/
│       ├── basketball-common.ts
│       ├── basketball-*.ts
│       └── index.ts
│
├── hockey/                    # Same pattern
├── nfl/                       # Same pattern (use 'nfl' not 'american-football')
│
├── utils/                     # Shared utilities (existing)
│   ├── cache-utils.ts
│   ├── query-params.ts
│   └── index.ts
│
└── index.ts                   # Main exports
```

### 1.2 Naming Conventions

#### File Names
| Component | Pattern | Example |
|-----------|---------|---------|
| API Client | `api-{sport}-client.ts` | `api-basketball-client.ts` |
| Endpoints | `{sport}-endpoints.ts` | `basketball-endpoints.ts` |
| Context | `{sport}-context.tsx` | `basketball-context.tsx` |
| Types | `{sport}-types.ts` | `basketball-types.ts` |
| Hook files | `use-{sport}-{feature}.ts` | `use-basketball-leagues.ts` |
| Type files | `{sport}-{domain}.ts` | `basketball-teams.ts` |
| Store | `api-{sport}-store.ts` | `api-basketball-store.ts` |

#### Type Names
| Type | Pattern | Example |
|------|---------|---------|
| Entity types | `{Sport}*` | `BasketballTeam`, `HockeyPlayer` |
| Response types | `{Sport}*Response` | `BasketballLeagueResponse` |
| Parameter types | `{Sport}*Params` | `BasketballGamesParams` |
| API types | `Api{Sport}*` | `ApiBasketballConfig`, `ApiBasketballResponse` |

#### Function/Hook Names
| Function | Pattern | Example |
|----------|---------|---------|
| Hooks | `use{Sport}*` | `useBasketballLeagues`, `useHockeyTeams` |
| Factory functions | `create*` | `createApiBasketballClient` |
| Store factory | `createApi{Sport}Store` | `createApiBasketballStore` |

#### Constant Names
| Constant | Pattern | Example |
|----------|---------|---------|
| Base URL | `{SPORT}_API_BASE_URL` | `BASKETBALL_API_BASE_URL` |
| Endpoints | `{SPORT}_ENDPOINTS` | `BASKETBALL_ENDPOINTS` |
| Headers | `{SPORT}_DEFAULT_HEADERS` | `BASKETBALL_DEFAULT_HEADERS` |
| Query keys | `{SPORT}_BASE_KEY` | `BASKETBALL_BASE_KEY` |

#### Class Names
| Class | Pattern | Example |
|-------|---------|---------|
| API Client | `Api{Sport}Client` | `ApiBasketballClient` |
| Store state | `Api{Sport}State` | `ApiBasketballState` |
| Provider props | `Api{Sport}ProviderProps` | `ApiBasketballProviderProps` |

### 1.3 Code Patterns

#### API Client Pattern
```typescript
// Extends base client (when created)
export class ApiBasketballClient extends BaseApiClient {
  protected baseUrl = BASKETBALL_API_BASE_URL;
  protected endpoints = BASKETBALL_ENDPOINTS;

  // Sport-specific methods
  async getLeagues(params?: BasketballLeaguesParams) { ... }
  async getGames(params?: BasketballGamesParams) { ... }
}

export const createApiBasketballClient = (
  networkClient: NetworkClient,
  config: ApiBasketballConfig
) => new ApiBasketballClient(networkClient, config);
```

#### Hook Pattern
```typescript
export function useBasketballLeagues(
  options?: UseApiBasketballQueryOptions<BasketballLeagueResponse[]>
) {
  const client = useApiBasketballClient();
  const { getLeagues, setLeagues, cacheTTL } = useApiBasketballStore();
  const params = options?.params;
  const cacheKey = generateCacheKey("leagues", params);

  return useQuery({
    queryKey: apiBasketballKeys.leagues.list(params),
    queryFn: async () => {
      const response = await client.getLeagues(params);
      setLeagues(cacheKey, response.response);
      return response;
    },
    initialData: () => { /* check cache */ },
    staleTime: cacheTTL,
    ...options,
  });
}
```

#### Type Definitions Pattern
```typescript
// basketball-common.ts
export interface ApiBasketballResponse<T> {
  get: string;
  parameters: Record<string, string>;
  errors: string[] | Record<string, string>;
  results: number;
  response: T[];
}

export interface ApiBasketballConfig {
  baseUrl?: Optional<string>;
  apiKey: string;
  rapidApiHost?: Optional<string>;
  useRapidApi?: Optional<boolean>;
}
```

### 1.4 Export Structure

#### Main index.ts
```typescript
// Common/shared utilities
export * from "./common";
export * from "./utils";

// Football
export * from "./football/network";
export * from "./football/store";
export * from "./football/types";
export * from "./football/hooks";

// Basketball
export * from "./basketball/network";
export * from "./basketball/store";
export * from "./basketball/types";
export * from "./basketball/hooks";

// ... additional sports
```

### 1.5 Testing Requirements

- Each API client MUST have unit tests (`api-{sport}-client.test.ts`)
- Each store MUST have unit tests (`api-{sport}-store.test.ts`)
- Test files follow the same naming pattern as source files
- Mock network responses for deterministic tests

---

## Part 2: Phased Implementation Plan

### Phase 0: Infrastructure (Do First)

**Goal:** Create shared base classes to reduce duplication across sports.

#### Tasks:
1. Create `/src/common/` directory
2. Extract common response type to `base-types.ts`:
   ```typescript
   export interface BaseApiResponse<T> {
     get: string;
     parameters: Record<string, string>;
     errors: string[] | Record<string, string>;
     results: number;
     response: T[];
   }
   ```
3. Create abstract `BaseApiClient` class with shared logic
4. Create base store factory pattern
5. Update football to extend base classes (refactor)
6. Add common exports to `src/index.ts`

#### Files to Create:
- `src/common/base-types.ts`
- `src/common/base-client.ts`
- `src/common/index.ts`

#### Files to Modify:
- `src/football/network/api-football-client.ts` (extend base)
- `src/football/types/football-common.ts` (use base types)
- `src/index.ts` (add common exports)

---

### Phase 1: Basketball API

**Goal:** Implement full Basketball API support following established patterns.

#### Research First:
- Review Basketball API documentation at https://api-sports.io/documentation/basketball/v1
- Document available endpoints and data structures

#### Tasks:
1. **Types** (`src/basketball/types/`)
   - `basketball-common.ts` - Base types, config, response
   - `basketball-leagues.ts` - League types
   - `basketball-teams.ts` - Team types
   - `basketball-games.ts` - Games/fixtures types
   - `basketball-players.ts` - Player types
   - `basketball-standings.ts` - Standings types
   - `basketball-statistics.ts` - Statistics types
   - `index.ts` - Type exports

2. **Network** (`src/basketball/network/`)
   - `basketball-endpoints.ts` - API endpoints constant
   - `api-basketball-client.ts` - API client class
   - `api-basketball-client.test.ts` - Client tests
   - `index.ts` - Network exports

3. **Store** (`src/basketball/store/`)
   - `api-basketball-store.ts` - Zustand store
   - `api-basketball-store.test.ts` - Store tests
   - `index.ts` - Store exports

4. **Hooks** (`src/basketball/hooks/`)
   - `basketball-context.tsx` - Provider and context
   - `basketball-types.ts` - Query keys and hook types
   - `use-basketball-leagues.ts`
   - `use-basketball-teams.ts`
   - `use-basketball-games.ts`
   - `use-basketball-players.ts`
   - `use-basketball-standings.ts`
   - Additional hooks as needed
   - `index.ts` - Hook exports

5. **Integration**
   - Update `src/index.ts` to export basketball
   - Update `package.json` if needed
   - Run `npm run check-all`

---

### Phase 2: Hockey API

**Goal:** Implement full Hockey API support.

#### Research First:
- Review Hockey API documentation at https://api-sports.io/documentation/hockey/v1

#### Tasks:
Same structure as Phase 1, with `hockey` replacing `basketball`:
- `src/hockey/types/` - Hockey type definitions
- `src/hockey/network/` - API client
- `src/hockey/store/` - Zustand store
- `src/hockey/hooks/` - React hooks

---

### Phase 3: NFL API

**Goal:** Implement full NFL/American Football API support.

#### Research First:
- Review NFL API documentation at https://api-sports.io/documentation/american-football/v1
- Note: Use `nfl` as the directory/prefix name (shorter, clearer)

#### Tasks:
Same structure as previous phases:
- `src/nfl/types/` - NFL type definitions
- `src/nfl/network/` - API client (use `ApiNflClient`)
- `src/nfl/store/` - Zustand store
- `src/nfl/hooks/` - React hooks (use `useNfl*` prefix)

---

### Phase 4+: Additional Sports

Implement remaining sports in order of priority/demand:
- Baseball
- Formula-1
- Rugby
- AFL
- Handball
- MMA
- Volleyball
- NBA (separate from Basketball due to different API version)

---

## Part 3: Implementation Checklist

### Per-Sport Checklist

- [ ] Research API documentation
- [ ] Document available endpoints
- [ ] Create types directory with all type files
- [ ] Create network directory with client and endpoints
- [ ] Write client unit tests
- [ ] Create store with cache management
- [ ] Write store unit tests
- [ ] Create hooks directory with context and hooks
- [ ] Update main index.ts exports
- [ ] Run `npm run check-all`
- [ ] Update README with new sport documentation

### Quality Gates

Before considering a sport "complete":
1. All tests pass (`npm run test:run`)
2. No TypeScript errors (`npm run typecheck`)
3. No lint errors (`npm run lint`)
4. Build succeeds (`npm run build`)
5. All endpoints documented with JSDoc

### Completion Workflow (MANDATORY)

After implementing each sport (including Phase 0), follow this workflow:

```bash
# 1. Run all checks
npm run check-all    # lint + typecheck + test

# 2. Build the project
npm run build

# 3. If all pass, commit and push
git add .
git commit -m "feat: add {sport} API support"
git push
```

**Do NOT proceed to the next phase until:**
- ✅ No lint errors
- ✅ No TypeScript errors
- ✅ All tests pass
- ✅ Build succeeds without warnings
- ✅ Changes committed and pushed

---

## Part 4: Notes & Decisions

### Naming Decision: Short vs Full Names
- Use short sport names: `basketball`, `hockey`, `nfl`
- Avoid: `american-football`, `ice-hockey`
- Exception: Use `formula1` (no hyphen) for Formula-1

### API Response Consistency
All api-sports.io APIs use similar response structure:
```json
{
  "get": "endpoint",
  "parameters": {},
  "errors": [],
  "results": 10,
  "response": [...]
}
```
This allows sharing the base response type across sports.

### Cache Key Namespacing
Each sport uses its own namespace:
- Football: `["api-football", ...]`
- Basketball: `["api-basketball", ...]`
- Hockey: `["api-hockey", ...]`

This prevents cache key collisions when using multiple sports.

### RapidAPI Support
All sports support both direct API and RapidAPI access:
- Direct: `v1.{sport}.api-sports.io`
- RapidAPI: `api-{sport}-v1.p.rapidapi.com`

The config pattern remains consistent across sports.
