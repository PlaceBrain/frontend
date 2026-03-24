export type PlaceRole = "owner" | "admin" | "viewer" | "unspecified";

export const ASSIGNABLE_ROLE_OPTIONS: { value: string; label: string }[] = [
  { value: "admin", label: "Admin" },
  { value: "viewer", label: "Viewer" },
];
