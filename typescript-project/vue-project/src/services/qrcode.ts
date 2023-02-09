import { http } from '@/config';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

type GenerateQRParam = {
    accountNumber: string | null;
    isMerchant: boolean | null;
    mobileNumber: string | null;
};

export type GenerateQRType = {
    qr: string;
    transactionCurrency: 'KHR' | 'USD';
    merchantName: string;
    accountNumber: string;
    mobileNumber: string;
    isMerchant?: boolean;
};

export const QRService = {
    /** Generate KHQR */
    async generate(params: GenerateQRParam): Promise<GenerateQRType> {
        console.log(params);
        const { data } = await http.post(`${BASE_URL}/utils/khqr/generate`, params);
        return data.data;
    },
};
