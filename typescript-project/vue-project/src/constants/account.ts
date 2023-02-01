export type TestAccountProp = {
    jtrbAccount: string;
    customerId: string;
    customerName: string;
    currency: string;
};
export const CCY: { [key: string]: string } = Object.freeze({
    USD: 'USD',
    KHR: 'KHR',
});
export const getAllCCY = () => Object.keys(CCY).map((i) => CCY[i]);

export const TEST_USD_ACCOUNT: TestAccountProp = Object.freeze({
    jtrbAccount: '103288',
    customerId: '100000335',
    customerName: 'Test Account',
    currency: CCY.USD,
});

export const TEST_KHR_ACCOUNT: TestAccountProp = Object.freeze({
    jtrbAccount: '4237719',
    customerId: '100222899',
    customerName: 'Test Account',
    currency: CCY.KHR,
});