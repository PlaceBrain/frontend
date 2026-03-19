import { useQuery } from "@tanstack/vue-query";
import type { User } from "../model/types";
import { api } from "@/shared/api/client";
import { queryKeys } from "@/shared/api/query-keys";

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.user.me(),
    queryFn: async () => {
      const { data } = await api.get<User>("/api/auth/me");
      return data;
    },
  });
}
