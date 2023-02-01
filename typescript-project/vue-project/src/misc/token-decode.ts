import type { JwtPayloadProp, TokenInfoProp } from '@/types';
import jwtDecode from 'jwt-decode';

/**
 * Decode JWT token
 * @param token jwt token string
 * @returns
 */
export const decodeToken = (token: string, includeExp: boolean = false): TokenInfoProp | null => {
    try {
        const decode = jwtDecode(token);
        if (!decode) return null;
        const { sub, env, service, roles, exp } = decode as JwtPayloadProp;

        return {
            username: sub,
            roles,
            env,
            service,
            ...(includeExp ? { exp } : {}),
        };
    } catch (_ignore) {
        return null;
    }
};
