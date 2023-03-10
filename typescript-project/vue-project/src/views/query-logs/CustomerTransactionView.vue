<<<<<<< HEAD
<script setup lang="ts">
import { useEventService } from '@/composables/useEventService';
import { onMounted, reactive, ref } from 'vue';
import { format } from 'date-fns';
import { DATETIME_FORMAT } from '@/constants';
import { QueryLogService, type CustomerTransactionLogType } from '@/services/query-log';

type FilterParams = {
    trxnId: string | null;
    trxnTime: (string | Date | null)[];
    referenceId: string | null;
    customerId: string | null;
    transferType: string | null;
    trxnStatus: string | null;
    limit: number | null;
};

const evs = useEventService();
const currentDate = new Date();
const filters = reactive<FilterParams>({
    trxnId: null,
    trxnTime: [currentDate],
    referenceId: null,
    customerId: null,
    transferType: null,
    trxnStatus: null,
    limit: null,
});
const loading = ref(false);
const logData = ref<CustomerTransactionLogType[]>([]);
const trxnStatusOptions = ref(['PENDING', 'VERIFIED', 'REFUNDED']);
const transferTypeOptions = ref(['CASA_OUTWARD', 'CASA_INWARD', 'WALLET_OUTWARD', 'WALLET_INWARD', 'QR_INWARD']);

const search = async () => {
    try {
        loading.value = true;
        const { trxnTime, ...params } = filters;
        const trxnStartDate = trxnTime && trxnTime[0] ? new Date(trxnTime[0]).toISOString() : null;
        const trxnEndDate = trxnTime && trxnTime[1] ? new Date(trxnTime[1]).toISOString() : null;
        logData.value = await QueryLogService.getCustomerTransactionLog({
            ...params,
            trxnStartDate,
            trxnEndDate,
        });
    } catch (err) {
        evs.captureError(err);
    } finally {
        loading.value = false;
    }
};

const handleSearch = async () => {
    await search();
};

const handleReset = () => {
    filters.trxnTime = [];
    filters.trxnId = null;
    filters.referenceId = null;
    filters.customerId = null;
    filters.transferType = null;
    filters.trxnStatus = null;
    filters.limit = null;
};

onMounted(async () => {
    await search();
});

// Detail View
const dialog = reactive({
    view: false,
});
const viewItem = ref<CustomerTransactionLogType>();
const handleDetail = (transaction: CustomerTransactionLogType) => {
    viewItem.value = transaction;
    dialog.view = true;
};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>Customer Transaction Log</h5>
                <!-- START: Filter Form -->
                <form class="mt-5 grid">
                    <div class="field col-12 md:col-3 lg:col-2">
                        <div>
                            <PCalendar
                                id="trxnTime"
                                v-model="filters.trxnTime"
                                selectionMode="range"
                                class="w-full"
                                showButtonBar
                                placeholder="Transaction Time"
                                showIcon
                            />
                        </div>
                    </div>
                    <div class="field col-12 md:col-3 lg:col-2">
                        <div class="p-float-label">
                            <PInputText id="trxnId" v-model.trim="filters.trxnId" class="w-full" />
                            <label for="trxnId">Transaction ID</label>
                        </div>
                    </div>
                    <div class="field col-12 md:col-3 lg:col-2">
                        <div class="p-float-label">
                            <PDropdown
                                id="transferType"
                                class="w-full"
                                v-model="filters.transferType"
                                :options="transferTypeOptions"
                                :virtualScrollerOptions="{ itemSize: 44 }"
                                showClear
                                editable
                            />
                            <label for="transferType">Transfer Type</label>
                        </div>
                    </div>
                    <div class="field col-12 md:col-3 lg:col-2">
                        <div class="p-float-label">
                            <PDropdown
                                id="trxnStatus"
                                class="w-full"
                                v-model="filters.trxnStatus"
                                :options="trxnStatusOptions"
                                showClear
                                editable
                            />
                            <label for="trxnStatus">Status</label>
                        </div>
                    </div>
                    <div class="field col-12 md:col-3 lg:col-2">
                        <div class="p-float-label">
                            <PInputText id="customerId" v-model.trim="filters.customerId" class="w-full" />
                            <label for="customerId">Customer ID</label>
                        </div>
                    </div>
                    <div class="field col-12 md:col-3 lg:col-2">
                        <div class="p-float-label">
                            <PInputText id="referenceId" v-model.trim="filters.referenceId" class="w-full" />
                            <label for="referenceId">Reference ID</label>
                        </div>
                    </div>
                    <div class="field col-12 md:col-3 lg:col-2">
                        <div class="p-float-label">
                            <PInputNumber
                                id="limit"
                                v-model.number="filters.limit"
                                :useGrouping="false"
                                class="w-full"
                                inputClass="w-full"
                            />
                            <label for="limit">Limit</label>
                        </div>
                    </div>
                    <div class="field col-12 md:col-4">
                        <PButton label="Search" @click="handleSearch" :loading="loading" /> &nbsp;
                        <PButton class="p-button-outlined" label="Clear" @click="handleReset" />
                    </div>
                </form>
                <!-- END: Filter Form -->

                <PDataTable
                    :value="logData"
                    :paginator="true"
                    :rows="10"
                    :loading="loading"
                    responsiveLayout="scroll"
                    :rowsPerPageOptions="[10, 20, 50]"
                    paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                >
                    <PColumn field="CustomerId" header="Customer ID" />
                    <PColumn field="TransactionId" header="Transaction ID" />
                    <PColumn field="TransactionTime" header="Transaction Time" :sortable="true">
                        <template #body="slotProps">
                            {{
                                slotProps.data.TransactionTime
                                    ? format(new Date(slotProps.data.TransactionTime), DATETIME_FORMAT)
                                    : ''
                            }}
                        </template>
                    </PColumn>
                    <PColumn field="ReferenceId" header="Reference ID" />
                    <PColumn field="TransferType" header="Transfer Type" :sortable="true" />
                    <PColumn field="TransactionStatus" header="Transaction Status" :sortable="true" />

                    <PColumn header="Actions">
                        <template #body="slotProps">
                            <PButton class="p-button-text" label="Detail" @click="handleDetail(slotProps.data)" />
                        </template>
                    </PColumn>
                </PDataTable>
            </div>
        </div>
    </div>

    <PDialog
        v-model:visible="dialog.view"
        :showHeader="false"
        :closable="false"
        :modal="true"
        :style="{ width: '480px' }"
    >
        <h5 class="py-4">View Details</h5>
        <template v-for="(value, key) in viewItem" :key="key">
            <template v-if="typeof value === 'object'">
                <PAccordion :multiple="true">
                    <PAccordionTab :header="key">
                        <div v-for="(v, k) in value" :key="k" class="flex justify-content-between my-3">
                            <div class="font-bold text-sm text-gray-300">{{ k }} :</div>
                            <div class="font-bold text-sm">{{ v }}</div>
                        </div>
                    </PAccordionTab>
                </PAccordion>
            </template>
            <template v-else>
                <div class="flex justify-content-between my-3">
                    <div class="font-bold text-sm text-gray-300">{{ key }} :</div>
                    <div class="font-bold text-sm">{{ value }}</div>
                </div>
            </template>
        </template>
        <template #footer>
            <div class="text-center">
                <PButton label="Close" @click="dialog.view = false" class="p-button-sm p-button-outlined" />
            </div>
        </template>
    </PDialog>
</template>
=======
<script setup lang="ts">
import { useEventService } from '@/composables/useEventService';
import { onMounted, reactive, ref } from 'vue';
import { format } from 'date-fns';
import { DATETIME_FORMAT } from '@/constants';
import { QueryLogService, type CustomerTransactionLogType } from '@/services/query-log';

type FilterParams = {
    trxnId: string | null;
    trxnTime: (string | Date | null)[];
    referenceId: string | null;
    customerId: string | null;
    transferType: string | null;
    trxnStatus: string | null;
    limit: number | null;
};

const evs = useEventService();
const currentDate = new Date();
const filters = reactive<FilterParams>({
    trxnId: null,
    trxnTime: [currentDate],
    referenceId: null,
    customerId: null,
    transferType: null,
    trxnStatus: null,
    limit: null,
});
const loading = ref(false);
const logData = ref<CustomerTransactionLogType[]>([]);
const trxnStatusOptions = ref(['PENDING', 'VERIFIED', 'REFUNDED']);
const transferTypeOptions = ref(['CASA_OUTWARD', 'CASA_INWARD', 'WALLET_OUTWARD', 'WALLET_INWARD', 'QR_INWARD']);

const search = async () => {
    try {
        loading.value = true;
        const { trxnTime, ...params } = filters;
        const trxnStartDate = trxnTime && trxnTime[0] ? new Date(trxnTime[0]).toISOString() : null;
        const trxnEndDate = trxnTime && trxnTime[1] ? new Date(trxnTime[1]).toISOString() : null;
        logData.value = await QueryLogService.getCustomerTransactionLog({
            ...params,
            trxnStartDate,
            trxnEndDate,
        });
    } catch (err) {
        evs.captureError(err);
    } finally {
        loading.value = false;
    }
};

const handleSearch = async () => {
    await search();
};

const handleReset = () => {
    filters.trxnTime = [];
    filters.trxnId = null;
    filters.referenceId = null;
    filters.customerId = null;
    filters.transferType = null;
    filters.trxnStatus = null;
    filters.limit = null;
};

onMounted(async () => {
    await search();
});

// Detail View
const dialog = reactive({
    view: false,
});
const viewItem = ref<CustomerTransactionLogType>();
const handleDetail = (transaction: CustomerTransactionLogType) => {
    viewItem.value = transaction;
    dialog.view = true;
};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>Customer Transaction Log</h5>
                <!-- START: Filter Form -->
                <form class="mt-5 grid">
                    <div class="field col-12 md:col-3 lg:col-2">
                        <div>
                            <PCalendar
                                id="trxnTime"
                                v-model="filters.trxnTime"
                                selectionMode="range"
                                class="w-full"
                                showButtonBar
                                placeholder="Transaction Time"
                                showIcon
                            />
                        </div>
                    </div>
                    <div class="field col-12 md:col-3 lg:col-2">
                        <div class="p-float-label">
                            <PInputText id="trxnId" v-model.trim="filters.trxnId" class="w-full" />
                            <label for="trxnId">Transaction ID</label>
                        </div>
                    </div>
                    <div class="field col-12 md:col-3 lg:col-2">
                        <div class="p-float-label">
                            <PDropdown
                                id="transferType"
                                class="w-full"
                                v-model="filters.transferType"
                                :options="transferTypeOptions"
                                :virtualScrollerOptions="{ itemSize: 44 }"
                                showClear
                                editable
                            />
                            <label for="transferType">Transfer Type</label>
                        </div>
                    </div>
                    <div class="field col-12 md:col-3 lg:col-2">
                        <div class="p-float-label">
                            <PDropdown
                                id="trxnStatus"
                                class="w-full"
                                v-model="filters.trxnStatus"
                                :options="trxnStatusOptions"
                                showClear
                                editable
                            />
                            <label for="trxnStatus">Status</label>
                        </div>
                    </div>
                    <div class="field col-12 md:col-3 lg:col-2">
                        <div class="p-float-label">
                            <PInputText id="customerId" v-model.trim="filters.customerId" class="w-full" />
                            <label for="customerId">Customer ID</label>
                        </div>
                    </div>
                    <div class="field col-12 md:col-3 lg:col-2">
                        <div class="p-float-label">
                            <PInputText id="referenceId" v-model.trim="filters.referenceId" class="w-full" />
                            <label for="referenceId">Reference ID</label>
                        </div>
                    </div>
                    <div class="field col-12 md:col-3 lg:col-2">
                        <div class="p-float-label">
                            <PInputNumber
                                id="limit"
                                v-model.number="filters.limit"
                                :useGrouping="false"
                                class="w-full"
                                inputClass="w-full"
                            />
                            <label for="limit">Limit</label>
                        </div>
                    </div>
                    <div class="field col-12 md:col-4">
                        <PButton label="Search" @click="handleSearch" :loading="loading" /> &nbsp;
                        <PButton class="p-button-outlined" label="Clear" @click="handleReset" />
                    </div>
                </form>
                <!-- END: Filter Form -->

                <PDataTable
                    :value="logData"
                    :paginator="true"
                    :rows="10"
                    :loading="loading"
                    responsiveLayout="scroll"
                    :rowsPerPageOptions="[10, 20, 50]"
                    paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                >
                    <PColumn field="CustomerId" header="Customer ID" />
                    <PColumn field="TransactionId" header="Transaction ID" />
                    <PColumn field="TransactionTime" header="Transaction Time" :sortable="true">
                        <template #body="slotProps">
                            {{
                                slotProps.data.TransactionTime
                                    ? format(new Date(slotProps.data.TransactionTime), DATETIME_FORMAT)
                                    : ''
                            }}
                        </template>
                    </PColumn>
                    <PColumn field="ReferenceId" header="Reference ID" />
                    <PColumn field="TransferType" header="Transfer Type" :sortable="true" />
                    <PColumn field="TransactionStatus" header="Transaction Status" :sortable="true" />

                    <PColumn header="Actions">
                        <template #body="slotProps">
                            <PButton class="p-button-text" label="Detail" @click="handleDetail(slotProps.data)" />
                        </template>
                    </PColumn>
                </PDataTable>
            </div>
        </div>
    </div>

    <PDialog
        v-model:visible="dialog.view"
        :showHeader="false"
        :closable="false"
        :modal="true"
        :style="{ width: '480px' }"
    >
        <h5 class="py-4">View Details</h5>
        <template v-for="(value, key) in viewItem" :key="key">
            <template v-if="typeof value === 'object'">
                <PAccordion :multiple="true">
                    <PAccordionTab :header="key">
                        <div v-for="(v, k) in value" :key="k" class="flex justify-content-between my-3">
                            <div class="font-bold text-sm text-gray-300">{{ k }} :</div>
                            <div class="font-bold text-sm">{{ v }}</div>
                        </div>
                    </PAccordionTab>
                </PAccordion>
            </template>
            <template v-else>
                <div class="flex justify-content-between my-3">
                    <div class="font-bold text-sm text-gray-300">{{ key }} :</div>
                    <div class="font-bold text-sm">{{ value }}</div>
                </div>
            </template>
        </template>
        <template #footer>
            <div class="text-center">
                <PButton label="Close" @click="dialog.view = false" class="p-button-sm p-button-outlined" />
            </div>
        </template>
    </PDialog>
</template>
>>>>>>> 4c8ddcf40adf8d0adbd4681fa6a0eff17100e457
