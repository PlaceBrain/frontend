import type { PlaceRole } from "@/shared/types";

export interface Member {
  user_id: string;
  username: string;
  role: PlaceRole;
}

export interface AddMemberRequest {
  email: string;
  role: string;
}

export interface UpdateMemberRoleRequest {
  role: string;
}
