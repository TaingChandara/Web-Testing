<script setup lang="ts">
import { useEventService } from '@/composables/useEventService';
import { onMounted, reactive, ref } from 'vue';
import { format } from 'date-fns';
import { DATETIME_FORMAT } from '@/constants';
import { QueryLogService, type ProcessLogType } from '@/services/query-log';

type FilterParams = {
    logTime: (string | Date | null)[];
    logType: string | null;
    logStatus: string | null;
    errorCode: string | null;
    logId: string | null;
    limit: number | null;
    trxnId: string | null;
};

const evs = useEventService();
const currentDate = new Date();
const filters = reactive<FilterParams>({
    logTime: [currentDate],
    logType: null,
    logStatus: null,
    errorCode: null,
    logId: null,
    limit: null,
    trxnId: null,
});
const loading = ref(false);
const logData = ref<ProcessLogType[]>([]);
const logTypesOptions = ref([
    'INITIATE_CASA',
    'INITIATE_WALLET',
    'TRANSFER_CASA',
    'TRANSFER_WALLET',
    'VERIFY_TRANSACTION_AMOUNT',
    'INWARD_BATCH_PROCESSING',
    'INITIATE_CASA_INWARD',
    'TRANSFER_CASA_INWARD',
    'BAKONG_ACK',
    'BAKONG_REFUND',
    'UPDATE_BANK_LIST',
    'UPDATE_BANK_TYPE',
    'VERIFY_TRANSACTION',
]);
const logStatusOptions = ref(['SUCCESS', 'ERROR']);
const errorCodeOptions = ref([
    'BAKONG_ERROR',
    'BAKONG_FAIL',
    'BANK_OFFLINE',
    'CB_ERROR',
    'CB_FAIL',
    'DAILY_LIMIT',
    'INTERNAL_ERROR',
    'INVALID_ACCOUNT',
    'INVALID_DETAIL',
    'INVALID_HASH',
    'INVALID_ID',
    'INVALID_KHQR',
    'INVALID_OPERATION',
    'INVALID_PARAM',
    'INVALID_PARTICIPANT_CODE',
    'INVALID_PHONE',
    'INVALID_WALLET',
    'JTRB_BALANCE_ERROR',
    'MAINTENANCE',
    'TRANS_LIMIT',
]);

const search = async () => {
    try {
        loading.value = true;
        const { logTime, ...params } = filters;
        const startDate = logTime && logTime[0] ? new Date(logTime[0]).toISOString() : null;
        const endDate = logTime && logTime[1] ? new Date(logTime[1]).toISOString() : null;
        logData.value = await QueryLogService.getProcessLog({
            ...params,
            startDate,
            endDate,
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
    filters.logTime = [];
    filters.errorCode = null;
    filters.limit = null;
    filters.logId = null;
    filters.logStatus = null;
    filters.logType = null;
    filters.trxnId = null;
};

onMounted(async () => {
    await search();
});
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>Process Log</h5>
                <!-- START: Filter Form -->
                <form class="mt-5 grid">
                    <div class="field col-12 md:col-3 lg:col-2">
                        <div>
                            <PCalendar
                                id="logTime"
                                v-model="filters.logTime"
                                selectionMode="range"
                                class="w-full"
                                showButtonBar
                                placeholder="Log Time"
                                showIcon
                            />
                        </div>
                    </div>
                    <div class="field col-12 md:col-3 lg:col-2">
                        <div class="p-float-label">
                            <PDropdown
                                id="logType"
                                class="w-full"
                                v-model="filters.logType"
                                :options="logTypesOptions"
                                :virtualScrollerOptions="{ itemSize: 44 }"
                                showClear
                                editable
                            />
                            <label for="logType">Type</label>
                        </div>
                    </div>
                    <div class="field col-12 md:col-3 lg:col-2">
                        <div class="p-float-label">
                            <PDropdown
                                id="logStatus"
                                class="w-full"
                                v-model="filters.logStatus"
                                :options="logStatusOptions"
                                showClear
                                editable
                            />
                            <label for="logStatus">Status</label>
                        </div>
                    </div>
                    <div class="field col-12 md:col-3 lg:col-2">
                        <div class="p-float-label">
                            <PDropdown
                                id="errorCode"
                                class="w-full"
                                v-model="filters.errorCode"
                                :options="errorCodeOptions"
                                :virtualScrollerOptions="{ itemSize: 44 }"
                                showClear
                                editable
                            />
                            <label for="errorCode">Error Code</label>
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
                            <PInputText id="logId" v-model.trim="filters.logId" class="w-full" />
                            <label for="logId">Log ID</label>
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
                    <PColumn field="LogId" header="ID">
                        <template #body="slotProps">
                            <span :class="{ 'text-red-500': slotProps.data.LogStatus === 'ERROR' }">
                                {{ slotProps.data.LogId }}
                            </span>
                        </template>
                    </PColumn>
                    <PColumn field="LogTime" header="Log Time" :sortable="true">
                        <template #body="slotProps">
                            {{
                                slotProps.data.LogTime ? format(new Date(slotProps.data.LogTime), DATETIME_FORMAT) : ''
                            }}
                        </template>
                    </PColumn>
                    <PColumn field="TransactionId" header="Transaction ID" />
                    <PColumn field="LogType" header="Type" :sortable="true" />
                    <PColumn field="LogStatus" header="Status" :sortable="true">
                        <template #body="slotProps">
                            <span :class="{ 'text-red-500': slotProps.data.LogStatus === 'ERROR' }">
                                {{ slotProps.data.LogStatus }}
                            </span>
                        </template>
                    </PColumn>
                    <PColumn field="ErrorCode" header="Error Code" :sortable="true" />
                    <PColumn field="ErrorMessage" header="Error Message" />
                </PDataTable>
            </div>
        </div>
    </div>
</template>