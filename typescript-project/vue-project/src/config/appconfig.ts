import { AppRoute } from '@/constants';

export const appConfig = {
    appName: 'Bakong Portal',
    menu: [
        {
            label: 'Home',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: { name: AppRoute.HOME.name } }],
        },
        {
            label: 'KHQR',
            items: [{ label: 'QR Generator', icon: 'pi pi-fw pi-qrcode', to: { name: AppRoute.QRCODE.GENERATE.name } }],
        },
        {
            label: 'Sandbox',
            items: [
                { label: 'CASA Transfer', icon: 'pi pi-fw pi-credit-card', to: { name: AppRoute.SANDBOX.CASA.name } },
                { label: 'Wallet Transfer', icon: 'pi pi-fw pi-wallet', to: { name: AppRoute.SANDBOX.WALLET.name } },
            ],
        },
    ],
};
