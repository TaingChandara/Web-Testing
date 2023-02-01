export const TOKEN_STORAGE_KEY = 'jtrb_creds';
export const CODE_VERIFIER_KEY = 'jtrb_code_verifier';
export const SERVICE_NAME = 'BAKONG-PORTAL';
export { AppRoute } from './route';
export { getAllCCY, CCY, TEST_USD_ACCOUNT, TEST_KHR_ACCOUNT, type TestAccountProp } from './account';

export const EVENT_BUS = Object.freeze({
    ERROR_CAPTURE: 'JTRB_ERROR_CAPTURE',
    SHOW_PROGRESS: 'JTRB_SHOW_PROGRESS',
    HIDE_PROGRESS: 'JTRB_HIDE_PROGRESS',
});
