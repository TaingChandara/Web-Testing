import { AppRoute } from '@/constants';

const routes = {
    INDEX: {
        path: AppRoute.SANDBOX.INDEX.path,
        name: AppRoute.SANDBOX.INDEX.name,
        redirect: {
            name: AppRoute.SANDBOX.CASA.name,
        },
        children: [
            {
                path: AppRoute.SANDBOX.CASA.path,
                name: AppRoute.SANDBOX.CASA.name,
                component: () => import('@/views/sandbox/Jtrb2CasaView.vue'),
            },
            {
                path: AppRoute.SANDBOX.WALLET.path,
                name: AppRoute.SANDBOX.WALLET.name,
                component: () => import('@/views/sandbox/Jtrb2WalletView.vue'),
            },
        ],
    },
};

export const SandboxRoutes = [routes.INDEX];
