# Available Seasons by Sport (Free Tier)

This document lists the seasons and data availability on the **free tier**, verified with API key `56f202374ed1937d98005fa2e6a35100`.

**Last verified:** 2024-12-11

---

## Working Sports (Free Tier)

### API-Football (Soccer)

**Status:** ✅ Works well

**Free tier seasons:** 2021 - 2023 (same as other sports)

Good data coverage across many countries and leagues.

### API-Formula-1

**Status:** ✅ Works well

**Free tier seasons:** 2021 - 2023

F1 doesn't use country filtering - races are returned directly by season.

---

## Limited Data Coverage Sports

The following sports have the free tier season restriction (2021-2023), but also have **limited data coverage**. The `/countries` endpoint returns many countries, but most countries have no leagues in the database.

### API-Basketball

**Free tier seasons:** 2021 - 2023

**Countries with data:** USA (7 leagues), limited international coverage

### API-Hockey

**Free tier seasons:** 2021 - 2023

**Countries with data:** USA, Canada, some European countries

### API-NFL (American Football)

**Free tier seasons:** 2021 - 2023

**Note:** No country filter - leagues endpoint doesn't support `country` parameter

### API-Baseball

**Free tier seasons:** 2021 - 2023

**Countries with data:** USA (5 leagues), Japan (3 leagues), limited others

### API-Rugby

**Free tier seasons:** 2021 - 2023

**Countries with data:** England, limited international coverage

### API-Handball

**Free tier seasons:** 2021 - 2023

**Countries with data:** France, Germany, limited others

### API-Volleyball

**Free tier seasons:** 2021 - 2023

**Countries with data:** Brazil, limited international coverage

### API-MMA

**Free tier seasons:** 2022 - 2023

**Note:** MMA API only has data from 2022 onwards. No country/league structure - fights returned directly.

---

## Notes

1. **Season restriction:** All sports on free tier are limited to 2021-2023 (MMA: 2022-2023)

2. **Data coverage:** The `/countries` endpoint returns all countries in the database, but most have no league data. Only major markets (USA, major European countries) have good coverage.

3. **Recommendation:** Use Football or Formula 1 for best free tier experience. Other sports have very limited data.
