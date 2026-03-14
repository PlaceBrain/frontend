import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/app/layouts/DefaultLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'places',
        component: () => import('@/pages/places/PlacesPage.vue'),
      },
      {
        path: 'places/:placeId',
        name: 'place-detail',
        component: () => import('@/pages/place-detail/PlaceDetailPage.vue'),
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('@/pages/profile/ProfilePage.vue'),
      },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/pages/dashboard/DashboardPage.vue'),
      },
      {
        path: 'places/:placeId/sensors/new',
        name: 'sensor-editor',
        component: () => import('@/pages/sensor-editor/SensorEditorPage.vue'),
      },
      {
        path: 'places/:placeId/devices/new',
        name: 'device-editor',
        component: () => import('@/pages/device-editor/DeviceEditorPage.vue'),
      },
    ],
  },
  {
    path: '/login',
    component: () => import('@/app/layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('@/pages/login/LoginPage.vue'),
      },
    ],
  },
  {
    path: '/register',
    component: () => import('@/app/layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        name: 'register',
        component: () => import('@/pages/register/RegisterPage.vue'),
      },
    ],
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const isAuthenticated = !!localStorage.getItem('access_token');
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth && !isAuthenticated) {
    return { name: 'login' };
  }

  if ((to.name === 'login' || to.name === 'register') && isAuthenticated) {
    return { name: 'places' };
  }
});
