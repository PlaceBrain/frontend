import { useQuery } from '@tanstack/vue-query';
import { api } from '@/shared/api/client';
import { queryKeys } from '@/shared/api/query-keys';
import type { User } from '../model/types';

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.user.me(),
    queryFn: async () => {
      const { data } = await api.get<User>('/api/auth/me');
      return data;
    },
  });
}
