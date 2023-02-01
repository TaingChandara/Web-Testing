import { TOKEN_STORAGE_KEY } from '@/constants';
import { AuthService } from '@/services/auth';
import { decodeToken } from '@/misc';
import type { AuthProps } from '@/types';
import { defineStore } from 'pinia';

const getAuthState = (): AuthProps => {
    const response: AuthProps = {
        loggedIn: false,
        authInfo: null,
    };
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) return response;
    // decode jwt token
    const decode = decodeToken(token, true);
    if (!decode) return response;
    const { exp, ...authInfo } = decode;
    // check expired
    if (exp && Date.now() >= exp * 1000) return response;

    return {
        loggedIn: true,
        authInfo,
    };
};

export const useAuthStore = defineStore('authStore', {
    state: () => getAuthState(),
    actions: {
        async authenticate(code: string) {
            try {
                const data = await AuthService.getToken(code);
                this.loggedIn = true;
                this.authInfo = decodeToken(data);
            } catch (err) {
                this.loggedIn = false;
                this.authInfo = null;
                throw err;
            }
        },
        logout() {
            AuthService.logout();
            this.loggedIn = false;
            this.authInfo = null;
        },
        async refreshToken() {
            await AuthService.refreshToken();
        },
    },
});

