<script setup lang="ts">
import { useEventService } from '@/composables/useEventService';
import { getAllCCY, SERVICE_NAME, TEST_USD_ACCOUNT, type TestAccountProp } from '@/constants';
import { genRandHex, sleep } from '@/misc';
import {
    SandboxService,
    type InitWalletTrxResponse,
    type TransferWalletResponse,
    type TrxAmountResponse,
} from '@/services/sandbox';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import JtrbAccountDialog from './components/JtrbAccountDialog.vue';
import JtrbCard from './components/JtrbCard.vue';

const evs = useEventService();
const router = useRouter();

type FormData = {
    jtrbAccount: string;
    customerId: string;
    customerName: string;
    currency: string;
    phoneNumber: string | null;
    transactionCurrency: string | null;
    amount: number | null;
    purpose: string | null;
};

const formData = reactive<FormData>({
    jtrbAccount: TEST_USD_ACCOUNT.jtrbAccount,
    customerId: TEST_USD_ACCOUNT.customerId,
    customerName: TEST_USD_ACCOUNT.customerName,
    currency: TEST_USD_ACCOUNT.currency,
    phoneNumber: null,
    transactionCurrency: null,
    amount: null,
    purpose: null,
});

const rules = {
    phoneNumber: { required },
    transactionCurrency: { required },
    amount: { required },
    purpose: { required },
};
const validationProps = reactive({
    scope: 'JTRB_TEST_ACCOUNT',
    name: 'jtrbTestAccount',
});
const v$ = useVuelidate(rules, formData, { $scope: validationProps.scope, $stopPropagation: true });
const loading = reactive({
    initTrx: false,
    verifyAmount: false,
});
const dialog = reactive({
    account: false,
    transfer: false,
    success: false,
});
const ccyOptions = ref(getAllCCY());

const trxInfo = reactive<Partial<InitWalletTrxResponse>>({});
const setInitTrx = (data?: InitWalletTrxResponse) => {
    trxInfo.transactionId = data?.transactionId;
    trxInfo.referenceId = data?.referenceId;
    trxInfo.kycText = data?.kycText;
    trxInfo.creditor = data?.creditor;
};

const transferPayload = reactive<Partial<TrxAmountResponse>>({});
const setTransferPayload = (data?: TrxAmountResponse) => {
    transferPayload.transactionId = data?.transactionId;
    transferPayload.referenceId = data?.referenceId;
    transferPayload.exchangeRateText = data?.exchangeRateText;
    transferPayload.creditor = data?.creditor;
    transferPayload.debtor = data?.debtor;
    transferPayload.paymentDetail = data?.paymentDetail;
};

const fundTransfer = reactive<Partial<TransferWalletResponse>>({});
const setFundTransfer = (data?: TransferWalletResponse) => {
    fundTransfer.transactionId = data?.transactionId;
    fundTransfer.referenceId = data?.referenceId;
    fundTransfer.status = data?.status;
    fundTransfer.creditor = data?.creditor;
    fundTransfer.paymentDetail = data?.paymentDetail;
};

// Initiate Transaction =================================
const handleInitTrx = async () => {
    if (!formData.phoneNumber) return;
    try {
        loading.initTrx = true;
        // reset data
        setInitTrx();
        setTransferPayload();
        resetAmount();

        const trxData = await SandboxService.initWalletTrx({
            phoneNumber: `855${formData.phoneNumber}`,
            service: SERVICE_NAME,
            referenceId: genRandHex(12),
        });
        // Handle API Gateway timeout, response OK 200
        if (!trxData) return evs.captureError();
        setInitTrx(trxData);
    } catch (err) {
        evs.captureError(err);
    } finally {
        loading.initTrx = false;
    }
};

// Validate Transaction Amount =====================================
const handleVerifyAmount = async () => {
    if (!formData.amount) return;
    if (!formData.transactionCurrency) return evs.captureError('Transaction Currency is required');
    if (!trxInfo.transactionId) return evs.captureError();
    try {
        // reset data
        setTransferPayload();
        loading.verifyAmount = true;
        const validData = await SandboxService.validateTrxAmount({
            transactionId: trxInfo.transactionId!,
            referenceId: trxInfo.referenceId!,
            amount: Number(formData.amount),
            customerId: formData.customerId,
            customerName: formData.customerName,
            accountNumber: formData.jtrbAccount,
            currency: formData.currency,
            transactionCurrency: formData.transactionCurrency!,
        });
        // Handle API Gateway timeout, response OK 200
        if (!validData) return evs.captureError();
        setTransferPayload(validData);
    } catch (err) {
        evs.captureError(err);
    } finally {
        loading.verifyAmount = false;
    }
};

// Fund Transfer =============================
const handleSubmit = async () => {
    evs.showProgress('Processing ...');
    try {
        // reset data
        setFundTransfer();
        const transferData = await SandboxService.transferWallet({
            transactionId: transferPayload.transactionId!,
            referenceId: transferPayload.referenceId!,
            purpose: String(formData.purpose),
        });
        // Handle API Gateway timeout, response OK 200
        if (!transferData) return evs.captureError();
        setFundTransfer(transferData);
        dialog.transfer = false;
        await sleep(800);
        dialog.success = true;
    } catch (err) {
        dialog.transfer = false;
        evs.captureError(err);
    } finally {
        evs.hideProgress();
    }
};

// dialog account =================================
const resetAccount = (data: TestAccountProp) => {
    formData.jtrbAccount = data.jtrbAccount;
    formData.customerId = data.customerId;
    formData.customerName = data.customerName;
    formData.currency = data.currency;
};
const changeAccount = (data: TestAccountProp) => {
    resetAccount(data);
    setTransferPayload();
    resetAmount();
    dialog.account = false;
};

// utils function =================================
const handleEnter = (event: FocusEvent) => {
    const target = event.target as Window;
    target.blur();
};

const resetAmount = () => {
    formData.amount = null;
    v$.value.amount.$reset();
};

const changeTrxCCY = () => {
    setTransferPayload();
    resetAmount();
};
</script>

<template>
    <div class="grid">
        <div class="col-12 lg:col-8">
            <div class="card">
                <h5>Wallet Fund Transfer</h5>
                <form class="p-fluid mt-5" @submit.prevent="dialog.transfer = true">
                    <div class="field col-6 md:col-4">
                        <JtrbCard
                            @click="dialog.account = true"
                            style="cursor: pointer"
                            :customer-name="formData.customerName"
                            :ccy="formData.currency"
                            :jtrb-account="formData.jtrbAccount"
                        />
                    </div>
                    <div class="field mt-5">
                        <div class="p-float-label" :class="{ 'p-input-icon-right': loading.initTrx }">
                            <i v-if="loading.initTrx" class="pi pi-spin pi-spinner"></i>
                            <PInputMask
                                id="phoneNumber"
                                v-model="v$.phoneNumber.$model"
                                mask="099-999999?9"
                                :class="{ 'p-invalid': v$.phoneNumber.$invalid && v$.phoneNumber.$dirty }"
                                :disabled="loading.initTrx"
                                @blur="handleInitTrx"
                                @keydown.enter="handleEnter"
                                unmask
                            />
                            <label for="phoneNumber">Bakong Wallet Account*</label>
                        </div>
                        <span v-if="v$.phoneNumber.$silentErrors && v$.phoneNumber.$dirty">
                            <span v-for="(error, index) of v$.phoneNumber.$silentErrors" :key="index">
                                <small class="p-error">
                                    {{ String(error.$message).replace('Value', 'Bakong Wallet Account') }}
                                </small>
                            </span>
                        </span>
                    </div>
                    <div class="field mx-2" v-if="trxInfo.transactionId">
                        <div class="font-bold text-sm text-gray-300">Account Name:</div>
                        <div class="font-bold text-sm mb-2">{{ trxInfo.creditor?.BeneName }}</div>
                        <div class="font-bold text-sm text-gray-300">KYC Status:</div>
                        <div class="font-bold text-sm mb-2">{{ trxInfo.kycText }}</div>
                    </div>
                    <div class="field mt-5">
                        <div class="p-float-label">
                            <PDropdown
                                id="transactionCurrency"
                                v-model="v$.transactionCurrency.$model"
                                :options="ccyOptions"
                                :class="{
                                    'p-invalid': v$.transactionCurrency.$invalid && v$.transactionCurrency.$dirty,
                                }"
                                :showClear="true"
                                :disabled="!trxInfo.transactionId"
                                @change="changeTrxCCY"
                            />
                            <label for="transactionCurrency">Transaction Currency*</label>
                        </div>
                        <span v-if="v$.transactionCurrency.$silentErrors && v$.transactionCurrency.$dirty">
                            <span v-for="(error, index) of v$.transactionCurrency.$silentErrors" :key="index">
                                <small class="p-error">
                                    {{ String(error.$message).replace('Value', 'Transaction Currency') }}
                                </small>
                            </span>
                        </span>
                    </div>
                    <div class="field mt-5">
                        <div class="p-float-label" :class="{ 'p-input-icon-right': loading.verifyAmount }">
                            <i v-if="loading.verifyAmount" class="pi pi-spin pi-spinner"></i>
                            <PInputText
                                id="amount"
                                v-model="v$.amount.$model"
                                :format="false"
                                :class="{ 'p-invalid': v$.amount.$invalid && v$.amount.$dirty }"
                                :disabled="loading.verifyAmount || !trxInfo.transactionId"
                                @blur="handleVerifyAmount"
                                @keyup.enter="handleEnter"
                            />
                            <label for="amount">Transaction Amount*</label>
                        </div>
                        <span v-if="v$.amount.$silentErrors && v$.amount.$dirty">
                            <span v-for="(error, index) of v$.amount.$silentErrors" :key="index">
                                <small class="p-error">
                                    {{ String(error.$message).replace('Value', 'Transaction Amount') }}
                                </small>
                            </span>
                        </span>
                    </div>
                    <div class="field mx-2" v-if="transferPayload.paymentDetail">
                        <template v-if="transferPayload.paymentDetail?.Currency !== transferPayload.debtor?.Currency">
                            <div class="font-bold text-sm text-gray-300">Exchange Rate:</div>
                            <div class="font-bold text-sm mb-2">{{ transferPayload.exchangeRateText }}</div>
                        </template>
                        <div class="font-bold text-sm text-gray-300">Charge:</div>
                        <div class="font-bold text-sm mb-2">
                            {{ transferPayload.paymentDetail?.Currency }} {{ transferPayload.paymentDetail?.Charge }}
                        </div>
                        <div class="font-bold text-sm text-gray-300">Total Debit Amount:</div>
                        <div class="font-bold text-sm mb-2">
                            {{ transferPayload.paymentDetail?.Currency }}&nbsp;{{
                                transferPayload.paymentDetail?.TotalDebit
                            }}
                        </div>
                    </div>
                    <div class="field mt-5">
                        <div class="p-float-label">
                            <PInputText
                                id="purpose"
                                v-model="v$.purpose.$model"
                                :class="{ 'p-invalid': v$.purpose.$invalid && v$.purpose.$dirty }"
                                :disabled="!transferPayload.transactionId"
                            />
                            <label for="purpose">Purpose of Payment*</label>
                        </div>
                        <span v-if="v$.purpose.$silentErrors && v$.purpose.$dirty">
                            <span v-for="(error, index) of v$.purpose.$silentErrors" :key="index">
                                <small class="p-error">
                                    {{ String(error.$message).replace('Value', 'Purpose of Payment') }}
                                </small>
                            </span>
                        </span>
                    </div>
                    <PButton type="submit" label="Procced to confirm" class="mt-5" :disabled="v$.$invalid" />
                </form>
            </div>
        </div>
    </div>
    <JtrbAccountDialog
        v-model:visible="dialog.account"
        :data="formData"
        :scope="validationProps.scope"
        :validation-key="validationProps.name"
        @change="changeAccount"
    />
    <PDialog
        v-model:visible="dialog.transfer"
        :showHeader="false"
        :closable="false"
        :modal="true"
        :style="{ width: '480px' }"
    >
        <h5 class="py-4">Review Details</h5>
        <div>
            <div class="font-bold text-sm text-gray-300">Bakong Wallet Account</div>
            <div class="font-bold text-sm mt-2 mb-4">{{ `0${formData.phoneNumber}` }}</div>
            <div class="font-bold text-sm text-gray-300">Account Name</div>
            <div class="font-bold text-sm mt-2 mb-4">{{ transferPayload.creditor?.BeneName }}</div>
            <div class="font-bold text-sm text-gray-300">KYC Status</div>
            <div class="font-bold text-sm mt-2 mb-4">{{ trxInfo.kycText }}</div>
            <div class="font-bold text-sm text-gray-300">Transaction Currency</div>
            <div class="font-bold text-sm mt-2 mb-4">{{ transferPayload.paymentDetail?.Currency }}</div>
            <div class="font-bold text-sm text-gray-300">Transaction Amount</div>
            <div class="font-bold text-sm mt-2 mb-4">
                {{ transferPayload.paymentDetail?.Currency }} {{ transferPayload.paymentDetail?.Amount }}
            </div>
            <template v-if="transferPayload.paymentDetail?.Currency !== transferPayload.debtor?.Currency">
                <div class="font-bold text-sm text-gray-300">Exchange Rate</div>
                <div class="font-bold text-sm mt-2 mb-4">{{ transferPayload.exchangeRateText }}</div>
            </template>
            <div class="font-bold text-sm text-gray-300">Charge</div>
            <div class="font-bold text-sm mt-2 mb-4">
                {{ transferPayload.paymentDetail?.Currency }} {{ transferPayload.paymentDetail?.Charge }}
            </div>
            <div class="font-bold text-sm text-gray-300">Total Amount</div>
            <div class="font-bold text-sm mt-2 mb-4">
                {{ transferPayload.paymentDetail?.Currency }} {{ transferPayload.paymentDetail?.TotalDebit }}
            </div>
            <div class="font-bold text-sm text-gray-300">Purpose of Payment</div>
            <div class="font-bold text-sm mt-2 mb-4">{{ formData.purpose }}</div>
        </div>
        <template #footer>
            <div class="flex justify-content-between">
                <PButton label="Back" @click="dialog.transfer = false" class="p-button-sm p-button-outlined" />
                <PButton label="Submit" @click="handleSubmit" class="p-button-sm" />
            </div>
        </template>
    </PDialog>
    <PDialog v-model:visible="dialog.success" :closable="false" :modal="true" :style="{ width: '480px' }">
        <template #header>
            <div class="col-12 text-center">
                <div><i class="pi pi-check-circle" style="font-size: 4rem; color: var(--green-600)"></i></div>
            </div>
        </template>
        <div class="text-center">
            <h5 class="text-primary">Yay! It's done!</h5>
            <div class="text-primary font-bold text-sm">{{ fundTransfer.status?.StatusReason }}</div>
            <div class="mt-6">
                <div class="font-bold text-sm text-gray-300">Reference Number</div>
                <div class="font-bold text-sm mt-2 mb-4">{{ fundTransfer.referenceId }}</div>
                <div class="font-bold text-sm text-gray-300">Transaction Hash Number</div>
                <div class="font-bold text-sm mt-2 mb-4">{{ fundTransfer.status?.TransactionHash }}</div>
                <div class="font-bold text-sm text-gray-300">Date & Time</div>
                <div class="font-bold text-sm mt-2 mb-4">{{ fundTransfer.status?.TransactionTime }}</div>
                <div class="font-bold text-sm text-gray-300">Bakong Wallet Account</div>
                <div class="font-bold text-sm mt-2 mb-4">{{ fundTransfer.creditor?.AccountNumber }}</div>
                <div class="font-bold text-sm text-gray-300">Receiver Name</div>
                <div class="font-bold text-sm mt-2 mb-4">{{ fundTransfer.creditor?.BeneName }}</div>
                <div class="font-bold text-sm text-gray-300">Transaction Amount</div>
                <div class="font-bold text-sm mt-2 mb-4">
                    {{ fundTransfer.paymentDetail?.Currency }} {{ fundTransfer.paymentDetail?.Amount }}
                </div>
            </div>
        </div>
        <template #footer>
            <div class="flex justify-content-center">
                <PButton label="Done" @click="router.go(0)" class="p-button-sm" />
            </div>
        </template>
    </PDialog>
</template>
