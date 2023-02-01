export type TokenInfoProp = {
    username?: string;
    roles?: string;
    env?: string;
    service?: string;
    exp?: number;
};

export type AuthProps = {
    loggedIn: boolean;
    authInfo?: TokenInfoProp | null;
};

export type JwtPayloadProp = {
    sub?: string;
    env?: string;
    service?: string;
    roles?: string;
    exp?: number;
};
