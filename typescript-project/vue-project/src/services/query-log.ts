import { http } from "@/config";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

type ProcessLogPaarams = {
  trxnId?: string | null;
  logd?: string | null;
  errorCode?: string | null;
  logType?: string | null;
  logStatus?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  limit?: number | null;
  exclusivesStarKey?: string;
};

type TransactionLogParams = {
    trxnId?: string | null;
    referenceId?: string | null;
    debitAccount?: string | null;
    creditAccount?: string | null;
    transferType?: string | null;
    trxnSatus?: string | null;
    trxnStartDate?: string | null;
    trxnEndDate?: string | null;
    trxnHash?: string | null;
    limit?: number | null;
    exclusiveStartKey?: string;
};

type CustomerTransactionLogParams = {
    trxnId?: string | null;
    referenceId?: string | null;
    customerId?: string | null;
    trxnStatus?: string | null;
    trxnStartDate?: string | null;
    trxnEndDate?: string | null;
    transferType?: string | null;
    limit?: number | null;
    exclusiveStartKey?: string;
};

export type ProcessLogType = {
    LogStatus: string;
    LogType: string;
    ErrorMessage?: string;
    LogTime: string;
    LogId: string;
    ErrorCode?: string;
    TransactionId?: string;
};

type PaymentDetailType = {
    ExchangeRate?: number;
    Amount: number;
    Currency: string;
    Charge: number;
    TotalDebitUsd: number;
    Purpose: string;
    TotalDebit: number;
    TotalDebitKhr: number;
};

type DebtorType = {
    CustomerId: string;
    CustomerName: string;
    AccountNumber: string;
    Currency: string;
};

type CreditorType = {
    BankName: string;
    KycStatus: string;
    Currency: string;
    BeneName: string;
    BankType: string;
    BakongAccountId: string;
    AccountNumber: string;
    ParticipantCode: string;
};

export type TransactionLogType = {
    TransactionId: string;
    ReferenceId: string;
    TransactionTime: string;
    TransactionStatus: string;
    UpdatedTime: string;
    LogTime: string;
    CreditAccount: string;
    DebitAccount: string;
    TransferType: string;
    TransactionHash?: string;
    PaymentDetail: PaymentDetailType;
    Debtor: DebtorType;
    Creditor: CreditorType;
};

export type CustomerTransactionLogType = {
    TransactionId: string;
    CustomerId: string;
    TransferType: string;
    ReferenceId: string;
    TransactionTime: string;
    TransactionStatus: string;
    LogTime: string;
    PaymentDetail: PaymentDetailType;
    Debtor: DebtorType;
    Creditor: CreditorType;
};

export const QueryLogService = {
    /** Get Process Log */
    async getProcessLog(params: ProcessLogParams, allItems: ProcessLogType[] = []): Promise<ProcessLogType[]> {
        const exclusiveStartKey = params.exclusiveStartKey ? encodeURIComponent(params.exclusiveStartKey) : undefined;

        const { data } = await http.get(`${BASE_URL}/query/log/process`, {
            params: { ...params, exclusiveStartKey },
        });
        allItems.push(...data.data);

        if (data.morePages && data.lastEvaluatedKey) {
            return this.getProcessLog(
                { ...params, exclusiveStartKey: JSON.stringify(data.lastEvaluatedKey) },
                allItems
            );
        }
        return allItems;
    },

    /** Get Transaction Log */
    async getTransactionLog(
        params: TransactionLogParams,
        allItems: TransactionLogType[] = []
    ): Promise<TransactionLogType[]> {
        const exclusiveStartKey = params.exclusiveStartKey ? encodeURIComponent(params.exclusiveStartKey) : undefined;

        const { data } = await http.get(`${BASE_URL}/query/log/transaction`, {
            params: { ...params, exclusiveStartKey },
        });
        allItems.push(...data.data);

        if (data.morePages && data.lastEvaluatedKey) {
            return this.getTransactionLog(
                { ...params, exclusiveStartKey: JSON.stringify(data.lastEvaluatedKey) },
                allItems
            );
        }
        return allItems;
    },

    /** Get Customer Transaction Log */
    async getCustomerTransactionLog(params: CustomerTransactionLogParams): Promise<CustomerTransactionLogType[]> {
        const { data } = await http.get(`${BASE_URL}/query/log/customer-transaction`, { params });
        return data.data;
    },
};
