import { useCancelTokenStore } from '@/stores/axios';
import AppWrapper from '@/components/layouts/AppWrapper.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { appConfig } from '@/config';
import NotFoundView from '@/views/pages/NotFoundView.vue';
import LoginView from '@/views/pages/LoginView.vue';
import LoginRedirectView from '@/views/pages/LoginRedirectView.vue';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { AppRoute } from '@/constants';
import { SandboxRoutes } from './app/sandbox';
import { QrCodeRoutes } from './app/qrcode';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: AppRoute.HOME.path,
            component: AppWrapper,
            props: () => appConfig,
            children: [
                {
                    path: '',
                    name: AppRoute.HOME.name,
                    component: () => import('@/views/HomeView.vue'),
                },
                ...SandboxRoutes,
                ...QrCodeRoutes,
            ],
        },
        {
            path: '/',
            name: 'login-redirect',
            component: LoginRedirectView,
        },
        {
            path: AppRoute.LOGIN.path,
            name: AppRoute.LOGIN.name,
            props: () => ({ appName: appConfig.appName }),
            component: LoginView,
        },
        {
            path: '/404',
            component: NotFoundView,
        },
        {
            path: '/:catchAll(.*)',
            redirect: '/404',
        },
    ],
});

router.beforeEach((to, from, next) => {
    // cancel axios pending request when the route change
    const cancelTokenStore = useCancelTokenStore();
    const { cancelPendingRequest } = cancelTokenStore;
    cancelPendingRequest();

    // get login state
    const authStore = useAuthStore();
    const { loggedIn } = storeToRefs(authStore);

    const publicRoutes = [
        AppRoute.LOGIN.path, // login page
        '/404', // not found page
        '/', // redirect page
    ];
    const authRequired = !publicRoutes.includes(to.path);

    // trying to access a restricted page + not logged in
    // redirect to login page
    if (authRequired && !loggedIn.value) {
        next({ name: AppRoute.LOGIN.name });
    } else {
        next();
    }
});

export default router;
