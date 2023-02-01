import { AppRoute, TOKEN_STORAGE_KEY } from '@/constants';
import axios, { type AxiosRequestConfig } from 'axios';
import { useCancelTokenStore } from '@/stores/axios';
import { useAuthStore } from '@/stores/auth';
import router from '@/router';

const LOGIN_URL = `${import.meta.env.VITE_SSO_AUTH_BASE_URL}/login/code`;
const REFRESH_URL = `${import.meta.env.VITE_SSO_AUTH_BASE_URL}/refresh`;

export const instance = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
});

export const setupInterceptors = () => {
    // request interceptor
    instance.interceptors.request.use(
        (config: AxiosRequestConfig) => {
            let isLoginUrl;
            let isRefreshUrl;
            if (config && config.url) {
                isLoginUrl = config.url.startsWith(LOGIN_URL);
                isRefreshUrl = config.url.startsWith(REFRESH_URL);
            }

            //  Generate cancel token source
            const source = axios.CancelToken.source();
            // Set cancel token on this request
            config.cancelToken = source.token;
            // add cancel token to AppState, which will be use to cancel the request when the route is changed
            const cancelTokenStore = useCancelTokenStore();
            const { addCancelToken } = cancelTokenStore;
            if (!isRefreshUrl) addCancelToken(source);

            // set Authorization header
            const token = localStorage.getItem(TOKEN_STORAGE_KEY);
            if (token && config.headers && !isLoginUrl && !isRefreshUrl) {
                config.headers['Authorization'] = 'Bearer ' + token;
            }

            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // response interceptor
    instance.interceptors.response.use(
        (res) => {
            return res;
        },
        async (err) => {
            const originalConfig = err.config;
            let isLoginUrl;
            let isRefreshUrl;
            if (originalConfig && originalConfig.url) {
                isLoginUrl = originalConfig.url.startsWith(LOGIN_URL);
                isRefreshUrl = originalConfig.url.startsWith(REFRESH_URL);
            }

            // auto get refresh token if expired
            // if it's not a login/refreshToken http request
            if (!isLoginUrl && !isRefreshUrl && err.response && err.response.status === 401) {
                const authStore = useAuthStore();
                const { refreshToken, logout } = authStore;
                try {
                    await refreshToken();
                    return instance(originalConfig);
                } catch (_error) {
                    logout();
                    router.push({ name: AppRoute.LOGIN.name });
                    return Promise.reject(_error);
                }
            }

            return Promise.reject(err);
        }
    );
};
