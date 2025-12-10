# @sudobility/sports_api_client

A React and React Native compatible TypeScript client library for [API-Football v3](https://www.api-football.com/documentation-v3).

## Features

- **Cross-platform**: Works with both React (web) and React Native
- **Dependency Injection**: Uses `@sudobility/di` NetworkClient for flexible HTTP implementation
- **Full TypeScript Support**: Comprehensive types for all API responses
- **Local Caching**: Zustand store with persistence and timestamp-based cache invalidation
- **Configurable TTL**: Global cache time-to-live setting
- **Multiple Auth Methods**: Supports both direct API and RapidAPI authentication

## Installation

```bash
npm install @sudobility/sports_api_client
```

### Peer Dependencies

```bash
npm install @sudobility/di @sudobility/types react zustand
```

## Quick Start

### 1. Create a Network Client

The library uses dependency injection for network requests. Implement the `NetworkClient` interface:

```typescript
import type { NetworkClient, NetworkResponse } from "@sudobility/types";

// Example using fetch
const networkClient: NetworkClient = {
  async request<T>(
    url: string,
    options?: RequestInit,
  ): Promise<NetworkResponse<T>> {
    const response = await fetch(url, options);
    const data = await response.json();
    return {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      data,
    };
  },
  async get<T>(url: string, options?: { headers?: Record<string, string> }) {
    return this.request<T>(url, { method: "GET", ...options });
  },
  async post<T>(
    url: string,
    body?: unknown,
    options?: { headers?: Record<string, string> },
  ) {
    return this.request<T>(url, {
      method: "POST",
      body: JSON.stringify(body),
      ...options,
    });
  },
  async put<T>(
    url: string,
    body?: unknown,
    options?: { headers?: Record<string, string> },
  ) {
    return this.request<T>(url, {
      method: "PUT",
      body: JSON.stringify(body),
      ...options,
    });
  },
  async delete<T>(url: string, options?: { headers?: Record<string, string> }) {
    return this.request<T>(url, { method: "DELETE", ...options });
  },
};
```

### 2. Create the API Client

```typescript
import { ApiFootballClient } from "@sudobility/sports_api_client";

const client = new ApiFootballClient(networkClient, {
  apiKey: "YOUR_API_KEY",
});

// Fetch leagues
const leagues = await client.getLeagues({ country: "England" });
console.log(leagues.response);
```

### 3. Use the Zustand Store for Caching

```typescript
import {
  createApiFootballStore,
  generateCacheKey,
} from "@sudobility/sports_api_client";

// Create store (uses localStorage by default on web)
const useStore = createApiFootballStore();

// With React Native AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";

const useStore = createApiFootballStore({
  getItem: AsyncStorage.getItem,
  setItem: AsyncStorage.setItem,
  removeItem: AsyncStorage.removeItem,
});
```

## API Reference

### Client Methods

#### General

| Method                  | Parameters                  | Description                 |
| ----------------------- | --------------------------- | --------------------------- |
| `getTimezone()`         | -                           | Get all available timezones |
| `getCountries(params?)` | `name?`, `code?`, `search?` | Get countries               |
| `getSeasons()`          | -                           | Get all available seasons   |

#### Leagues

| Method                | Parameters                                                                              | Description |
| --------------------- | --------------------------------------------------------------------------------------- | ----------- |
| `getLeagues(params?)` | `id?`, `name?`, `country?`, `season?`, `team?`, `type?`, `current?`, `search?`, `last?` | Get leagues |

#### Teams

| Method                      | Parameters                                                                     | Description         |
| --------------------------- | ------------------------------------------------------------------------------ | ------------------- |
| `getTeams(params)`          | `id?`, `name?`, `league?`, `season?`, `country?`, `code?`, `venue?`, `search?` | Get teams           |
| `getTeamStatistics(params)` | `league`, `season`, `team`, `date?`                                            | Get team statistics |
| `getVenues(params?)`        | `id?`, `name?`, `city?`, `country?`, `search?`                                 | Get venues/stadiums |

#### Standings

| Method                 | Parameters                  | Description          |
| ---------------------- | --------------------------- | -------------------- |
| `getStandings(params)` | `league`, `season`, `team?` | Get league standings |

#### Fixtures

| Method                          | Parameters                                                                                                                           | Description                  |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------- |
| `getFixtures(params?)`          | `id?`, `live?`, `date?`, `league?`, `season?`, `team?`, `last?`, `next?`, `from?`, `to?`, `round?`, `status?`, `venue?`, `timezone?` | Get fixtures                 |
| `getFixturesHeadToHead(params)` | `h2h`, `date?`, `league?`, `season?`, `last?`, `next?`, `from?`, `to?`, `status?`, `venue?`, `timezone?`                             | Get head-to-head             |
| `getFixtureStatistics(params)`  | `fixture`, `team?`, `type?`                                                                                                          | Get fixture statistics       |
| `getFixtureEvents(params)`      | `fixture`, `team?`, `player?`, `type?`                                                                                               | Get fixture events           |
| `getFixtureLineups(params)`     | `fixture`, `team?`, `player?`, `type?`                                                                                               | Get fixture lineups          |
| `getFixturePlayers(params)`     | `fixture`, `team?`                                                                                                                   | Get player stats per fixture |

#### Players

| Method                       | Parameters                                               | Description                  |
| ---------------------------- | -------------------------------------------------------- | ---------------------------- |
| `getPlayers(params)`         | `id?`, `team?`, `league?`, `season?`, `search?`, `page?` | Get players                  |
| `getPlayersSeasons(params?)` | `player?`                                                | Get available player seasons |
| `getSquads(params)`          | `team?`, `player?`                                       | Get team squads              |
| `getTopScorers(params)`      | `league`, `season`                                       | Get top scorers              |
| `getTopAssists(params)`      | `league`, `season`                                       | Get top assists              |
| `getTopCards(params)`        | `league`, `season`                                       | Get most carded players      |

#### Transfers & Others

| Method                 | Parameters                                                                 | Description           |
| ---------------------- | -------------------------------------------------------------------------- | --------------------- |
| `getTransfers(params)` | `player?`, `team?`                                                         | Get player transfers  |
| `getTrophies(params)`  | `player?`, `coach?`                                                        | Get trophies          |
| `getSidelined(params)` | `player?`, `coach?`                                                        | Get sidelined players |
| `getCoachs(params)`    | `id?`, `team?`, `search?`                                                  | Get coach information |
| `getInjuries(params)`  | `league?`, `season?`, `fixture?`, `team?`, `player?`, `date?`, `timezone?` | Get injuries          |

### Store API

```typescript
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
  // ... more cached data types

  // Cache TTL in milliseconds (default: 5 minutes)
  cacheTTL: number;

  // Setters
  setCountries: (data: Country[]) => void;
  setLeagues: (key: string, data: LeagueResponse[]) => void;
  // ... more setters

  // Getters (return null if expired or not found)
  getLeagues: (key: string) => LeagueResponse[] | null;
  getTeams: (key: string) => TeamResponse[] | null;
  // ... more getters

  // Utilities
  isCacheValid: (timestamp: number) => boolean;
  clearCache: () => void;
  setCacheTTL: (ttl: number) => void;
}
```

### Cache Utilities

```typescript
import {
  generateCacheKey,
  isCacheValid,
  DEFAULT_CACHE_TTL,
} from "@sudobility/sports_api_client";

// Generate cache key from parameters
const key = generateCacheKey("leagues", { country: "England", season: 2023 });
// Result: "leagues:country=England&season=2023"

// Check if timestamp is within TTL
const isValid = isCacheValid(timestamp, DEFAULT_CACHE_TTL);
```

## Configuration

### Configuration Options

```typescript
interface ApiFootballConfig {
  /** API key (required) - from API-Football dashboard or RapidAPI */
  apiKey: string;
  /** Base URL (optional) - defaults to https://v3.football.api-sports.io */
  baseUrl?: string;
  /** RapidAPI host (optional) - defaults to api-football-v1.p.rapidapi.com */
  rapidApiHost?: string;
  /** Use RapidAPI authentication (optional) - defaults to false */
  useRapidApi?: boolean;
}
```

### API Key & Authentication

The API key is passed via HTTP headers on every request. The library supports two authentication methods:

**Direct API (default):**

- Header: `x-apisports-key`
- Base URL: `https://v3.football.api-sports.io`

**RapidAPI:**

- Headers: `x-rapidapi-key` and `x-rapidapi-host`
- Base URL: `https://api-football-v1.p.rapidapi.com`

The API key is stored only in memory within the client instance and is never persisted to storage.

### Direct API Authentication

```typescript
const client = new ApiFootballClient(networkClient, {
  apiKey: "YOUR_API_FOOTBALL_KEY",
});
// Uses default endpoint: https://v3.football.api-sports.io
// Sets header: x-apisports-key: YOUR_API_FOOTBALL_KEY
```

### RapidAPI Authentication

```typescript
const client = new ApiFootballClient(networkClient, {
  apiKey: "YOUR_RAPIDAPI_KEY",
  useRapidApi: true,
  rapidApiHost: "api-football-v1.p.rapidapi.com",
});
// Sets headers: x-rapidapi-key and x-rapidapi-host
```

### Custom Base URL

You can override the default endpoint (e.g., for proxying or testing):

```typescript
const client = new ApiFootballClient(networkClient, {
  apiKey: "YOUR_API_KEY",
  baseUrl: "https://custom-proxy.example.com",
});
```

### Custom Cache TTL

```typescript
const useStore = createApiFootballStore();

// Set TTL to 10 minutes
useStore.getState().setCacheTTL(10 * 60 * 1000);
```

## Usage Examples

### Fetch and Cache Leagues

```typescript
import {
  ApiFootballClient,
  createApiFootballStore,
  generateCacheKey,
} from "@sudobility/sports_api_client";

const client = new ApiFootballClient(networkClient, { apiKey: "YOUR_KEY" });
const useStore = createApiFootballStore();

async function getLeagues(country: string) {
  const store = useStore.getState();
  const cacheKey = generateCacheKey("leagues", { country });

  // Check cache first
  const cached = store.getLeagues(cacheKey);
  if (cached) {
    return cached;
  }

  // Fetch from API
  const response = await client.getLeagues({ country });

  // Store in cache
  store.setLeagues(cacheKey, response.response);

  return response.response;
}
```

### Get Live Fixtures

```typescript
async function getLiveFixtures() {
  const response = await client.getFixtures({ live: "all" });
  return response.response;
}
```

### Get Team Statistics

```typescript
async function getTeamStats(teamId: number, leagueId: number, season: number) {
  const response = await client.getTeamStatistics({
    team: teamId,
    league: leagueId,
    season: season,
  });
  return response.response[0];
}
```

### Get Player Top Scorers

```typescript
async function getTopScorers(leagueId: number, season: number) {
  const response = await client.getTopScorers({
    league: leagueId,
    season: season,
  });
  return response.response;
}
```

### React Hook Example

```typescript
import { useState, useEffect } from "react";
import {
  ApiFootballClient,
  useApiFootballStore,
  generateCacheKey,
} from "@sudobility/sports_api_client";
import type { LeagueResponse } from "@sudobility/sports_api_client";

function useLeagues(country: string) {
  const [leagues, setLeagues] = useState<LeagueResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const store = useApiFootballStore();
  const cacheKey = generateCacheKey("leagues", { country });

  useEffect(() => {
    async function fetchLeagues() {
      try {
        // Check cache
        const cached = store.getLeagues(cacheKey);
        if (cached) {
          setLeagues(cached);
          setLoading(false);
          return;
        }

        // Fetch from API
        const response = await client.getLeagues({ country });
        store.setLeagues(cacheKey, response.response);
        setLeagues(response.response);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchLeagues();
  }, [country, cacheKey]);

  return { leagues, loading, error };
}
```

## TypeScript Types

All types are exported from the package:

```typescript
import type {
  // Config
  ApiFootballConfig,
  ApiFootballResponse,

  // Countries
  Country,
  Timezone,

  // Leagues
  League,
  LeagueResponse,
  Season,

  // Teams
  Team,
  TeamResponse,
  Venue,
  TeamStatistics,

  // Fixtures
  Fixture,
  FixtureResponse,
  FixtureEvent,
  FixtureLineup,
  FixtureStatistics,

  // Standings
  Standing,
  StandingsResponse,

  // Players
  Player,
  PlayerResponse,
  SquadResponse,

  // Transfers
  Transfer,
  TransferResponse,
  Trophy,
  Sidelined,
  Coach,
  Injury,
} from "@sudobility/sports_api_client";
```

## API Rate Limits

API-Football has rate limits depending on your subscription plan. The library does not implement rate limiting - you should handle this in your application or NetworkClient implementation.

## License

MIT

## Links

- [API-Football Documentation](https://www.api-football.com/documentation-v3)
- [API-Football Dashboard](https://dashboard.api-football.com/)
