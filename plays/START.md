# API Football Client - Technical Design Document

## Overview

A React/React Native compatible client library for [API-Football v3](https://www.api-football.com/documentation-v3), following the architecture patterns established in `@sudobility/wildduck_client`.

### Key Requirements

1. **Cross-platform compatibility** - Works with both ReactJS and React Native
2. **Dependency Injection** - Uses `@sudobility/di` for network abstraction
3. **Type Safety** - Full TypeScript types for all API responses
4. **Local Caching** - Zustand store with persistence and timestamps
5. **GET-only API** - Client class without hooks (all endpoints are GET requests)

## Architecture

### Package Information

- **Name**: `@sudobility/sports_api_client`
- **Version**: `1.0.0`
- **Type**: ESM module
- **Target**: ES2020

### Dependencies

```json
{
  "peerDependencies": {
    "@sudobility/di": "^1.4.17",
    "@sudobility/types": "^1.9.12",
    "react": "^19.2.0",
    "zustand": "^5.0.0"
  }
}
```

### Project Structure

```text
/src
├── index.ts                    # Main exports
├── network/
│   ├── index.ts               # Network module exports
│   ├── api-football-client.ts # Main API client class
│   └── endpoints.ts           # Endpoint path definitions
├── store/
│   ├── index.ts               # Store exports
│   ├── api-football-store.ts  # Zustand store with persistence
│   └── cache-utils.ts         # Cache timestamp utilities
├── types/
│   ├── index.ts               # Type exports
│   ├── common.ts              # Common response types
│   ├── countries.ts           # Countries/Timezone types
│   ├── leagues.ts             # Leagues/Seasons types
│   ├── teams.ts               # Teams/Venues types
│   ├── fixtures.ts            # Fixtures/Events types
│   ├── standings.ts           # Standings types
│   ├── players.ts             # Players types
│   ├── statistics.ts          # Statistics types
│   └── transfers.ts           # Transfers/Trophies/Sidelined types
└── utils/
    ├── index.ts               # Utility exports
    └── query-params.ts        # URL query parameter builder
```

## API Endpoints Coverage

### Phase 1: Core Endpoints

| Endpoint            | Path                   | Description                       |
| ------------------- | ---------------------- | --------------------------------- |
| Timezone            | `/timezone`            | Available timezones               |
| Countries           | `/countries`           | Available countries               |
| Seasons             | `/leagues/seasons`     | Available seasons                 |
| Leagues             | `/leagues`             | Leagues and cups                  |
| Teams               | `/teams`               | Team information                  |
| Teams Statistics    | `/teams/statistics`    | Team statistics by league/season  |
| Venues              | `/venues`              | Stadium information               |
| Standings           | `/standings`           | League standings                  |
| Fixtures            | `/fixtures`            | Match fixtures                    |
| Fixtures Head2Head  | `/fixtures/headtohead` | Head to head comparison           |
| Fixtures Statistics | `/fixtures/statistics` | Match statistics                  |
| Fixtures Events     | `/fixtures/events`     | Match events (goals, cards, etc.) |
| Fixtures Lineups    | `/fixtures/lineups`    | Team lineups                      |
| Fixtures Players    | `/fixtures/players`    | Player statistics per fixture     |

### Phase 2: Players & Transfers

| Endpoint            | Path                  | Description               |
| ------------------- | --------------------- | ------------------------- |
| Players             | `/players`            | Player information        |
| Players Seasons     | `/players/seasons`    | Available player seasons  |
| Players Squads      | `/players/squads`     | Team squads               |
| Players Top Scorers | `/players/topscorers` | Top scorers by league     |
| Players Top Assists | `/players/topassists` | Top assists by league     |
| Players Top Cards   | `/players/topcards`   | Top cards by league       |
| Transfers           | `/transfers`          | Player transfers          |
| Trophies            | `/trophies`           | Player/Coach trophies     |
| Sidelined           | `/sidelined`          | Injured/suspended players |
| Coachs              | `/coachs`             | Coach information         |

## Type Definitions

### Base Response Type

```typescript
interface ApiFootballResponse<T> {
  get: string;
  parameters: Record<string, string>;
  errors: string[] | Record<string, string>;
  results: number;
  paging: {
    current: number;
    total: number;
  };
  response: T[];
}
```

### Configuration Type

```typescript
interface ApiFootballConfig {
  baseUrl?: string; // Default: https://v3.football.api-sports.io
  apiKey: string; // Required: API key from dashboard
  rapidApiHost?: string; // Optional: for RapidAPI usage
}
```

### Key Data Types

```typescript
// Country
interface Country {
  name: string;
  code: string | null;
  flag: string | null;
}

// League
interface League {
  id: number;
  name: string;
  type: "League" | "Cup";
  logo: string;
}

// Team
interface Team {
  id: number;
  name: string;
  code: string | null;
  country: string;
  founded: number | null;
  national: boolean;
  logo: string;
}

// Fixture
interface Fixture {
  id: number;
  referee: string | null;
  timezone: string;
  date: string;
  timestamp: number;
  periods: { first: number | null; second: number | null };
  venue: { id: number | null; name: string; city: string };
  status: { long: string; short: string; elapsed: number | null };
}

// Player
interface Player {
  id: number;
  name: string;
  firstname: string;
  lastname: string;
  age: number;
  birth: { date: string; place: string; country: string };
  nationality: string;
  height: string;
  weight: string;
  injured: boolean;
  photo: string;
}
```

## Client Class Design

### ApiFootballClient

```typescript
class ApiFootballClient {
  private baseUrl: string;
  private networkClient: NetworkClient;
  private config: ApiFootballConfig;

  constructor(networkClient: NetworkClient, config: ApiFootballConfig);

  // Core endpoints
  getTimezone(): Promise<ApiFootballResponse<string>>;
  getCountries(params?: CountriesParams): Promise<ApiFootballResponse<Country>>;
  getSeasons(): Promise<ApiFootballResponse<number>>;
  getLeagues(
    params?: LeaguesParams,
  ): Promise<ApiFootballResponse<LeagueResponse>>;

  // Teams
  getTeams(params: TeamsParams): Promise<ApiFootballResponse<TeamResponse>>;
  getTeamStatistics(
    params: TeamStatisticsParams,
  ): Promise<ApiFootballResponse<TeamStatistics>>;
  getVenues(params?: VenuesParams): Promise<ApiFootballResponse<Venue>>;

  // Standings
  getStandings(
    params: StandingsParams,
  ): Promise<ApiFootballResponse<StandingsResponse>>;

  // Fixtures
  getFixtures(
    params?: FixturesParams,
  ): Promise<ApiFootballResponse<FixtureResponse>>;
  getFixturesHeadToHead(
    params: HeadToHeadParams,
  ): Promise<ApiFootballResponse<FixtureResponse>>;
  getFixtureStatistics(
    params: FixtureStatisticsParams,
  ): Promise<ApiFootballResponse<FixtureStatistics>>;
  getFixtureEvents(
    params: FixtureEventsParams,
  ): Promise<ApiFootballResponse<FixtureEvent>>;
  getFixtureLineups(
    params: FixtureLineupsParams,
  ): Promise<ApiFootballResponse<FixtureLineup>>;
  getFixturePlayers(
    params: FixturePlayersParams,
  ): Promise<ApiFootballResponse<FixturePlayerStats>>;

  // Players
  getPlayers(
    params: PlayersParams,
  ): Promise<ApiFootballResponse<PlayerResponse>>;
  getPlayersSeasons(
    params?: PlayersSeasonParams,
  ): Promise<ApiFootballResponse<number>>;
  getSquads(params: SquadsParams): Promise<ApiFootballResponse<SquadResponse>>;
  getTopScorers(
    params: TopScorersParams,
  ): Promise<ApiFootballResponse<PlayerResponse>>;
  getTopAssists(
    params: TopAssistsParams,
  ): Promise<ApiFootballResponse<PlayerResponse>>;
  getTopCards(
    params: TopCardsParams,
  ): Promise<ApiFootballResponse<PlayerResponse>>;

  // Transfers & Others
  getTransfers(
    params: TransfersParams,
  ): Promise<ApiFootballResponse<TransferResponse>>;
  getTrophies(params: TrophiesParams): Promise<ApiFootballResponse<Trophy>>;
  getSidelined(
    params: SidelinedParams,
  ): Promise<ApiFootballResponse<Sidelined>>;
  getCoachs(params: CoachsParams): Promise<ApiFootballResponse<Coach>>;
}
```

## Zustand Store Design

### Store Structure

```typescript
interface CachedData<T> {
  data: T;
  timestamp: number;
  key: string;
}

interface ApiFootballState {
  // Cached data
  countries: CachedData<Country[]> | null;
  timezones: CachedData<string[]> | null;
  seasons: CachedData<number[]> | null;
  leagues: Map<string, CachedData<LeagueResponse[]>>;
  teams: Map<string, CachedData<TeamResponse[]>>;
  fixtures: Map<string, CachedData<FixtureResponse[]>>;
  standings: Map<string, CachedData<StandingsResponse[]>>;
  players: Map<string, CachedData<PlayerResponse[]>>;

  // Cache settings
  cacheTTL: number; // Global TTL in milliseconds (default: 5 minutes)

  // Actions
  setCountries: (data: Country[]) => void;
  setTimezones: (data: string[]) => void;
  setSeasons: (data: number[]) => void;
  setLeagues: (key: string, data: LeagueResponse[]) => void;
  setTeams: (key: string, data: TeamResponse[]) => void;
  setFixtures: (key: string, data: FixtureResponse[]) => void;
  setStandings: (key: string, data: StandingsResponse[]) => void;
  setPlayers: (key: string, data: PlayerResponse[]) => void;

  // Cache utilities
  isCacheValid: (timestamp: number) => boolean;
  clearCache: () => void;
  setCacheTTL: (ttl: number) => void;
}
```

### Persistence Configuration

```typescript
import { persist, createJSONStorage } from "zustand/middleware";

// For React Native, user provides AsyncStorage
// For Web, uses localStorage by default
interface StorageAdapter {
  getItem: (name: string) => Promise<string | null> | string | null;
  setItem: (name: string, value: string) => Promise<void> | void;
  removeItem: (name: string) => Promise<void> | void;
}

const createApiFootballStore = (storage?: StorageAdapter) =>
  create<ApiFootballState>()(
    persist(
      (set, get) => ({
        // ... state and actions
      }),
      {
        name: "api-football-cache",
        storage: createJSONStorage(() => storage || localStorage),
        partialize: (state) => ({
          // Only persist data, not functions
          countries: state.countries,
          timezones: state.timezones,
          // ... etc
        }),
      },
    ),
  );
```

## Phased Implementation Plan

### Phase 1: Project Setup & Core Infrastructure

**Files to create:**

- `package.json` - Package configuration
- `tsconfig.json` - TypeScript configuration
- `tsconfig.build.json` - Build configuration
- `eslint.config.js` - ESLint configuration
- `.prettierrc` - Prettier configuration
- `vitest.config.ts` - Test configuration
- `.vscode/settings.json` - VS Code settings

**Tasks:**

1. Initialize package.json with dependencies
2. Copy and adapt tsconfig from wildduck_client
3. Set up ESLint and Prettier
4. Create directory structure
5. Set up Vitest for testing

### Phase 2: Type Definitions

**Files to create:**

- `src/types/common.ts` - Base response types
- `src/types/countries.ts` - Country/Timezone types
- `src/types/leagues.ts` - League/Season types
- `src/types/teams.ts` - Team/Venue types
- `src/types/fixtures.ts` - Fixture types
- `src/types/standings.ts` - Standings types
- `src/types/players.ts` - Player types
- `src/types/statistics.ts` - Statistics types
- `src/types/transfers.ts` - Transfer/Trophy/Sidelined types
- `src/types/index.ts` - Type exports

**Tasks:**

1. Define base response wrapper type
2. Create types for each endpoint category
3. Export all types from index

### Phase 3: API Client Implementation

**Files to create:**

- `src/network/endpoints.ts` - Endpoint constants
- `src/network/api-football-client.ts` - Main client class
- `src/network/index.ts` - Network exports
- `src/utils/query-params.ts` - Query parameter builder
- `src/utils/index.ts` - Utility exports

**Tasks:**

1. Define endpoint path constants
2. Create query parameter utility
3. Implement ApiFootballClient class
4. Add all GET methods for endpoints
5. Handle authentication headers

### Phase 4: Zustand Store

**Files to create:**

- `src/store/cache-utils.ts` - Cache timestamp utilities
- `src/store/api-football-store.ts` - Zustand store
- `src/store/index.ts` - Store exports

**Tasks:**

1. Create cache utility functions
2. Implement Zustand store with persist middleware
3. Add cache invalidation logic
4. Support custom storage adapters

### Phase 5: Integration & Testing

**Files to create:**

- `src/index.ts` - Main exports
- `tests/client.test.ts` - Client unit tests
- `tests/store.test.ts` - Store unit tests
- `tests/types.test.ts` - Type tests

**Tasks:**

1. Create main index.ts with all exports
2. Write unit tests for client methods
3. Write unit tests for store operations
4. Test cache invalidation logic

### Phase 6: Documentation & Polish

**Files to create:**

- `README.md` - Usage documentation
- `CHANGELOG.md` - Version history

**Tasks:**

1. Write comprehensive README
2. Add JSDoc comments to all exports
3. Create usage examples
4. Final code review and cleanup

## API Authentication

API-Football requires authentication via headers:

```typescript
// Direct API usage
headers: {
  'x-apisports-key': 'YOUR_API_KEY'
}

// RapidAPI usage
headers: {
  'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
  'x-rapidapi-key': 'YOUR_RAPIDAPI_KEY'
}
```

The client will support both authentication methods based on configuration.

## Usage Example

```typescript
import {
  ApiFootballClient,
  createApiFootballStore,
} from "@sudobility/sports_api_client";
import type { NetworkClient } from "@sudobility/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create store with React Native persistence
const useStore = createApiFootballStore({
  getItem: AsyncStorage.getItem,
  setItem: AsyncStorage.setItem,
  removeItem: AsyncStorage.removeItem,
});

// Create client with DI network
const client = new ApiFootballClient(networkClient, {
  apiKey: "YOUR_API_KEY",
});

// Fetch leagues and cache
async function fetchLeagues() {
  const store = useStore.getState();
  const cacheKey = "leagues:all";

  // Check cache first
  const cached = store.leagues.get(cacheKey);
  if (cached && store.isCacheValid(cached.timestamp)) {
    return cached.data;
  }

  // Fetch from API
  const response = await client.getLeagues();

  // Store in cache
  store.setLeagues(cacheKey, response.response);

  return response.response;
}
```

## Configuration Files Reference

All configuration files will be adapted from `~/0xmail/wildduck_client` to ensure consistency across projects:

- **tsconfig.json**: ES2020 target, ESNext modules, strict mode
- **eslint.config.js**: Flat config with TypeScript and Prettier
- **.prettierrc**: Double quotes, trailing commas, 80 char width
- **vitest.config.ts**: happy-dom environment, 70% coverage threshold
