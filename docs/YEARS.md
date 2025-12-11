# Available Seasons by Sport (Free Tier)

This document lists the seasons accessible on the **free tier** for each sport API, verified by calling data endpoints with API key `56f202374ed1937d98005fa2e6a35100`.

**Last verified:** 2024-12-11

---

## API-Football (Soccer)

**Free tier access:** All seasons (2008 - 2027)

Football API appears to have no season restrictions on the free tier.

---

## All Other Sports (Free Tier Restriction)

The following sports have the same free tier restriction:

> "Free plans do not have access to this season, try from 2021 to 2023."

**Free tier access:** 2021, 2022, 2023 only

### API-Basketball
- Free tier: **2021 - 2023**
- Season formats: `2021`, `2021-2022`, `2022`, `2022-2023`, `2023`, `2023-2024`

### API-Hockey
- Free tier: **2021 - 2023**

### API-NFL (American Football)
- Free tier: **2021 - 2023**

### API-Baseball
- Free tier: **2021 - 2023**

### API-Rugby
- Free tier: **2021 - 2023**

### API-Formula-1
- Free tier: **2021 - 2023**

### API-Handball
- Free tier: **2021 - 2023**

### API-Volleyball
- Free tier: **2021 - 2023**

### API-MMA
- Free tier: **2022 - 2023** (MMA API only has data from 2022 onwards)

---

## Notes

- The `/seasons` endpoint returns all seasons that exist in the database, but free tier accounts can only access data from 2021-2023 for most sports.
- Attempting to access seasons outside the free tier range returns an error: `"Free plans do not have access to this season, try from 2021 to 2023."`
- Football (API-Football) is an exception and allows access to all seasons on the free tier.
