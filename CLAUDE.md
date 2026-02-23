# CLAUDE.md - Sports API Client

This file provides context for Claude Code when working on this project.

## Project Overview

Multi-sport TypeScript client library for api-sports.io APIs. Cross-platform (React web + React Native) with dependency injection, React Query integration, and Zustand caching.

- **Package**: `@sudobility/sports_api_client`
- **Version**: `1.0.18`
- **License**: BUSL-1.1
- **Stack**: TypeScript, React, React Query (TanStack Query v5), Zustand v5
- **DI**: Uses `NetworkClient` from `@sudobility/types` and `StorageService` from `@sudobility/di`
- **Package manager**: Bun (always use `bun` instead of `npm`/`yarn`)
- **Module format**: ESM only
- **Build tool**: TypeScript compiler (`tsc`) directly (no bundler)
- **Repository**: https://github.com/johnqh/sports_api_client.git
- **Publish access**: restricted (private npm package)

## Quick Commands

```bash
bun run build              # Build for distribution (bunx tsc -p tsconfig.build.json)
bun run build:watch        # Watch mode build (bunx tsc --watch)
bun run clean              # Remove dist/ directory
bun run lint               # ESLint check
bun run lint:fix           # ESLint with auto-fix
bun run typecheck          # TypeScript compilation check (bunx tsc --noEmit)
bun run test               # Run tests once (Vitest)
bun run test:watch         # Run tests in watch mode
bun run format             # Prettier formatting (write)
bun run format:check       # Prettier check (no write)
bun run prepublishOnly     # Clean + build before npm publish
```

**Pre-commit check** (no `check-all` or `verify` script; run manually):
```bash
bun run lint && bun run typecheck && bun run test
```

## Testing

- **Framework**: Vitest with `happy-dom` environment
- **Coverage**: v8 provider with 70% global thresholds (branches, functions, lines, statements)
- **Reports**: text, json, html, lcov to `./coverage/`
- **Path alias**: `@` maps to `./src`
- **Excludes**: `node_modules/`, `dist/`, `*.d.ts`, `*.config.*`, `__tests__/`

```bash
bun run test               # Single run
bun run test:watch         # Watch mode
```

## Project Structure

Each sport module follows the same pattern:

```
src/
├── common/                   # Shared base types (BaseApiResponse, BaseApiConfig)
├── utils/                    # Cache key generation, query param builders, storage adapters
│   ├── cache-utils.ts            # generateCacheKey, createCacheEntry, isCacheValid,
│   │                             # getRemainingTTL, createStorageAdapter, StorageAdapter
│   ├── query-params.ts           # buildQueryString utility
│   └── index.ts
├── football/                 # Football (Soccer)
│   ├── network/              # ApiFootballClient (25 methods)
│   ├── hooks/                # 13 hook files + context + query keys
│   ├── store/                # Zustand store (19 cached data types)
│   ├── types/                # TypeScript definitions
│   └── index.ts
├── basketball/               # Same structure as football
├── hockey/
├── nfl/
├── baseball/
├── rugby/
├── formula1/                 # Different endpoints: circuits, drivers, races
├── mma/                      # No leagues; uses categories, fighters, fights
├── handball/
├── volleyball/
└── index.ts                  # Main entry - exports all sports
```

## Supported Sports (10)

| Sport | Module | Key Endpoints |
|-------|--------|---------------|
| Football | `football/` | Leagues, Teams, Fixtures, Players, Standings, Transfers, Coaches, Injuries |
| Basketball | `basketball/` | Leagues, Teams, Games, Standings, Seasons |
| Hockey | `hockey/` | Leagues, Teams, Games, Standings, Seasons |
| NFL | `nfl/` | Leagues, Teams, Games, Standings, Seasons |
| Baseball | `baseball/` | Leagues, Teams, Games, Standings, Seasons |
| Rugby | `rugby/` | Leagues, Teams, Games, Standings, Seasons |
| Formula 1 | `formula1/` | Circuits, Competitions, Drivers, Races, Teams, Pit Stops |
| MMA | `mma/` | Categories, Countries, Fighters, Fights |
| Handball | `handball/` | Leagues, Teams, Games, Standings, Odds |
| Volleyball | `volleyball/` | Leagues, Teams, Games, Standings, H2H |

## Architecture Patterns

### Per-Sport Module Pattern
Each sport has 4 layers: `network/` (API client) -> `store/` (Zustand cache) -> `hooks/` (React Query) -> `types/`

### DI Pattern (Cross-Platform)
All platform services come from DI - no direct `localStorage` or `fetch`:
```typescript
<ApiFootballProvider client={apiClient} storageService={storageService}>
```

### Hook Pattern
Each hook:
1. Gets client from `useApi{Sport}Client()`
2. Gets store from `useApi{Sport}Store()`
3. Uses React Query with Zustand cache as `initialData`

```typescript
export function useFeature(options) {
  const client = useApiFootballClient();
  const { getCache, setCache, cacheTTL } = useApiFootballStore();

  return useQuery({
    queryKey: apiFootballKeys.feature.list(params),
    queryFn: async () => {
      const response = await client.getFeature(params);
      setCache(cacheKey, response.response);
      return response;
    },
    initialData: () => { /* check Zustand cache */ },
    staleTime: cacheTTL,
  });
}
```

### Query Key Factory
Each sport has its own key factory:
```typescript
apiFootballKeys.leagues.list(params);
apiBasketballKeys.teams.list(params);
```

### Cache Utilities (`src/utils/cache-utils.ts`)

**Functions**:
- `generateCacheKey(prefix, params?)` - Deterministic keys from parameters (sorted alphabetically, nulls filtered)
- `createCacheEntry(key, data)` - Wraps data with timestamp for TTL tracking
- `isCacheValid(timestamp, ttl?)` - Check if cache entry is still fresh (default 5 min TTL)
- `getRemainingTTL(timestamp, ttl?)` - Milliseconds until expiry
- `createStorageAdapter(storageService)` - Converts DI `StorageService` to Zustand-compatible `StorageAdapter`

**Types**:
- `CachedData<T>` - Wrapper with `data`, `timestamp`, `key`
- `StorageAdapter` - Interface for cross-platform persistence (`getItem`, `setItem`, `removeItem`)
- `QueryKeyFactory<TParams>` - Type for query key factory functions

### React Native Support (`createStorageAdapter`)
For React Native, use `createStorageAdapter()` to bridge the DI `StorageService` to Zustand persist middleware:
```typescript
import { createStorageAdapter, createApiFootballStore } from "@sudobility/sports_api_client";

const adapter = createStorageAdapter(storageService);
const useStore = createApiFootballStore(adapter);
```

This enables AsyncStorage or any other React Native storage backend to work with the Zustand cache persistence layer.

## Code Conventions

- **One hook per file**: `use-football-leagues.ts`, `use-basketball-games.ts`
- **No `any` types**: Use `unknown` or proper types
- **Type conversions**: Use `as unknown as TargetType` pattern
- **Imports**: Sort alphabetically, types first
- **Cache keys**: Use `generateCacheKey()` from utils

## Adding a New Sport

1. Create sport directory under `src/{sport}/`
2. Create subdirectories: `network/`, `hooks/`, `store/`, `types/`
3. Implement API client in `network/`
4. Define types in `types/`
5. Create Zustand store in `store/`
6. Create query key factory in `hooks/`
7. Create context/provider in `hooks/`
8. Create hooks (one per file) in `hooks/`
9. Create barrel exports (`index.ts`) at each level
10. Export from main `src/index.ts`
11. Run `bun run lint && bun run typecheck && bun run test`

## Adding New Endpoints (existing sport)

1. Add types to `src/{sport}/types/`
2. Add endpoint URL to `src/{sport}/network/{sport}-endpoints.ts`
3. Add client method to `src/{sport}/network/api-{sport}-client.ts`
4. Add cache methods to `src/{sport}/store/api-{sport}-store.ts`
5. Add query keys to `src/{sport}/hooks/{sport}-types.ts`
6. Create hook in `src/{sport}/hooks/use-{sport}-<feature>.ts`
7. Export from `src/{sport}/hooks/index.ts`
8. Run `bun run lint && bun run typecheck && bun run test`

## Authentication

```typescript
// Direct API (default)
const client = new ApiFootballClient(networkClient, {
  apiKey: "YOUR_API_KEY",
  // Header: x-apisports-key
});

// RapidAPI
const client = new ApiFootballClient(networkClient, {
  apiKey: "YOUR_RAPIDAPI_KEY",
  useRapidApi: true,
  rapidApiHost: "api-football-v1.p.rapidapi.com",
});
```

## Dependencies

**Peer Dependencies** (consumers must provide):
| Package | Version |
|---------|---------|
| `react` | >=18.0.0 |
| `@tanstack/react-query` | >=5.0.0 |
| `@sudobility/di` | ^1.5.38 |
| `@sudobility/types` | ^1.9.53 |
| `zustand` | ^5.0.0 |

**Key Dev Dependencies**:
| Package | Version | Purpose |
|---------|---------|---------|
| `typescript` | ^5.9.3 | Type checking and declaration emit |
| `vitest` | ^4.0.4 | Test runner |
| `happy-dom` | ^20.3.4 | DOM environment for Vitest |
| `eslint` | ^9.38.0 | Linting (flat config) |
| `@typescript-eslint/*` | ^8.46.2 | TypeScript ESLint parser and plugin |
| `prettier` | ^3.6.2 | Code formatting |
| `@sudobility/configs` | ^0.0.65 | Shared configs |

## TypeScript Configuration

- **Target**: ES2020 with DOM libs
- **Module resolution**: `bundler`
- **Strict mode**: Full strict (`strict: true` plus `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, `strictBindCallApply`, `strictPropertyInitialization`, `noImplicitThis`, `useUnknownInCatchVariables`, `alwaysStrict`)
- **Additional checks**: `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, `noImplicitOverride`
- **Output**: `removeComments: true`, `sourceMap: true`, `inlineSources: true`, `declaration: true`, `declarationMap: true`
- **JSX**: `react` (classic transform)
- **Path alias**: `@` maps to `./src`
- Two tsconfig files: `tsconfig.json` (full config) and `tsconfig.build.json` (extends tsconfig.json, excludes test files)

## Linting & Formatting

- **ESLint 9** flat config with `@typescript-eslint`, `eslint-plugin-prettier`, `eslint-config-prettier`
- Key rules: Prettier enforced as error, `no-explicit-any` off, unused vars with `_` prefix ignored, `prefer-const`, `no-var`, `object-shorthand`, `prefer-template`, sorted imports
- Test files have relaxed rules (no-explicit-any off, no-console off)

## Gotchas / Known Issues

- **Cache utilities not re-exported from utils/index.ts**: `generateCacheKey`, `isCacheValid`, `createCacheEntry`, etc. are in `src/utils/cache-utils.ts` but NOT exported from `src/utils/index.ts`. They are re-exported through `src/football/store/index.ts` instead.
- **Utils index only exports query-params**: `src/utils/index.ts` only exports `createQueryParams` and `buildQueryString`. Cache utilities must be imported from sport-specific store barrel exports.
- **Football is the primary/reference sport**: Football has the most endpoints (25 methods) and richest type definitions. Other sports follow the same pattern but with fewer endpoints.
- **MMA has no leagues endpoint**: Unlike other sports, MMA uses categories instead of leagues. The `useMmaLeagues` hook was intentionally removed.
- **tsconfig.build.json uses `removeComments: true`**: All JSDoc comments are stripped from the dist output. Type information is preserved in `.d.ts` files.
- **No `bun run verify` script**: Unlike other Sudobility projects, there is no combined verify/check-all command. Run `bun run lint && bun run typecheck && bun run test` manually before committing.
- **publishConfig is `restricted`**: This is a private npm package, not published publicly.

## CI/CD

Uses `johnqh/workflows/.github/workflows/unified-cicd.yml@main` with automatic NPM publishing on main branch.
