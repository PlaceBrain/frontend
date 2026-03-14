import type { PlaceRole } from '@/shared/types';

export interface Place {
  place_id: string;
  name: string;
  description: string;
  user_role: PlaceRole;
}

export interface CreatePlaceRequest {
  name: string;
  description?: string;
}

export interface UpdatePlaceRequest {
  name: string;
  description: string;
}
