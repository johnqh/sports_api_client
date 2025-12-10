/**
 * @module query-params
 * @description Utility functions for building URL query parameters
 *
 * Provides helpers for constructing URL-safe query strings from parameter objects.
 * Handles optional values, arrays, and proper URL encoding.
 */

import type { Optional } from "@sudobility/types";

/**
 * Creates a URL search params builder that handles arrays and optional values
 *
 * @returns A builder object with append, set, addParams, toString, and isEmpty methods
 *
 * @example
 * ```typescript
 * const params = createQueryParams();
 * params.append("league", 39);
 * params.append("season", 2023);
 * params.toString(); // "league=39&season=2023"
 * ```
 */
export const createQueryParams = () => {
  const params: Record<string, string[]> = {};

  return {
    /**
     * Append a parameter value
     */
    append: (key: string, value: Optional<string | number | boolean>) => {
      if (value === undefined || value === null) {
        return;
      }
      if (!params[key]) {
        params[key] = [];
      }
      params[key].push(String(value));
    },

    /**
     * Set a parameter (replaces existing values)
     */
    set: (key: string, value: Optional<string | number | boolean>) => {
      if (value === undefined || value === null) {
        delete params[key];
        return;
      }
      params[key] = [String(value)];
    },

    /**
     * Add multiple parameters from an object
     */
    addParams: (obj: Record<string, Optional<string | number | boolean>>) => {
      Object.entries(obj).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (!params[key]) {
            params[key] = [];
          }
          params[key].push(String(value));
        }
      });
    },

    /**
     * Convert to query string
     */
    toString: () => {
      return Object.entries(params)
        .flatMap(([key, values]) =>
          values.map(
            (value) =>
              `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
          ),
        )
        .join("&");
    },

    /**
     * Check if any parameters exist
     */
    isEmpty: () => Object.keys(params).length === 0,
  };
};

/**
 * Build a URL query string from a parameters object
 *
 * Converts an object of parameters into a URL-safe query string.
 * Handles undefined/null values by excluding them from the output.
 *
 * @param params - Object containing parameter key-value pairs
 * @returns Query string with leading "?" or empty string if no params
 *
 * @example
 * ```typescript
 * buildQueryString({ league: 39, season: 2023 });
 * // "?league=39&season=2023"
 *
 * buildQueryString({});
 * // ""
 *
 * buildQueryString({ country: "England", type: undefined });
 * // "?country=England"
 * ```
 */
export const buildQueryString = (params: object): string => {
  const builder = createQueryParams();
  builder.addParams(
    params as unknown as Record<string, Optional<string | number | boolean>>,
  );
  const query = builder.toString();
  return query ? `?${query}` : "";
};
