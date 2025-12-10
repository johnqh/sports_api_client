/**
 * @module hooks/use-football-transfers
 * @description React hook for transfers endpoint
 */

import { useQuery } from "@tanstack/react-query";
import { useApiFootballClient, useApiFootballStore } from "./context";
import { generateCacheKey } from "../store/cache-utils";
import {
  apiFootballKeys,
  type UseApiFootballQueryOptionsRequired,
} from "./types";
import type {
  FootballTransferResponse,
  FootballTransfersParams,
} from "../types";

/**
 * Hook to fetch player transfers
 *
 * @param options - Query options with player or team param
 * @returns Query result with transfer data
 *
 * @example
 * ```typescript
 * // Get player transfers
 * function PlayerTransfers({ playerId }: Props) {
 *   const { data } = useTransfers({ params: { player: playerId } });
 *   const transfers = data?.response[0]?.transfers;
 *   // ...
 * }
 *
 * // Get team transfers
 * function TeamTransfers({ teamId }: Props) {
 *   const { data } = useTransfers({ params: { team: teamId } });
 *   // ...
 * }
 * ```
 */
export function useFootballTransfers(
  options: UseApiFootballQueryOptionsRequired<
    FootballTransferResponse,
    FootballTransfersParams
  >,
) {
  const client = useApiFootballClient();
  const { getTransfers, setTransfers, cacheTTL } = useApiFootballStore();
  const { params, ...queryOptions } = options;
  const cacheKey = generateCacheKey(
    "transfers",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiFootballKeys.transfers.list(params),
    queryFn: async () => {
      const response = await client.getTransfers(params);
      setTransfers(cacheKey, response.response);
      return response;
    },
    initialData: () => {
      const cached = getTransfers(cacheKey);
      if (cached) {
        return {
          get: "transfers",
          parameters: {} as Record<string, string>,
          errors: [] as string[],
          results: cached.length,
          paging: { current: 1, total: 1 },
          response: cached,
        };
      }
      return undefined;
    },
    staleTime: cacheTTL,
    ...queryOptions,
  });
}
