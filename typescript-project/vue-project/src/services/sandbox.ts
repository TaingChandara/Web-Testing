import { http } from '@/config';

// Get Bank List Type ==========================
export type BankListProp = {
    BankName: string;
    ParticipantCode: string;
};

// Initiate Transaction Type ==========================
type InitCasaTrxParam = {
    participantCode: string | null;
    accountNumber: string | null;
    service: string;
    referenceId: string;
};

type InitWalletTrxParam = Omit<InitCasaTrxParam, 'participantCode' | 'accountNumber'> & {
    phoneNumber: string;
};

type CreditorProp = {
    AccountNumber: string;
    ParticipantCode: string;
    BakongAccountId: string;
    BankType: string;
    BankName: string;
    BeneName: string;
    Currency: string;
    KycStatus: string;
};

export type InitCasaTrxResponse = {
    transactionId: string;
    referenceId: string;
    kycText: string;
    creditor: CreditorProp;
};
export type InitWalletTrxResponse = InitCasaTrxResponse;

// Validate Transaction Amount Type ==========================
type ValidateTrxAmountParam = {
    transactionId: string;
    referenceId: string;
    amount: number;
    customerId: string;
    customerName: string;
    /** sender account number */
    accountNumber: string;
    currency: string;
    transactionCurrency: string;
};

type DebtorProp = {
    CustomerId: string;
    CustomerName: string;
    AccountNumber: string;
    Currency: string;
};

type PaymentDetailProp = {
    Amount: number;
    Currency: string;
    Charge: number;
    TotalDebit: number;
    TotalDebitUsd: number;
    Purpose: string;
};

export type TrxAmountResponse = {
    transactionId: string;
    referenceId: string;
    exchangeRateText: string;
    creditor: CreditorProp;
    debtor: DebtorProp;
    paymentDetail: PaymentDetailProp;
};

// Transfer CASA ===================================
type TransferCasaParam = {
    transactionId: string;
    referenceId: string;
    mobilePhone?: string;
    purpose: string;
};
type TransferWalletParam = TransferCasaParam;

type StatusProp = {
    StatusCode: string;
    StatusReason: string;
    TransactionHash: string;
    TransactionTime: string;
};

export type TransferCasaResponse = Omit<TrxAmountResponse, 'exchangeRateText' | 'debtor'> & {
    status: StatusProp;
};
export type TransferWalletResponse = TransferCasaResponse;

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const SandboxService = {
    /** Get banks list */
    async getBankList(): Promise<BankListProp[]> {
        const { data } = await http.get(`${BASE_URL}/channel/banks`);
        return data.data.banks;
    },
    /** Initiate Transaction - CASA */
    async initCasaTrx(param: InitCasaTrxParam): Promise<InitCasaTrxResponse> {
        const { data } = await http.post(`${BASE_URL}/channel/transaction/initiate/account`, param);
        return data.data;
    },
    /** Initiate Transaction - Wallet */
    async initWalletTrx(param: InitWalletTrxParam): Promise<InitWalletTrxResponse> {
        const { data } = await http.post(`${BASE_URL}/channel/transaction/initiate/wallet`, param);
        return data.data;
    },
    /** Validate Transaction Amount */
    async validateTrxAmount(param: ValidateTrxAmountParam): Promise<TrxAmountResponse> {
        const { data } = await http.post(`${BASE_URL}/channel/transaction/amount`, param);
        return data.data;
    },
    /** Transfer CASA */
    async transferCasa(param: TransferCasaParam): Promise<TransferCasaResponse> {
        const { data } = await http.post(`${BASE_URL}/channel/transaction/transfer/account`, param);
        return data.data;
    },
    /** Transfer Wallet */
    async transferWallet(param: TransferWalletParam): Promise<TransferWalletResponse> {
        const { data } = await http.post(`${BASE_URL}/channel/transaction/transfer/wallet`, param);
        return data.data;
    },
};
