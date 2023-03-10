/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_CLIENT_ID: string
    readonly VITE_COGNITO_BASE_URL: string
    readonly VITE_SSO_AUTH_BASE_URL: string
    readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}