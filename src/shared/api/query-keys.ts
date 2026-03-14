export const queryKeys = {
  user: {
    me: () => ['user', 'me'] as const,
  },
  places: {
    all: () => ['places'] as const,
    detail: (id: string) => ['places', id] as const,
  },
  members: {
    list: (placeId: string) => ['members', placeId] as const,
  },
} as const;
