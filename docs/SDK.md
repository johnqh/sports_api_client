# API-Football Client SDK Documentation

Complete documentation for `@sudobility/sports_api_client` - a TypeScript client library for the API-Football v3 API.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Setup](#setup)
  - [React Setup](#react-setup)
  - [React Native Setup](#react-native-setup)
- [API Client](#api-client)
  - [Configuration](#configuration)
  - [Client Methods](#client-methods)
- [React Hooks](#react-hooks)
  - [Provider Setup](#provider-setup)
  - [Available Hooks](#available-hooks)
  - [Hook Options](#hook-options)
  - [Query Keys](#query-keys)
- [Caching](#caching)
  - [Dual Cache Architecture](#dual-cache-architecture)
  - [Cache Configuration](#cache-configuration)
  - [Manual Cache Access](#manual-cache-access)
- [Types Reference](#types-reference)
- [Examples](#examples)
- [Error Handling](#error-handling)
- [Migration Guide](#migration-guide)

---

## Overview

`@sudobility/sports_api_client` provides a type-safe client for the [API-Football v3](https://www.api-football.com/) API with:

- **Full TypeScript Support**: Comprehensive types for all endpoints
- **React Integration**: Hooks powered by React Query
- **Persistent Caching**: Zustand store with automatic persistence
- **Cross-Platform**: Works with React (web) and React Native
- **Dependency Injection**: Uses `NetworkClient` and `StorageService` from `@sudobility/di`

### Features

| Feature          | Description                                            |
| ---------------- | ------------------------------------------------------ |
| 27 API Endpoints | Leagues, fixtures, standings, players, teams, and more |
| 24 React Hooks   | Data fetching with automatic caching                   |
| Dual Caching     | React Query + Zustand for optimal performance          |
| TypeScript       | Full type safety with comprehensive types              |
| Cross-Platform   | React and React Native support via DI                  |

---

## Installation

```bash
npm install @sudobility/sports_api_client
```

### Peer Dependencies

Install the required peer dependencies:

```bash
npm install react @tanstack/react-query zustand @sudobility/di @sudobility/types
```

| Package                 | Version | Purpose                         |
| ----------------------- | ------- | ------------------------------- |
| `react`                 | ^19.2.0 | React framework                 |
| `@tanstack/react-query` | ^5.0.0  | Data fetching and caching       |
| `zustand`               | ^5.0.0  | State management                |
| `@sudobility/di`        | ^1.4.17 | Dependency injection interfaces |
| `@sudobility/types`     | ^1.9.12 | Shared type definitions         |

---

## Quick Start

```typescript
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  ApiFootballProvider,
  ApiFootballClient,
  useLeagues,
  useFixtures,
} from "@sudobility/sports_api_client";
import type { NetworkClient, StorageService } from "@sudobility/di";

// 1. Create query client
const queryClient = new QueryClient();

// 2. Get services from your DI container
const networkClient: NetworkClient = /* your network client */;
const storageService: StorageService = /* your storage service */;

// 3. Create API client
const apiClient = new ApiFootballClient(networkClient, {
  apiKey: "YOUR_API_KEY",
});

// 4. Wrap your app
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ApiFootballProvider client={apiClient} storageService={storageService}>
        <YourApp />
      </ApiFootballProvider>
    </QueryClientProvider>
  );
}

// 5. Use hooks in components
function LeagueList() {
  const { data, isLoading, error } = useLeagues({
    params: { country: "England" },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data?.response.map((league) => (
        <li key={league.league.id}>{league.league.name}</li>
      ))}
    </ul>
  );
}
```

---

## Setup

### React Setup

```typescript
// src/providers/ApiFootballSetup.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApiFootballProvider, ApiFootballClient } from "@sudobility/sports_api_client";
import type { NetworkClient, StorageService } from "@sudobility/di";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
    },
  },
});

// Web implementation of StorageService
const webStorageService: StorageService = {
  getItem: (key) => localStorage.getItem(key),
  setItem: (key, value) => localStorage.setItem(key, value),
  removeItem: (key) => localStorage.removeItem(key),
  clear: () => localStorage.clear(),
  getAllKeys: () => Object.keys(localStorage),
  isAvailable: () => typeof localStorage !== "undefined",
  getType: () => "localStorage" as any,
};

// Web implementation of NetworkClient
const webNetworkClient: NetworkClient = {
  get: async (url, config) => {
    const response = await fetch(url, {
      headers: config?.headers,
    });
    return { data: await response.json() };
  },
  post: async (url, data, config) => {
    const response = await fetch(url, {
      method: "POST",
      headers: config?.headers,
      body: JSON.stringify(data),
    });
    return { data: await response.json() };
  },
  // ... other methods
};

const apiClient = new ApiFootballClient(webNetworkClient, {
  apiKey: process.env.REACT_APP_API_FOOTBALL_KEY!,
});

export function ApiFootballSetup({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ApiFootballProvider client={apiClient} storageService={webStorageService}>
        {children}
      </ApiFootballProvider>
    </QueryClientProvider>
  );
}
```

### React Native Setup

```typescript
// src/providers/ApiFootballSetup.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApiFootballProvider, ApiFootballClient } from "@sudobility/sports_api_client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { NetworkClient, StorageService } from "@sudobility/di";

const queryClient = new QueryClient();

// React Native implementation of StorageService
const rnStorageService: StorageService = {
  getItem: (key) => AsyncStorage.getItem(key),
  setItem: (key, value) => AsyncStorage.setItem(key, value),
  removeItem: (key) => AsyncStorage.removeItem(key),
  clear: () => AsyncStorage.clear(),
  getAllKeys: () => AsyncStorage.getAllKeys(),
  isAvailable: () => true,
  getType: () => "asyncStorage" as any,
};

// React Native implementation of NetworkClient (using fetch or axios)
const rnNetworkClient: NetworkClient = {
  get: async (url, config) => {
    const response = await fetch(url, { headers: config?.headers });
    return { data: await response.json() };
  },
  post: async (url, data, config) => {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...config?.headers },
      body: JSON.stringify(data),
    });
    return { data: await response.json() };
  },
  // ... other methods
};

const apiClient = new ApiFootballClient(rnNetworkClient, {
  apiKey: "YOUR_API_KEY",
});

export function ApiFootballSetup({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ApiFootballProvider client={apiClient} storageService={rnStorageService}>
        {children}
      </ApiFootballProvider>
    </QueryClientProvider>
  );
}
```

---

## API Client

### Configuration

```typescript
import { ApiFootballClient } from "@sudobility/sports_api_client";

interface ApiFootballConfig {
  /** Your API-Football API key */
  apiKey: string;
  /** Custom base URL (optional) */
  baseUrl?: string;
  /** Use RapidAPI authentication (optional) */
  useRapidApi?: boolean;
  /** RapidAPI host (required if useRapidApi is true) */
  rapidApiHost?: string;
}

// Direct API-Sports authentication
const client = new ApiFootballClient(networkClient, {
  apiKey: "YOUR_API_SPORTS_KEY",
});

// RapidAPI authentication
const rapidClient = new ApiFootballClient(networkClient, {
  apiKey: "YOUR_RAPIDAPI_KEY",
  useRapidApi: true,
  rapidApiHost: "api-football-v1.p.rapidapi.com",
});
```

### Client Methods

#### General Endpoints

| Method                  | Description             | Parameters                  |
| ----------------------- | ----------------------- | --------------------------- |
| `getTimezone()`         | Get available timezones | None                        |
| `getCountries(params?)` | Get countries           | `name?`, `code?`, `search?` |
| `getSeasons()`          | Get available seasons   | None                        |

```typescript
// Get all timezones
const timezones = await client.getTimezone();

// Get countries
const countries = await client.getCountries();
const england = await client.getCountries({ name: "England" });

// Get seasons
const seasons = await client.getSeasons();
```

#### Leagues Endpoints

| Method                | Description      | Parameters                                                                     |
| --------------------- | ---------------- | ------------------------------------------------------------------------------ |
| `getLeagues(params?)` | Get leagues/cups | `id?`, `name?`, `country?`, `season?`, `team?`, `type?`, `current?`, `search?` |

```typescript
// Get all leagues
const leagues = await client.getLeagues();

// Get Premier League
const premierLeague = await client.getLeagues({ id: 39 });

// Get English leagues for 2023 season
const englishLeagues = await client.getLeagues({
  country: "England",
  season: 2023,
});
```

#### Teams Endpoints

| Method                      | Description         | Parameters                                                  |
| --------------------------- | ------------------- | ----------------------------------------------------------- |
| `getTeams(params)`          | Get teams           | `id?`, `name?`, `league?`, `season?`, `country?`, `search?` |
| `getTeamStatistics(params)` | Get team statistics | `league`, `season`, `team`                                  |
| `getVenues(params?)`        | Get venues/stadiums | `id?`, `name?`, `city?`, `country?`, `search?`              |

```typescript
// Get Manchester United
const manUtd = await client.getTeams({ id: 33 });

// Get teams in Premier League 2023
const plTeams = await client.getTeams({ league: 39, season: 2023 });

// Get team statistics
const stats = await client.getTeamStatistics({
  league: 39,
  season: 2023,
  team: 33,
});
```

#### Standings Endpoints

| Method                 | Description          | Parameters                  |
| ---------------------- | -------------------- | --------------------------- |
| `getStandings(params)` | Get league standings | `league`, `season`, `team?` |

```typescript
// Get Premier League 2023 standings
const standings = await client.getStandings({
  league: 39,
  season: 2023,
});

const table = standings.response[0]?.league.standings[0];
```

#### Fixtures Endpoints

| Method                          | Description         | Parameters                                                                                                                 |
| ------------------------------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `getFixtures(params?)`          | Get fixtures        | `id?`, `live?`, `date?`, `league?`, `season?`, `team?`, `last?`, `next?`, `from?`, `to?`, `round?`, `status?`, `timezone?` |
| `getFixturesHeadToHead(params)` | Get H2H fixtures    | `h2h` (team IDs separated by `-`)                                                                                          |
| `getFixtureStatistics(params)`  | Get fixture stats   | `fixture`, `team?`, `type?`                                                                                                |
| `getFixtureEvents(params)`      | Get fixture events  | `fixture`, `team?`, `player?`, `type?`                                                                                     |
| `getFixtureLineups(params)`     | Get fixture lineups | `fixture`, `team?`, `player?`, `type?`                                                                                     |
| `getFixturePlayers(params)`     | Get player stats    | `fixture`, `team?`                                                                                                         |

```typescript
// Get live fixtures
const liveFixtures = await client.getFixtures({ live: "all" });

// Get fixtures for a date
const todayFixtures = await client.getFixtures({ date: "2024-01-15" });

// Get next 5 fixtures for a team
const nextFixtures = await client.getFixtures({ team: 33, next: 5 });

// Get head-to-head (Man Utd vs Liverpool)
const h2h = await client.getFixturesHeadToHead({ h2h: "33-40" });

// Get fixture statistics
const fixtureStats = await client.getFixtureStatistics({ fixture: 123456 });

// Get fixture events (goals, cards, etc.)
const events = await client.getFixtureEvents({ fixture: 123456 });

// Get lineups
const lineups = await client.getFixtureLineups({ fixture: 123456 });
```

#### Players Endpoints

| Method                       | Description        | Parameters                                               |
| ---------------------------- | ------------------ | -------------------------------------------------------- |
| `getPlayers(params)`         | Get players        | `id?`, `team?`, `league?`, `season?`, `search?`, `page?` |
| `getPlayersSeasons(params?)` | Get player seasons | `player?`                                                |
| `getSquads(params)`          | Get team squads    | `team?`, `player?`                                       |
| `getTopScorers(params)`      | Get top scorers    | `league`, `season`                                       |
| `getTopAssists(params)`      | Get top assists    | `league`, `season`                                       |
| `getTopCards(params)`        | Get most carded    | `league`, `season`                                       |

```typescript
// Get player by ID
const player = await client.getPlayers({ id: 276, season: 2023 });

// Search players
const searchResults = await client.getPlayers({
  search: "Haaland",
  league: 39,
  season: 2023,
});

// Get team squad
const squad = await client.getSquads({ team: 33 });

// Get top scorers
const topScorers = await client.getTopScorers({ league: 39, season: 2023 });
```

#### Other Endpoints

| Method                 | Description           | Parameters                                                                 |
| ---------------------- | --------------------- | -------------------------------------------------------------------------- |
| `getTransfers(params)` | Get transfers         | `player?`, `team?`                                                         |
| `getTrophies(params)`  | Get trophies          | `player?`, `coach?`                                                        |
| `getSidelined(params)` | Get sidelined players | `player?`, `coach?`                                                        |
| `getCoachs(params)`    | Get coaches           | `id?`, `team?`, `search?`                                                  |
| `getInjuries(params)`  | Get injuries          | `league?`, `season?`, `fixture?`, `team?`, `player?`, `date?`, `timezone?` |

```typescript
// Get player transfers
const transfers = await client.getTransfers({ player: 276 });

// Get player trophies
const trophies = await client.getTrophies({ player: 276 });

// Get team coach
const coach = await client.getCoachs({ team: 33 });

// Get current injuries
const injuries = await client.getInjuries({
  league: 39,
  season: 2023,
});
```

---

## React Hooks

### Provider Setup

All hooks require `ApiFootballProvider`:

```typescript
import { ApiFootballProvider } from "@sudobility/sports_api_client";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ApiFootballProvider client={apiClient} storageService={storageService}>
        <YourApp />
      </ApiFootballProvider>
    </QueryClientProvider>
  );
}
```

### Available Hooks

#### General Hooks

| Hook                     | Description               |
| ------------------------ | ------------------------- |
| `useTimezone(options?)`  | Fetch available timezones |
| `useCountries(options?)` | Fetch countries           |
| `useSeasons(options?)`   | Fetch available seasons   |

```typescript
import { useTimezone, useCountries, useSeasons } from "@sudobility/sports_api_client";

function TimezoneSelector() {
  const { data, isLoading } = useTimezone();

  return (
    <select>
      {data?.response.map((tz) => (
        <option key={tz} value={tz}>{tz}</option>
      ))}
    </select>
  );
}

function CountryList() {
  const { data } = useCountries();
  // or with filter
  const { data: england } = useCountries({ params: { name: "England" } });
}

function SeasonSelector() {
  const { data } = useSeasons();
  const currentSeason = data?.response ? Math.max(...data.response) : 2024;
}
```

#### League Hooks

| Hook                   | Description   |
| ---------------------- | ------------- |
| `useLeagues(options?)` | Fetch leagues |

```typescript
import { useLeagues } from "@sudobility/sports_api_client";

function LeagueList() {
  // All leagues
  const { data: allLeagues } = useLeagues();

  // Filtered leagues
  const { data: englishLeagues } = useLeagues({
    params: { country: "England", season: 2023 },
  });

  // Specific league
  const { data: premierLeague } = useLeagues({
    params: { id: 39 },
  });
}
```

#### Team Hooks

| Hook                         | Description           |
| ---------------------------- | --------------------- |
| `useTeams(options)`          | Fetch teams           |
| `useTeamStatistics(options)` | Fetch team statistics |
| `useVenues(options?)`        | Fetch venues          |

```typescript
import { useTeams, useTeamStatistics, useVenues } from "@sudobility/sports_api_client";

function TeamInfo({ teamId }: { teamId: number }) {
  const { data: team } = useTeams({ params: { id: teamId } });

  const { data: stats } = useTeamStatistics({
    params: { team: teamId, league: 39, season: 2023 },
  });

  return (
    <div>
      <h1>{team?.response[0]?.team.name}</h1>
      <p>Wins: {stats?.response.fixtures?.wins?.total}</p>
    </div>
  );
}
```

#### Standings Hooks

| Hook                    | Description            |
| ----------------------- | ---------------------- |
| `useStandings(options)` | Fetch league standings |

```typescript
import { useStandings } from "@sudobility/sports_api_client";

function LeagueTable({ leagueId, season }: Props) {
  const { data, isLoading } = useStandings({
    params: { league: leagueId, season },
  });

  const standings = data?.response[0]?.league.standings[0];

  return (
    <table>
      <thead>
        <tr>
          <th>Pos</th>
          <th>Team</th>
          <th>P</th>
          <th>W</th>
          <th>D</th>
          <th>L</th>
          <th>Pts</th>
        </tr>
      </thead>
      <tbody>
        {standings?.map((team) => (
          <tr key={team.team.id}>
            <td>{team.rank}</td>
            <td>{team.team.name}</td>
            <td>{team.all.played}</td>
            <td>{team.all.win}</td>
            <td>{team.all.draw}</td>
            <td>{team.all.lose}</td>
            <td>{team.points}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

#### Fixture Hooks

| Hook                             | Description          |
| -------------------------------- | -------------------- |
| `useFixtures(options?)`          | Fetch fixtures       |
| `useFixturesHeadToHead(options)` | Fetch H2H fixtures   |
| `useFixtureStatistics(options)`  | Fetch fixture stats  |
| `useFixtureEvents(options)`      | Fetch fixture events |
| `useFixtureLineups(options)`     | Fetch lineups        |
| `useFixturePlayers(options)`     | Fetch player stats   |

```typescript
import {
  useFixtures,
  useFixturesHeadToHead,
  useFixtureStatistics,
  useFixtureEvents,
  useFixtureLineups,
} from "@sudobility/sports_api_client";

// Live fixtures with auto-refresh
function LiveFixtures() {
  const { data } = useFixtures({
    params: { live: "all" },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

// Team's next fixtures
function UpcomingMatches({ teamId }: { teamId: number }) {
  const { data } = useFixtures({
    params: { team: teamId, next: 5 },
  });
}

// Head to head
function HeadToHead({ team1, team2 }: { team1: number; team2: number }) {
  const { data } = useFixturesHeadToHead({
    params: { h2h: `${team1}-${team2}` },
  });
}

// Match details
function MatchDetails({ fixtureId }: { fixtureId: number }) {
  const { data: stats } = useFixtureStatistics({
    params: { fixture: fixtureId },
  });
  const { data: events } = useFixtureEvents({ params: { fixture: fixtureId } });
  const { data: lineups } = useFixtureLineups({
    params: { fixture: fixtureId },
  });
}
```

#### Player Hooks

| Hook                          | Description          |
| ----------------------------- | -------------------- |
| `usePlayers(options)`         | Fetch players        |
| `usePlayersSeasons(options?)` | Fetch player seasons |
| `useSquads(options)`          | Fetch team squads    |
| `useTopScorers(options)`      | Fetch top scorers    |
| `useTopAssists(options)`      | Fetch top assists    |
| `useTopCards(options)`        | Fetch most carded    |

```typescript
import {
  usePlayers,
  useSquads,
  useTopScorers,
  useTopAssists,
} from "@sudobility/sports_api_client";

function PlayerSearch({ query, leagueId, season }: Props) {
  const { data } = usePlayers({
    params: { search: query, league: leagueId, season },
    enabled: query.length >= 3, // Only search with 3+ characters
  });
}

function TeamSquad({ teamId }: { teamId: number }) {
  const { data } = useSquads({ params: { team: teamId } });
  const players = data?.response[0]?.players;
}

function TopScorersTable({ leagueId, season }: Props) {
  const { data } = useTopScorers({ params: { league: leagueId, season } });
}
```

#### Other Hooks

| Hook                    | Description     |
| ----------------------- | --------------- |
| `useTransfers(options)` | Fetch transfers |
| `useTrophies(options)`  | Fetch trophies  |
| `useSidelined(options)` | Fetch sidelined |
| `useCoaches(options)`   | Fetch coaches   |
| `useInjuries(options)`  | Fetch injuries  |

```typescript
import {
  useTransfers,
  useTrophies,
  useCoaches,
  useInjuries,
} from "@sudobility/sports_api_client";

function PlayerTransferHistory({ playerId }: { playerId: number }) {
  const { data } = useTransfers({ params: { player: playerId } });
  const transfers = data?.response[0]?.transfers;
}

function TeamCoach({ teamId }: { teamId: number }) {
  const { data } = useCoaches({ params: { team: teamId } });
  const coach = data?.response[0];
}

function TeamInjuries({ teamId, season }: Props) {
  const { data } = useInjuries({
    params: { team: teamId, season },
  });
}
```

### Hook Options

All hooks accept options extending React Query's `UseQueryOptions`:

```typescript
interface UseApiFootballQueryOptions<TData, TParams> {
  /** API parameters */
  params?: TParams;
  /** Enable/disable the query */
  enabled?: boolean;
  /** Refetch interval in ms */
  refetchInterval?: number | false;
  /** Time until data is considered stale (ms) */
  staleTime?: number;
  /** Cache time (ms) */
  gcTime?: number;
  /** Refetch on window focus */
  refetchOnWindowFocus?: boolean;
  /** Retry count on failure */
  retry?: number | boolean;
  // ... other React Query options
}

// Example usage
const { data } = useFixtures({
  params: { live: "all" },
  enabled: isLiveMode,
  refetchInterval: isLiveMode ? 30000 : false,
  staleTime: 10000,
  retry: 2,
});
```

### Query Keys

Use `apiFootballKeys` for cache invalidation:

```typescript
import { apiFootballKeys } from "@sudobility/sports_api_client";
import { useQueryClient } from "@tanstack/react-query";

function RefreshButton() {
  const queryClient = useQueryClient();

  const refreshLeagues = () => {
    queryClient.invalidateQueries({
      queryKey: apiFootballKeys.leagues.all,
    });
  };

  const refreshSpecificLeague = () => {
    queryClient.invalidateQueries({
      queryKey: apiFootballKeys.leagues.list({ country: "England" }),
    });
  };

  const refreshAllApiFootball = () => {
    queryClient.invalidateQueries({
      queryKey: apiFootballKeys.all,
    });
  };
}
```

Available query keys:

```typescript
apiFootballKeys.all; // All API-Football queries
apiFootballKeys.timezone(); // Timezones
apiFootballKeys.countries.all; // All countries
apiFootballKeys.countries.list(params); // Countries with params
apiFootballKeys.seasons(); // Seasons
apiFootballKeys.leagues.all; // All leagues
apiFootballKeys.leagues.list(params); // Leagues with params
apiFootballKeys.teams.all; // All teams
apiFootballKeys.teams.list(params); // Teams with params
apiFootballKeys.teams.statistics(params); // Team statistics
apiFootballKeys.venues.all; // All venues
apiFootballKeys.venues.list(params); // Venues with params
apiFootballKeys.standings.all; // All standings
apiFootballKeys.standings.list(params); // Standings with params
apiFootballKeys.fixtures.all; // All fixtures
apiFootballKeys.fixtures.list(params); // Fixtures with params
apiFootballKeys.fixtures.headToHead(params); // H2H fixtures
apiFootballKeys.fixtures.statistics(params); // Fixture statistics
apiFootballKeys.fixtures.events(params); // Fixture events
apiFootballKeys.fixtures.lineups(params); // Fixture lineups
apiFootballKeys.fixtures.players(params); // Fixture players
apiFootballKeys.players.all; // All players
apiFootballKeys.players.list(params); // Players with params
apiFootballKeys.players.seasons(params); // Player seasons
apiFootballKeys.players.squads(params); // Squads
apiFootballKeys.players.topScorers(params); // Top scorers
apiFootballKeys.players.topAssists(params); // Top assists
apiFootballKeys.players.topCards(params); // Top cards
apiFootballKeys.transfers.all; // All transfers
apiFootballKeys.transfers.list(params); // Transfers with params
apiFootballKeys.trophies.all; // All trophies
apiFootballKeys.trophies.list(params); // Trophies with params
apiFootballKeys.sidelined.all; // All sidelined
apiFootballKeys.sidelined.list(params); // Sidelined with params
apiFootballKeys.coaches.all; // All coaches
apiFootballKeys.coaches.list(params); // Coaches with params
apiFootballKeys.injuries.all; // All injuries
apiFootballKeys.injuries.list(params); // Injuries with params
```

---

## Caching

### Dual Cache Architecture

The library uses a dual-cache system:

1. **React Query Cache**: In-memory cache with automatic refetching
2. **Zustand Store**: Persistent cache that survives page reloads

```text
User Request
     ↓
React Query Hook
     ↓
Check React Query Cache → HIT → Return cached data
     ↓ MISS
Check Zustand Cache (initialData) → HIT → Return as initial data, fetch in background
     ↓ MISS
Fetch from API
     ↓
Update both caches
     ↓
Return data
```

### Cache Configuration

Configure cache TTL in the store:

```typescript
import { useApiFootballStore } from "@sudobility/sports_api_client";

function CacheSettings() {
  const { cacheTTL, setCacheTTL } = useApiFootballStore();

  // Set cache TTL to 10 minutes
  const updateTTL = () => {
    setCacheTTL(10 * 60 * 1000);
  };

  return (
    <button onClick={updateTTL}>
      Current TTL: {cacheTTL / 1000}s
    </button>
  );
}
```

### Manual Cache Access

Access the Zustand store directly:

```typescript
import { useApiFootballStore } from "@sudobility/sports_api_client";

function CacheManager() {
  const {
    // Cache utilities
    clearCache,
    cacheTTL,
    setCacheTTL,
    isCacheValid,

    // Direct cache access
    getLeagues,
    setLeagues,
    getFixtures,
    setFixtures,
    // ... other getters/setters
  } = useApiFootballStore();

  // Clear all cached data
  const handleClearCache = () => {
    clearCache();
  };

  // Check specific cache
  const checkLeagueCache = () => {
    const cached = getLeagues("leagues:country=England");
    if (cached) {
      console.log("Found cached leagues:", cached);
    }
  };
}
```

---

## Types Reference

### Response Types

All API responses follow this structure:

```typescript
interface ApiFootballResponse<T> {
  get: string; // Endpoint name
  parameters: Record<string, string>; // Request parameters
  errors: string[]; // Error messages
  results: number; // Number of results
  paging: {
    current: number;
    total: number;
  };
  response: T[]; // Data array
}
```

### Common Types

```typescript
// League
interface LeagueResponse {
  league: {
    id: number;
    name: string;
    type: "League" | "Cup";
    logo: string;
  };
  country: {
    name: string;
    code: string | null;
    flag: string | null;
  };
  seasons: Season[];
}

// Team
interface TeamResponse {
  team: {
    id: number;
    name: string;
    code: string | null;
    country: string;
    founded: number | null;
    national: boolean;
    logo: string;
  };
  venue: Venue;
}

// Fixture
interface FixtureResponse {
  fixture: {
    id: number;
    referee: string | null;
    timezone: string;
    date: string;
    timestamp: number;
    status: FixtureStatus;
    venue: { id: number; name: string; city: string };
  };
  league: LeagueInfo;
  teams: { home: TeamInfo; away: TeamInfo };
  goals: { home: number | null; away: number | null };
  score: Score;
  events?: FixtureEvent[];
  lineups?: FixtureLineup[];
  statistics?: FixtureStatistics[];
  players?: FixturePlayerStats[];
}

// Player
interface PlayerResponse {
  player: {
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
  };
  statistics: PlayerStatistics[];
}

// Standing
interface StandingsResponse {
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string;
    season: number;
    standings: Standing[][];
  };
}
```

Import types directly:

```typescript
import type {
  LeagueResponse,
  TeamResponse,
  FixtureResponse,
  PlayerResponse,
  StandingsResponse,
  // ... many more
} from "@sudobility/sports_api_client";
```

---

## Examples

### Complete App Example

```typescript
// App.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  ApiFootballProvider,
  ApiFootballClient,
  useLeagues,
  useFixtures,
  useStandings,
} from "@sudobility/sports_api_client";

const queryClient = new QueryClient();

// Setup (see Setup section for full implementation)
const apiClient = new ApiFootballClient(networkClient, { apiKey: "KEY" });

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ApiFootballProvider client={apiClient} storageService={storageService}>
        <Dashboard />
      </ApiFootballProvider>
    </QueryClientProvider>
  );
}

function Dashboard() {
  const [selectedLeague, setSelectedLeague] = useState<number>(39);
  const [season] = useState(2023);

  return (
    <div>
      <LeagueSelector onSelect={setSelectedLeague} selected={selectedLeague} />
      <StandingsTable leagueId={selectedLeague} season={season} />
      <RecentFixtures leagueId={selectedLeague} season={season} />
    </div>
  );
}

function LeagueSelector({ onSelect, selected }: Props) {
  const { data, isLoading } = useLeagues({
    params: { country: "England", type: "League" },
  });

  if (isLoading) return <div>Loading leagues...</div>;

  return (
    <select value={selected} onChange={(e) => onSelect(Number(e.target.value))}>
      {data?.response.map((league) => (
        <option key={league.league.id} value={league.league.id}>
          {league.league.name}
        </option>
      ))}
    </select>
  );
}

function StandingsTable({ leagueId, season }: Props) {
  const { data, isLoading } = useStandings({
    params: { league: leagueId, season },
  });

  if (isLoading) return <div>Loading standings...</div>;

  const standings = data?.response[0]?.league.standings[0];

  return (
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Team</th>
          <th>P</th>
          <th>GD</th>
          <th>Pts</th>
        </tr>
      </thead>
      <tbody>
        {standings?.map((team) => (
          <tr key={team.team.id}>
            <td>{team.rank}</td>
            <td>
              <img src={team.team.logo} alt="" width={20} />
              {team.team.name}
            </td>
            <td>{team.all.played}</td>
            <td>{team.goalsDiff}</td>
            <td><strong>{team.points}</strong></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function RecentFixtures({ leagueId, season }: Props) {
  const { data, isLoading } = useFixtures({
    params: { league: leagueId, season, last: 10 },
  });

  if (isLoading) return <div>Loading fixtures...</div>;

  return (
    <div>
      {data?.response.map((fixture) => (
        <div key={fixture.fixture.id}>
          <span>{fixture.teams.home.name}</span>
          <span>
            {fixture.goals.home} - {fixture.goals.away}
          </span>
          <span>{fixture.teams.away.name}</span>
        </div>
      ))}
    </div>
  );
}
```

### Live Match Tracker

```typescript
function LiveMatchTracker({ fixtureId }: { fixtureId: number }) {
  const { data: fixture } = useFixtures({
    params: { id: fixtureId },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: events } = useFixtureEvents({
    params: { fixture: fixtureId },
    refetchInterval: 30000,
  });

  const match = fixture?.response[0];

  if (!match) return null;

  return (
    <div>
      <h2>
        {match.teams.home.name} {match.goals.home} - {match.goals.away} {match.teams.away.name}
      </h2>
      <p>Status: {match.fixture.status.long}</p>
      <p>Minute: {match.fixture.status.elapsed}'</p>

      <h3>Events</h3>
      <ul>
        {events?.response.map((event, i) => (
          <li key={i}>
            {event.time.elapsed}' - {event.type}: {event.player.name}
            {event.assist.name && ` (${event.assist.name})`}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Error Handling

### API Errors

The client throws errors for API failures:

```typescript
try {
  const data = await client.getLeagues({ id: 999999 });
} catch (error) {
  if (error.message.includes("API-Football error")) {
    // API returned an error
    console.error("API Error:", error.message);
  } else {
    // Network or other error
    console.error("Request failed:", error);
  }
}
```

### Hook Error Handling

```typescript
function LeagueList() {
  const { data, isLoading, error, isError } = useLeagues();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <ErrorMessage
        message={error.message}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return <LeagueDisplay leagues={data?.response} />;
}
```

### Error Boundaries

```typescript
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

function App() {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <div>
              <p>Something went wrong: {error.message}</p>
              <button onClick={resetErrorBoundary}>Try again</button>
            </div>
          )}
        >
          <YourApp />
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
```

---

## Migration Guide

### Breaking Changes in v1.0.0

#### ApiFootballProvider requires storageService

**Before:**

```typescript
<ApiFootballProvider client={apiClient}>
```

**After:**

```typescript
<ApiFootballProvider client={apiClient} storageService={storageService}>
```

#### No default useApiFootballStore export

**Before:**

```typescript
import { useApiFootballStore } from "@sudobility/sports_api_client";
// Used globally without provider
```

**After:**

```typescript
// Must be used within ApiFootballProvider
import { useApiFootballStore } from "@sudobility/sports_api_client";

function MyComponent() {
  // Works inside provider
  const store = useApiFootballStore();
}
```

#### createStorageAdapter instead of createLocalStorageAdapter

**Before:**

```typescript
import { createLocalStorageAdapter } from "@sudobility/sports_api_client";
const store = createApiFootballStore(createLocalStorageAdapter());
```

**After:**

```typescript
import {
  createStorageAdapter,
  createApiFootballStore,
} from "@sudobility/sports_api_client";
const store = createApiFootballStore(createStorageAdapter(storageService));
```

---

## API Reference Quick Links

- [API-Football Documentation](https://www.api-football.com/documentation-v3)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)

---

## Support

- **Issues**: [GitHub Issues](https://github.com/johnqh/sports_api_client/issues)
- **API-Football Support**: [API-Football Contact](https://www.api-football.com/contact)
