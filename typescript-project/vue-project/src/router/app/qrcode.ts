import { AppRoute } from '@/constants';

const routes = {
    INDEX: {
        path: AppRoute.QRCODE.INDEX.path,
        name: AppRoute.QRCODE.INDEX.name,
        redirect: {
            name: AppRoute.QRCODE.GENERATE.name,
        },
        children: [
            {
                path: AppRoute.QRCODE.GENERATE.path,
                name: AppRoute.QRCODE.GENERATE.name,
                component: () => import('@/views/qrcode/JtrbQRcodeView.vue'),
            },
        ],
    },
};

export const QrCodeRoutes = [routes.INDEX];
