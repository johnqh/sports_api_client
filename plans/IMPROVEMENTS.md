# Improvement Plans for @sudobility/sports_api_client

## Priority 1 - High Impact, Low Effort

### 1.1 Export cache utilities from utils/index.ts -- COMPLETED
`generateCacheKey`, `isCacheValid`, `createCacheEntry`, `getRemainingTTL`, `createStorageAdapter`, `CachedData`, `StorageAdapter`, `QueryKeyFactory`, and `DEFAULT_CACHE_TTL` are now exported from `src/utils/index.ts` alongside the query-params exports. They remain also re-exported through `src/football/store/index.ts` for backward compatibility.

### 1.2 Add a combined `verify` or `check-all` script -- COMPLETED
Added `verify` and `test:coverage` scripts to `package.json`:
```json
"verify": "bun run lint && bun run typecheck && bun run test",
"test:coverage": "vitest run --coverage"
```
CLAUDE.md updated to reflect the new command.

### 1.3 Add JSDoc to non-football sport client methods -- COMPLETED
All 9 non-football sport clients now have comprehensive JSDoc on every public method, matching the football client pattern. Includes `@param`, `@returns`, `@throws`, and `@example` tags for all methods across basketball, hockey, NFL, baseball, rugby, Formula 1, MMA, handball, and volleyball clients.

### 1.4 Fix tests directory structure -- COMPLETED
Removed the empty `tests/` directory at the project root. All tests are co-located with source files following the `*.test.ts` pattern (e.g., `network/api-football-client.test.ts`).

## Priority 2 - Medium Impact, Medium Effort

### 2.1 Add integration test examples
Currently only unit tests exist for API clients (mocking network requests) and stores (testing cache behavior). Adding integration test patterns showing how to test hooks with a mock provider (`ApiFootballProvider` + mock client) would help consumers.

### 2.2 Deduplicate sport module boilerplate
Each sport module (basketball, hockey, NFL, etc.) duplicates the same patterns from football: context providers, store factories, hook patterns, and type structures. Consider:
- Creating a generic `createSportModule` factory that generates the provider, hooks, store, and types from a configuration object
- Or creating base classes/generics that sport-specific modules extend

### 2.3 Add rate limiting utilities
The README notes that "The library does not implement rate limiting." Adding optional rate limiting (request queue, backoff, or semaphore) would prevent API quota exhaustion, which is a common consumer pain point with api-sports.io.

### 2.4 Add error type discrimination -- COMPLETED
Added `ApiSportsError` class, `ApiSportsErrorType` enum, and `classifyApiError` utility in `src/common/api-sports-error.ts`. All 10 sport clients now throw `ApiSportsError` instead of generic `Error`, with typed error discrimination for `NO_DATA`, `API_ERROR`, `AUTH_FAILURE`, `RATE_LIMIT`, `NETWORK_ERROR`, and `UNKNOWN` error types. Exported from the main barrel (`src/common/index.ts`).

### 2.5 Add coverage thresholds enforcement -- COMPLETED
Added `test:coverage` script to `package.json`:
```json
"test:coverage": "vitest run --coverage"
```
The vitest config already defines 70% thresholds. CI can now run `bun run test:coverage` to enforce them.

## Priority 3 - Lower Impact, Higher Effort

### 3.1 Add volleyball and handball hook context providers -- ALREADY COMPLETE
Verified that both volleyball (`volleyball-context.tsx`) and handball (`handball-context.tsx`) already include the full context provider pattern matching other sports. No changes needed.

### 3.2 Add request caching at the client level
Currently caching only happens at the Zustand store level (after a successful hook call). Adding an optional response cache at the `ApiFootballClient` level would benefit consumers who use the client directly without hooks.

### 3.3 Add pagination helpers
The football API supports paginated responses (e.g., players endpoint). Currently consumers must manually handle pagination. Adding `useInfiniteQuery`-based hooks or pagination utilities would simplify this.

### 3.4 Add WebSocket/SSE support for live fixtures
The `getFixtures({ live: "all" })` endpoint requires polling. Adding optional WebSocket or Server-Sent Events support for live score updates would reduce API calls and improve real-time experience.

### 3.5 Generate sport modules from schema
Since all sport modules follow the same 4-layer pattern (types -> network -> store -> hooks), consider code generation from API schema definitions. This would eliminate the boilerplate duplication and ensure consistency.

## Priority 4 - Nice to Have

### 4.1 Add request/response logging middleware
Allow consumers to inject logging middleware (via the DI pattern) to debug API requests and responses during development.

### 4.2 Add type guards for API responses
Add type guard functions (e.g., `isFootballFixtureResponse()`) that consumers can use to validate response shapes at runtime, especially useful when dealing with the generic `BaseApiResponse<T>` type.

### 4.3 Add store migration support
The Zustand persist middleware supports version-based migrations. Add a version field and migration function to handle store schema changes across library updates.

### 4.4 Document cache key format -- COMPLETED
The `generateCacheKey` function in `src/utils/cache-utils.ts` already has comprehensive JSDoc documenting the key format with examples:
- `generateCacheKey("leagues")` produces `"leagues"`
- `generateCacheKey("leagues", { country: "England" })` produces `"leagues:country=England"`
- `generateCacheKey("fixtures", { team: 33, season: 2023 })` produces `"fixtures:season=2023&team=33"`
- Parameters are sorted alphabetically; undefined/null values are filtered out.

### 4.5 Consider splitting into per-sport packages
The monolithic package exports all 10 sports, which means consumers who only need football still import types for all sports. Consider splitting into `@sudobility/sports-football`, `@sudobility/sports-basketball`, etc. with a meta-package for all.
