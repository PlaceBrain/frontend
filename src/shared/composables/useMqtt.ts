import { ref, onMounted, onUnmounted, type Ref } from "vue";
import { useQueryClient } from "@tanstack/vue-query";
import mqtt from "mqtt";
import { api } from "@/shared/api/client";
import { queryKeys } from "@/shared/api/query-keys";
import type { MqttCredentials } from "@/shared/types";
import type { Alert, AlertMqttPayload } from "@/entities/alert/model/types";

export function useMqtt(placeId: Ref<string> | string) {
  const latestValues = ref<Map<string, Map<string, { value: number; timestamp: string }>>>(
    new Map(),
  );
  const alerts = ref<Alert[]>([]);
  const connected = ref(false);
  const queryClient = useQueryClient();

  let client: mqtt.MqttClient | null = null;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let credentialRefreshTimer: ReturnType<typeof setTimeout> | null = null;

  const resolveId = () => (typeof placeId === "string" ? placeId : placeId.value);

  async function fetchCredentials(): Promise<MqttCredentials> {
    const { data } = await api.post<MqttCredentials>("/api/mqtt/credentials");
    return data;
  }

  function handleMessage(topic: string, payload: Buffer) {
    try {
      const data = JSON.parse(payload.toString());
      const parts = topic.split("/");

      if (topic.endsWith("/telemetry") && parts.length >= 5) {
        const deviceId = parts[3];
        const values = data.values as Record<string, number> | undefined;
        const ts = data.ts || new Date().toISOString();
        if (values) {
          if (!latestValues.value.has(deviceId)) {
            latestValues.value.set(deviceId, new Map());
          }
          const deviceMap = latestValues.value.get(deviceId)!;
          for (const [key, value] of Object.entries(values)) {
            deviceMap.set(key, { value: Number(value), timestamp: ts });
          }
          // Trigger reactivity
          latestValues.value = new Map(latestValues.value);
        }
      } else if (topic.endsWith("/alerts")) {
        const payload = data as Partial<AlertMqttPayload>;
        if (!payload || typeof payload.id !== "string") return;
        const { event_type, ...rest } = payload as AlertMqttPayload;
        const alert: Alert = {
          ...(rest as Omit<Alert, "status">),
          status: event_type === "resolved" ? "resolved" : "active",
        };
        const existingIdx = alerts.value.findIndex((a) => a.id === alert.id);
        if (existingIdx !== -1) {
          const next = [...alerts.value];
          next[existingIdx] = alert;
          alerts.value = next;
        } else {
          alerts.value = [alert, ...alerts.value].slice(0, 100);
        }
        queryClient.invalidateQueries({ queryKey: queryKeys.alerts.globalCount() });
      }
    } catch {
      // Ignore parse errors
    }
  }

  async function connect() {
    try {
      const creds = await fetchCredentials();

      const protocol = window.location.protocol === "https:" ? "wss" : "ws";
      const wsUrl = `${protocol}://${window.location.host}/mqtt`;

      client = mqtt.connect(wsUrl, {
        username: creds.username,
        password: creds.password,
        reconnectPeriod: 0, // We handle reconnection manually
      });

      client.on("connect", () => {
        connected.value = true;
        const id = resolveId();
        client?.subscribe(`placebrain/${id}/#`);
      });

      client.on("message", handleMessage);

      client.on("close", () => {
        connected.value = false;
      });

      client.on("error", () => {
        connected.value = false;
        scheduleReconnect(5000);
      });

      // Schedule credential refresh before expiry
      const expiresInMs = creds.expires_at * 1000 - Date.now() - 60_000;
      if (expiresInMs > 0) {
        credentialRefreshTimer = setTimeout(() => {
          disconnect();
          connect();
        }, expiresInMs);
      }
    } catch {
      scheduleReconnect(5000);
    }
  }

  function scheduleReconnect(delay: number) {
    if (reconnectTimer) return;
    reconnectTimer = setTimeout(() => {
      reconnectTimer = null;
      connect();
    }, delay);
  }

  function disconnect() {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    if (credentialRefreshTimer) {
      clearTimeout(credentialRefreshTimer);
      credentialRefreshTimer = null;
    }
    if (client) {
      client.end(true);
      client = null;
    }
    connected.value = false;
  }

  onMounted(() => {
    connect();
  });

  onUnmounted(() => {
    disconnect();
  });

  return { latestValues, alerts, connected };
}
