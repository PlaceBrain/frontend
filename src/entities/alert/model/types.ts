export type AlertSeverity = "warning" | "critical";
export type AlertStatus = "active" | "resolved";
export type AlertThresholdType = "min" | "max";
export type AlertEventType = "created" | "resolved";

export interface Alert {
  id: string;
  place_id: string;
  device_id: string;
  sensor_id: string;
  threshold_id: string;
  key: string;
  value: number;
  threshold_value: number;
  threshold_type: AlertThresholdType;
  severity: AlertSeverity;
  status: AlertStatus;
  created_at: string;
  resolved_at: string | null;
}

export interface AlertMqttPayload extends Omit<Alert, "status"> {
  event_type: AlertEventType;
}

export interface AlertListFilters {
  severity?: AlertSeverity;
  sensor_id?: string;
  status?: AlertStatus;
  from?: string;
}

export const ALERT_SEVERITY_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "All severities" },
  { value: "warning", label: "Warning" },
  { value: "critical", label: "Critical" },
];

export const ALERT_STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "resolved", label: "Resolved" },
];

export const ALERT_TIME_RANGE_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "All time" },
  { value: "1h", label: "Last hour" },
  { value: "24h", label: "Last 24 hours" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
];

export function timeRangeToIso(range: string): string | undefined {
  if (!range) return undefined;
  const now = Date.now();
  const offsets: Record<string, number> = {
    "1h": 60 * 60 * 1000,
    "24h": 24 * 60 * 60 * 1000,
    "7d": 7 * 24 * 60 * 60 * 1000,
    "30d": 30 * 24 * 60 * 60 * 1000,
  };
  const ms = offsets[range];
  if (!ms) return undefined;
  return new Date(now - ms).toISOString();
}
