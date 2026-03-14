import type { PlaceRole } from '@/shared/types';

export interface Member {
  user_id: string;
  role: PlaceRole;
}

export interface AddMemberRequest {
  target_user_id: string;
  role: string;
}

export interface UpdateMemberRoleRequest {
  role: string;
}
