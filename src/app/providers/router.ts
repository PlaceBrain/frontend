import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("@/app/layouts/DefaultLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "places",
        component: () => import("@/pages/places/PlacesPage.vue"),
      },
      {
        path: "places/:placeId",
        component: () => import("@/pages/place-detail/PlaceDetailPage.vue"),
        children: [
          {
            path: "",
            name: "place-detail",
            redirect: (to) => ({ name: "place-overview", params: to.params }),
          },
          {
            path: "overview",
            name: "place-overview",
            component: () => import("@/pages/place-overview/PlaceOverviewPage.vue"),
          },
          {
            path: "devices",
            name: "devices-list",
            component: () => import("@/pages/devices-list/DevicesListPage.vue"),
          },
          {
            path: "charts",
            name: "place-charts",
            component: () => import("@/pages/place-charts/PlaceChartsPage.vue"),
          },
          {
            path: "alerts",
            name: "place-alerts",
            component: () => import("@/pages/place-alerts/PlaceAlertsPage.vue"),
          },
          {
            path: "members",
            name: "place-members",
            component: () => import("@/pages/place-members/PlaceMembersPage.vue"),
          },
          {
            path: "settings",
            name: "place-settings",
            component: () => import("@/pages/place-settings/PlaceSettingsPage.vue"),
          },
        ],
      },
      {
        path: "places/:placeId/devices/:deviceId",
        name: "device-detail",
        component: () => import("@/pages/device-detail/DeviceDetailPage.vue"),
      },
      {
        path: "profile",
        name: "profile",
        component: () => import("@/pages/profile/ProfilePage.vue"),
      },
      {
        path: "dashboard",
        name: "dashboard",
        component: () => import("@/pages/dashboard/DashboardPage.vue"),
      },
      {
        path: "alerts",
        name: "alerts",
        component: () => import("@/pages/alerts/AlertsPage.vue"),
      },
    ],
  },
  {
    path: "/login",
    component: () => import("@/app/layouts/AuthLayout.vue"),
    children: [
      {
        path: "",
        name: "login",
        component: () => import("@/pages/login/LoginPage.vue"),
      },
    ],
  },
  {
    path: "/register",
    component: () => import("@/app/layouts/AuthLayout.vue"),
    children: [
      {
        path: "",
        name: "register",
        component: () => import("@/pages/register/RegisterPage.vue"),
      },
    ],
  },
  {
    path: "/verify-otp",
    component: () => import("@/app/layouts/AuthLayout.vue"),
    children: [
      {
        path: "",
        name: "verify-otp",
        component: () => import("@/pages/verify-otp/VerifyOtpPage.vue"),
      },
    ],
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const isAuthenticated = !!localStorage.getItem("access_token");
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth && !isAuthenticated) {
    return { name: "login" };
  }

  if (
    (to.name === "login" || to.name === "register" || to.name === "verify-otp") &&
    isAuthenticated
  ) {
    return { name: "places" };
  }
});
