import axios from "axios";

export interface ApiError {
  detail: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  has_next: boolean;
  has_prev: boolean;
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error) && error.response?.data?.detail) {
    return error.response.data.detail as string;
  }
  return "An unexpected error occurred";
}
