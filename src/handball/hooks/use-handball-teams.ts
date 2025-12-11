/**
 * @module handball/hooks/use-handball-teams
 * @description React hook for teams endpoint
 */

import { useQuery } from "@tanstack/react-query";
import { useApiHandballClient, useApiHandballStore } from "./handball-context";
import { generateCacheKey } from "../../utils/cache-utils";
import {
  apiHandballKeys,
  type UseApiHandballQueryOptions,
} from "./handball-types";
import type { HandballTeamResponse, HandballTeamsParams } from "../types";

export function useHandballTeams(
  options?: UseApiHandballQueryOptions<
    HandballTeamResponse,
    HandballTeamsParams
  >,
) {
  const client = useApiHandballClient();
  const { getTeams, setTeams, cacheTTL } = useApiHandballStore();
  const params = options?.params;
  const cacheKey = generateCacheKey(
    "teams",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiHandballKeys.teams.list(params),
    queryFn: async () => {
      const response = await client.getTeams(params);
      setTeams(cacheKey, response.response);
      return response;
    },
    initialData: () => {
      const cached = getTeams(cacheKey);
      if (cached) {
        return {
          get: "teams",
          parameters: {} as Record<string, string>,
          errors: [] as string[],
          results: cached.length,
          response: cached,
        };
      }
      return undefined;
    },
    staleTime: cacheTTL,
    ...options,
  });
}
