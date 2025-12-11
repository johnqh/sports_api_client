# Available Seasons by Sport (Free Tier)

This document lists the seasons and data availability on the **free tier**, verified with API key `56f202374ed1937d98005fa2e6a35100`.

**Last verified:** 2024-12-11

---

## Free Tier Season Restriction

All sports are limited to seasons **2021 - 2023** on the free tier.

Attempting to access other seasons returns: `"Free plans do not have access to this season, try from 2021 to 2023."`

---

## Data Available for Season 2023

| Sport | Endpoint | Results |
|-------|----------|---------|
| Football | /leagues | 939 |
| Basketball | /leagues | 143 |
| Hockey | /leagues | 151 |
| NFL | /leagues | 2 |
| Baseball | /leagues | 48 |
| Rugby | /leagues | 74 |
| Formula 1 | /races | 180 |
| Handball | /leagues | 164 |
| Volleyball | /leagues | 202 |
| MMA | /fights | 583 |

---

## Notes by Sport

### API-Football (Soccer)
- Best coverage: 939 leagues across many countries
- Recommended for free tier usage

### API-Formula-1
- Good coverage: 180 races
- No country/league structure - races returned directly by season

### API-Basketball
- 143 leagues globally
- Season formats: `2023` or `2023-2024`

### API-Hockey
- 151 leagues globally

### API-NFL (American Football)
- Only 2 leagues (NFL, CFL)
- No country filter supported

### API-Baseball
- 48 leagues globally

### API-Rugby
- 74 leagues globally

### API-Handball
- 164 leagues globally

### API-Volleyball
- 202 leagues globally

### API-MMA
- 583 fights in 2023
- No league structure - fights returned directly
- Data only available from 2022 onwards
