# CLAUDE.md - Sports API Client

This file provides context for Claude Code when working on this project.

## Project Overview

Multi-sport TypeScript client library for api-sports.io APIs. Cross-platform (React web + React Native) with dependency injection, React Query integration, and Zustand caching.

- **Package**: `@sudobility/sports_api_client`
- **Stack**: TypeScript, React, React Query, Zustand
- **DI**: Uses `NetworkClient` and `StorageService` from `@sudobility/di`
- **Package manager**: Bun

## Quick Commands

```bash
bun run check-all     # Lint + typecheck + test (run before commits)
bun run lint          # ESLint
bun run lint:fix      # ESLint with auto-fix
bun run typecheck     # TypeScript compilation check
bun run test          # Run tests once (Vitest)
bun run test:watch    # Run tests in watch mode
bun run build         # Build for distribution
```

## Project Structure

Each sport module follows the same pattern:

```
src/
├── common/                   # Shared base types (BaseApiResponse, BaseApiConfig)
├── utils/                    # Cache key generation, query param builders
├── football/                 # Football (Soccer)
│   ├── network/              # ApiFootballClient (27 methods)
│   ├── hooks/                # 24 React hooks + context + query keys
│   ├── store/                # Zustand store (18 cached data types)
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
Each sport has 4 layers: `network/` (API client) → `store/` (Zustand cache) → `hooks/` (React Query) → `types/`

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

### Cache Key Generation
Deterministic keys from parameters:
```typescript
generateCacheKey("leagues", { country: "England" });
// → "leagues:country=England"
```

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
11. Run `bun run check-all`

## Adding New Endpoints (existing sport)

1. Add types to `src/{sport}/types/`
2. Add endpoint URL to `src/{sport}/network/{sport}-endpoints.ts`
3. Add client method to `src/{sport}/network/api-{sport}-client.ts`
4. Add cache methods to `src/{sport}/store/api-{sport}-store.ts`
5. Add query keys to `src/{sport}/hooks/{sport}-types.ts`
6. Create hook in `src/{sport}/hooks/use-{sport}-<feature>.ts`
7. Export from `src/{sport}/hooks/index.ts`
8. Run `bun run check-all`

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
- `react` >=18.0.0
- `@tanstack/react-query` >=5.0.0
- `@sudobility/di` ^1.5.36
- `@sudobility/types` ^1.9.51
- `zustand` ^5.0.0

## CI/CD

Uses `johnqh/workflows/.github/workflows/unified-cicd.yml@main` with automatic NPM publishing on main branch.
