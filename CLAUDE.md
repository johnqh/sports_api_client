# CLAUDE.md - API-Football Client Library

This file provides context for Claude Code when working on this project.

## Project Overview

TypeScript client library for API-Football v3 API, designed for cross-platform React and React Native applications using dependency injection.

- **Package**: `@sudobility/sports_api_client`
- **Version**: 1.0.0
- **Stack**: TypeScript, React, React Query, Zustand
- **DI**: Uses `NetworkClient` and `StorageService` from `@sudobility/di`

## Quick Commands

```bash
npm run check-all     # Lint + typecheck + test (run before commits)
npm run lint          # ESLint
npm run lint:fix      # ESLint with auto-fix
npm run typecheck     # TypeScript compilation check
npm run test:run      # Run tests once
npm run build         # Build for distribution
```

## Project Structure

```text
src/
├── network/              # API client (uses NetworkClient from DI)
│   ├── api-football-client.ts
│   └── endpoints.ts
├── hooks/                # React hooks with React Query
│   ├── context.tsx       # Provider (requires StorageService from DI)
│   ├── types.ts          # Query key factory
│   └── use-*.ts          # Individual hooks (one per file)
├── store/                # Zustand store
│   ├── api-football-store.ts
│   └── cache-utils.ts    # createStorageAdapter()
├── types/                # TypeScript types
└── utils/                # Utilities
```

## Architecture Patterns

### DI Pattern (Cross-Platform)

All platform services come from DI - no direct `localStorage` or `fetch`:

```typescript
// Provider requires both services from DI
<ApiFootballProvider client={apiClient} storageService={storageService}>
```

### Hook Pattern

Each hook:

1. Gets client from `useApiFootballClient()`
2. Gets store from `useApiFootballStore()`
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
    initialData: () => {
      /* check Zustand cache */
    },
    staleTime: cacheTTL,
  });
}
```

### Query Key Factory

Use `apiFootballKeys` for all query keys:

```typescript
apiFootballKeys.leagues.list(params);
apiFootballKeys.fixtures.list(params);
```

## Code Conventions

- **One hook per file**: `use-leagues.ts`, `use-fixtures.ts`
- **No `any` types**: Use `unknown` or proper types
- **Type conversions**: Use `as unknown as TargetType` pattern
- **Imports**: Sort alphabetically, types first
- **Cache keys**: Use `generateCacheKey()` from cache-utils

## Adding New Endpoints

1. Add types to `src/types/`
2. Add endpoint to `src/network/endpoints.ts`
3. Add client method to `src/network/api-football-client.ts`
4. Add cache methods to `src/store/api-football-store.ts`
5. Add query keys to `src/hooks/types.ts`
6. Create hook in `src/hooks/use-<feature>.ts`
7. Export from `src/hooks/index.ts`
8. Run `npm run check-all`

## Dependencies

**Peer Dependencies** (consumers must provide):

- `react` ^19.2.0
- `@tanstack/react-query` ^5.0.0
- `@sudobility/di` ^1.4.17
- `@sudobility/types` ^1.9.12
- `zustand` ^5.0.0

## Current Implementation

- **27 API endpoints** implemented
- **24 React hooks** with caching
- **27 tests** passing
