# Improvement Plans for @sudobility/sports_api_client

## Priority 1 - High Impact, Low Effort

### 1.1 Export cache utilities from utils/index.ts
`generateCacheKey`, `isCacheValid`, `createCacheEntry`, `getRemainingTTL`, `createStorageAdapter`, `CachedData`, `StorageAdapter`, and `DEFAULT_CACHE_TTL` are defined in `src/utils/cache-utils.ts` but NOT exported from `src/utils/index.ts`. They are only accessible through `src/football/store/index.ts`. This is confusing -- consumers expect shared utilities to come from the utils barrel. Add `export * from "./cache-utils"` to `src/utils/index.ts`.

### 1.2 Add a combined `verify` or `check-all` script
Other Sudobility projects have a `bun run verify` command. Adding one to `package.json` would align with ecosystem conventions:
```json
"verify": "bun run lint && bun run typecheck && bun run test"
```

### 1.3 Add JSDoc to non-football sport client methods
The football client (`api-football-client.ts`) has comprehensive JSDoc on all methods. The other 9 sport clients follow the same pattern but have minimal or no JSDoc. Propagate the documentation pattern to all sport clients for consistency.

### 1.4 Fix tests directory structure
The `tests/` directory exists at the project root but is empty. All tests are co-located with source files (e.g., `network/api-football-client.test.ts`). Either remove the empty `tests/` directory or document the convention.

## Priority 2 - Medium Impact, Medium Effort

### 2.1 Add integration test examples
Currently only unit tests exist for API clients (mocking network requests) and stores (testing cache behavior). Adding integration test patterns showing how to test hooks with a mock provider (`ApiFootballProvider` + mock client) would help consumers.

### 2.2 Deduplicate sport module boilerplate
Each sport module (basketball, hockey, NFL, etc.) duplicates the same patterns from football: context providers, store factories, hook patterns, and type structures. Consider:
- Creating a generic `createSportModule` factory that generates the provider, hooks, store, and types from a configuration object
- Or creating base classes/generics that sport-specific modules extend

### 2.3 Add rate limiting utilities
The README notes that "The library does not implement rate limiting." Adding optional rate limiting (request queue, backoff, or semaphore) would prevent API quota exhaustion, which is a common consumer pain point with api-sports.io.

### 2.4 Add error type discrimination
API errors are thrown as generic `Error` with message string parsing. Define a typed `ApiSportsError` class with properties for status code, error type, and remaining quota. This enables consumers to handle different error scenarios (rate limit, auth failure, not found).

### 2.5 Add coverage thresholds enforcement
The vitest config defines 70% thresholds for coverage but coverage is not part of the default `bun run test` command. Add a `test:coverage` script and ensure CI enforces it.

## Priority 3 - Lower Impact, Higher Effort

### 3.1 Add volleyball and handball hook context providers
Check that volleyball and handball modules include the full context provider pattern (they have hooks but should be verified for completeness with the provider pattern used in other sports).

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

### 4.4 Document cache key format
The `generateCacheKey` function produces keys like `"leagues:country=England&season=2023"` but this format is not documented for consumers who may need to manually invalidate or inspect cache entries.

### 4.5 Consider splitting into per-sport packages
The monolithic package exports all 10 sports, which means consumers who only need football still import types for all sports. Consider splitting into `@sudobility/sports-football`, `@sudobility/sports-basketball`, etc. with a meta-package for all.
