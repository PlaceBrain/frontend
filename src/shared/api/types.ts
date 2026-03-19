import axios from "axios";

export interface ApiError {
  detail: string;
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error) && error.response?.data?.detail) {
    return error.response.data.detail as string;
  }
  return "An unexpected error occurred";
}
