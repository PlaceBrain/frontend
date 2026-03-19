import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import type { Ref } from "vue";
import { computed } from "vue";
import type { Member, AddMemberRequest, UpdateMemberRoleRequest } from "../model/types";
import { api } from "@/shared/api/client";
import { queryKeys } from "@/shared/api/query-keys";

export function useMembers(placeId: Ref<string> | string) {
  const id = typeof placeId === "string" ? placeId : placeId;
  return useQuery({
    queryKey: computed(() => queryKeys.members.list(typeof id === "string" ? id : id.value)),
    queryFn: async () => {
      const resolvedId = typeof id === "string" ? id : id.value;
      const { data } = await api.get<{ members: Member[] }>(`/api/places/${resolvedId}/members`);
      return data.members;
    },
  });
}

export function useAddMember(placeId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (req: AddMemberRequest) => {
      await api.post(`/api/places/${placeId}/members`, req);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.members.list(placeId) });
    },
  });
}

export function useUpdateMemberRole(placeId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const req: UpdateMemberRoleRequest = { role };
      await api.put(`/api/places/${placeId}/members/${userId}`, req);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.members.list(placeId) });
    },
  });
}

export function useRemoveMember(placeId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      await api.delete(`/api/places/${placeId}/members/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.members.list(placeId) });
    },
  });
}
