import type { PlaceRole } from '@/shared/types';

const roleLabels: Record<PlaceRole, string> = {
  owner: 'Owner',
  admin: 'Admin',
  viewer: 'Viewer',
  unspecified: 'Unknown',
};

export function formatRole(role: PlaceRole): string {
  return roleLabels[role] ?? 'Unknown';
}
