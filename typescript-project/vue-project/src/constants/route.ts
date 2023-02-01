export const AppRoute = Object.freeze({
    LOGIN: { name: 'login', path: '/login' },
    HOME: { name: 'home', path: '/home' },
    QRCODE: {
        INDEX: { name: 'qrcode', path: '/qrcode' },
        GENERATE: { name: 'generate', path: 'generate' },
    },
    SANDBOX: {
        INDEX: { name: 'sandbox', path: '/sandbox' },
        CASA: { name: 'sandbox-casa', path: 'casa' },
        WALLET: { name: 'sandbox-wallet', path: 'wallet' },
    },
});
