export type PlaceRole = "owner" | "admin" | "viewer" | "unspecified";

export interface MqttCredentials {
  username: string;
  password: string;
  expires_at: number;
}

export const ASSIGNABLE_ROLE_OPTIONS: { value: string; label: string }[] = [
  { value: "admin", label: "Admin" },
  { value: "viewer", label: "Viewer" },
];
