import { http } from '@/config';
import { CODE_VERIFIER_KEY, TOKEN_STORAGE_KEY } from '@/constants';
import pkceChallenge from 'pkce-challenge';

export const AuthService = {
    /**
     * Login using cognito
     */
    login() {
        const cognitoUrl = import.meta.env.VITE_COGNITO_BASE_URL;
        const clientId = import.meta.env.VITE_CLIENT_ID;
        const redirectUri = `${window.location.origin}/`;
        // Generate code challenge
        const { code_verifier, code_challenge } = pkceChallenge();
        sessionStorage.setItem(CODE_VERIFIER_KEY, code_verifier);

        window.location.href = `${cognitoUrl}/authorize?response_type=code&client_id=${clientId}&code_challenge_method=S256&code_challenge=${code_challenge}&redirect_uri=${redirectUri}&scope=openid+profile+email`;
    },

    /**
     * Get token using auth code param
     * @param code cognito_code
     * @returns accessToken
     */
    async getToken(code: string) {
        // get verifier use to create the challenge
        const codeVerifier = sessionStorage.getItem(CODE_VERIFIER_KEY);
        if (!codeVerifier) {
            throw 'Invalid code verifier';
        }

        const ssoAuthUrl = import.meta.env.VITE_SSO_AUTH_BASE_URL;
        const clientId = import.meta.env.VITE_CLIENT_ID;
        const redirectUri = `${window.location.origin}/`;
        const codeAuthUrl = `${ssoAuthUrl}/login/code?clientId=${clientId}&redirectUri=${redirectUri}&codeVerifier=${codeVerifier}`;
        const { data: response } = await http.get(codeAuthUrl, {
            withCredentials: true,
            headers: { Authorization: `Bearer ${code}` },
        });

        // remove code_verifier
        sessionStorage.removeItem(CODE_VERIFIER_KEY);
        if (!(response.data && response.data.token)) {
            throw 'Invalid token';
        }
        // update access token in Local Storage
        localStorage.setItem(TOKEN_STORAGE_KEY, response.data.token);

        return response.data.token;
    },

    /**
     * Refresh token
     * @returns access token
     */
    async refreshToken() {
        const token = localStorage.getItem(TOKEN_STORAGE_KEY);
        if (!token) throw 'Invalid token';

        const ssoAuthUrl = import.meta.env.VITE_SSO_AUTH_BASE_URL;
        const { data: response } = await http.get(`${ssoAuthUrl}/refresh?accessToken=${token}`, {
            withCredentials: true,
        });

        if (!(response.data && response.data.token)) {
            throw 'Invalid token';
        }

        // update access token in Local Storage
        localStorage.setItem(TOKEN_STORAGE_KEY, response.data.token);

        return response.data.token;
    },

    /**
     * Logout
     */
    logout() {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
    },
};
