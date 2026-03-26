import { computed, ref } from "vue";
import { api } from "@/shared/api/client";

interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

interface RegisterResponse {
  user_id: string;
}

interface OtpResponse {
  success: boolean;
}

const accessToken = ref(localStorage.getItem("access_token"));

export function useAuth() {
  const isAuthenticated = computed(() => !!accessToken.value);

  async function login(email: string, password: string): Promise<void> {
    const params = new URLSearchParams();
    params.append("username", email);
    params.append("password", password);

    const { data } = await api.post<TokenResponse>("/api/auth/login", params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);
    accessToken.value = data.access_token;
  }

  async function register(
    username: string,
    email: string,
    password: string,
  ): Promise<RegisterResponse> {
    const { data } = await api.post<RegisterResponse>("/api/auth/register", {
      username,
      email,
      password,
    });
    return data;
  }

  async function sendOtp(email: string): Promise<OtpResponse> {
    const { data } = await api.post<OtpResponse>("/api/auth/send-otp", { email });
    return data;
  }

  async function verifyOtp(email: string, code: string): Promise<OtpResponse> {
    const { data } = await api.post<OtpResponse>("/api/auth/verify-otp", { email, code });
    return data;
  }

  async function logout(): Promise<void> {
    const refreshToken = localStorage.getItem("refresh_token");
    if (refreshToken) {
      try {
        await api.post("/api/auth/logout", { refresh_token: refreshToken });
      } catch {
        // Ignore logout errors
      }
    }
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    accessToken.value = null;
  }

  return { isAuthenticated, login, register, sendOtp, verifyOtp, logout };
}
