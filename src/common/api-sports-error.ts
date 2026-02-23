/**
 * @module common/api-sports-error
 * @description Typed error class for all api-sports.io API errors
 *
 * Provides a typed error class that replaces generic `Error` throws in API clients.
 * Enables consumers to discriminate between different error types (rate limit,
 * authentication failure, not found, etc.) using the `errorType` property.
 *
 * @example
 * ```typescript
 * import { ApiSportsError, ApiSportsErrorType } from "@sudobility/sports_api_client";
 *
 * try {
 *   const leagues = await client.getLeagues();
 * } catch (error) {
 *   if (error instanceof ApiSportsError) {
 *     if (error.errorType === ApiSportsErrorType.RATE_LIMIT) {
 *       console.log("Rate limited, retry after backoff");
 *     } else if (error.errorType === ApiSportsErrorType.AUTH_FAILURE) {
 *       console.log("Invalid API key");
 *     }
 *     console.log(`Status: ${error.statusCode}, Sport: ${error.sport}`);
 *   }
 * }
 * ```
 */

/**
 * Enum representing the type of API error encountered
 */
export enum ApiSportsErrorType {
  /** No data received from the API */
  NO_DATA = "NO_DATA",
  /** API returned an error response */
  API_ERROR = "API_ERROR",
  /** Authentication failed (invalid or missing API key) */
  AUTH_FAILURE = "AUTH_FAILURE",
  /** Rate limit exceeded */
  RATE_LIMIT = "RATE_LIMIT",
  /** Network or connection error */
  NETWORK_ERROR = "NETWORK_ERROR",
  /** Unknown or unclassified error */
  UNKNOWN = "UNKNOWN",
}

/**
 * Typed error class for api-sports.io API errors
 *
 * Extends the native Error class with structured properties for
 * error type discrimination, status codes, and sport identification.
 *
 * @example
 * ```typescript
 * try {
 *   await client.getLeagues();
 * } catch (error) {
 *   if (error instanceof ApiSportsError) {
 *     switch (error.errorType) {
 *       case ApiSportsErrorType.RATE_LIMIT:
 *         // Handle rate limiting
 *         break;
 *       case ApiSportsErrorType.AUTH_FAILURE:
 *         // Handle auth failure
 *         break;
 *       default:
 *         console.error(error.message);
 *     }
 *   }
 * }
 * ```
 */
export class ApiSportsError extends Error {
  /** The type of API error for programmatic discrimination */
  readonly errorType: ApiSportsErrorType;
  /** HTTP status code if available */
  readonly statusCode?: number;
  /** The sport API that produced the error (e.g., "Football", "Basketball") */
  readonly sport: string;
  /** Raw error details from the API response */
  readonly errors?: string[] | Record<string, string>;
  /** The original error that caused this error, if any */
  readonly cause?: unknown;

  /**
   * Create a new ApiSportsError
   *
   * @param message - Human-readable error message
   * @param sport - The sport API name (e.g., "Football", "Basketball")
   * @param errorType - The classified error type
   * @param options - Additional error options
   * @param options.statusCode - HTTP status code if available
   * @param options.errors - Raw error details from the API response
   * @param options.cause - The original error that caused this error
   */
  constructor(
    message: string,
    sport: string,
    errorType: ApiSportsErrorType = ApiSportsErrorType.UNKNOWN,
    options?: {
      statusCode?: number;
      errors?: string[] | Record<string, string>;
      cause?: unknown;
    },
  ) {
    super(message);
    this.name = "ApiSportsError";
    this.sport = sport;
    this.errorType = errorType;
    this.statusCode = options?.statusCode;
    this.errors = options?.errors;
    this.cause = options?.cause;
  }
}

/**
 * Classify an API error based on error messages
 *
 * Inspects error messages from the API response and classifies them
 * into a specific error type for easier handling.
 *
 * @param errors - Error messages or error object from the API response
 * @returns The classified error type
 */
export function classifyApiError(
  errors: string[] | Record<string, string>,
): ApiSportsErrorType {
  const errorMessages = Array.isArray(errors) ? errors : Object.values(errors);

  const combined = errorMessages.join(" ").toLowerCase();

  if (
    combined.includes("rate limit") ||
    combined.includes("too many requests") ||
    combined.includes("quota")
  ) {
    return ApiSportsErrorType.RATE_LIMIT;
  }

  if (
    combined.includes("unauthorized") ||
    combined.includes("invalid") ||
    combined.includes("api key") ||
    combined.includes("authentication") ||
    combined.includes("forbidden")
  ) {
    return ApiSportsErrorType.AUTH_FAILURE;
  }

  return ApiSportsErrorType.API_ERROR;
}
