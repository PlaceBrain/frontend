export const queryKeys = {
  user: {
    me: () => ["user", "me"] as const,
  },
  places: {
    all: () => ["places"] as const,
    detail: (id: string) => ["places", id] as const,
  },
  members: {
    list: (placeId: string) => ["members", placeId] as const,
  },
  devices: {
    list: (placeId: string) => ["devices", placeId] as const,
    detail: (placeId: string, deviceId: string) => ["devices", placeId, deviceId] as const,
  },
  sensors: {
    list: (placeId: string, deviceId: string) => ["sensors", placeId, deviceId] as const,
  },
  actuators: {
    list: (placeId: string, deviceId: string) => ["actuators", placeId, deviceId] as const,
  },
  thresholds: {
    list: (placeId: string, deviceId: string, sensorId: string) =>
      ["thresholds", placeId, deviceId, sensorId] as const,
  },
  telemetry: {
    latest: (placeId: string, deviceId: string) =>
      ["telemetry", "latest", placeId, deviceId] as const,
  },
} as const;
