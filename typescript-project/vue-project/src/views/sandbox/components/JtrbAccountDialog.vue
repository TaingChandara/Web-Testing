<script setup lang="ts">
import { getAllCCY, TEST_KHR_ACCOUNT, TEST_USD_ACCOUNT, type TestAccountProp } from '@/constants';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { computed, reactive, ref, watch } from 'vue';

const ccyOptions = ref(getAllCCY());
const emit = defineEmits(['update:visible', 'change']);
const props = defineProps<{
    data: TestAccountProp;
    visible: boolean;
    scope: string;
    validationKey: string;
}>();
const isOpen = computed({
    get: () => props.visible,
    set: (value) => emit('update:visible', value),
});
const formData = reactive<TestAccountProp>({
    jtrbAccount: props.data.jtrbAccount,
    customerId: props.data.customerId,
    customerName: props.data.customerName,
    currency: props.data.currency,
});
const rules = {
    jtrbAccount: { required },
    customerId: { required },
    customerName: { required },
    currency: { required },
};
const v$ = useVuelidate(rules, formData, { $scope: props.scope, $registerAs: props.validationKey });
const resetAccount = (data: TestAccountProp) => {
    formData.jtrbAccount = data.jtrbAccount;
    formData.customerId = data.customerId;
    formData.customerName = data.customerName;
    formData.currency = data.currency;
};
const resetUSDAccount = () => resetAccount(TEST_USD_ACCOUNT);
const resetKHRAccount = () => resetAccount(TEST_KHR_ACCOUNT);
const changeAccount = () => emit('change', formData);
watch(
    () => props.visible,
    () => resetAccount(props.data)
);
</script>

<template>
    <PDialog v-model:visible="isOpen" :showHeader="false" :closable="false" :modal="true" :style="{ width: '480px' }">
        <h5 class="py-4">Change JTRB Account</h5>
        <div class="p-fluid">
            <div class="field mt-5">
                <div class="p-float-label">
                    <PInputText
                        id="jtrbAccount"
                        v-model="v$.jtrbAccount.$model"
                        :format="false"
                        :class="{ 'p-invalid': v$.jtrbAccount.$invalid && v$.jtrbAccount.$dirty }"
                    />
                    <label for="jtrbAccount">JTRB Account*</label>
                </div>
                <span v-if="v$.jtrbAccount.$silentErrors && v$.jtrbAccount.$dirty">
                    <span v-for="(error, index) of v$.jtrbAccount.$silentErrors" :key="index">
                        <small class="p-error">{{ String(error.$message).replace('Value', 'JTRB Account') }}</small>
                    </span>
                </span>
            </div>
            <div class="field mt-5">
                <div class="p-float-label">
                    <PInputText
                        id="customerId"
                        v-model="v$.customerId.$model"
                        :format="false"
                        :class="{ 'p-invalid': v$.customerId.$invalid && v$.customerId.$dirty }"
                    />
                    <label for="customerId">Customer ID*</label>
                </div>
                <span v-if="v$.customerId.$silentErrors && v$.customerId.$dirty">
                    <span v-for="(error, index) of v$.customerId.$silentErrors" :key="index">
                        <small class="p-error">{{ String(error.$message).replace('Value', 'Customer ID') }}</small>
                    </span>
                </span>
            </div>
            <div class="field mt-5">
                <div class="p-float-label">
                    <PInputText
                        id="customerName"
                        v-model="v$.customerName.$model"
                        :format="false"
                        :class="{ 'p-invalid': v$.customerName.$invalid && v$.customerName.$dirty }"
                    />
                    <label for="customerName">Customer Name*</label>
                </div>
                <span v-if="v$.customerName.$silentErrors && v$.customerName.$dirty">
                    <span v-for="(error, index) of v$.customerName.$silentErrors" :key="index">
                        <small class="p-error">{{ String(error.$message).replace('Value', 'Customer Name') }}</small>
                    </span>
                </span>
            </div>
            <div class="field mt-5">
                <div class="p-float-label">
                    <PDropdown
                        id="currency"
                        v-model="v$.currency.$model"
                        :options="ccyOptions"
                        :class="{ 'p-invalid': v$.currency.$invalid && v$.currency.$dirty }"
                        :showClear="true"
                    />
                    <label for="currency">Currency*</label>
                </div>
                <span v-if="v$.currency.$silentErrors && v$.currency.$dirty">
                    <span v-for="(error, index) of v$.currency.$silentErrors" :key="index">
                        <small class="p-error">{{ String(error.$message).replace('Value', 'Currency') }}</small>
                    </span>
                </span>
            </div>
        </div>

        <template #footer>
            <div class="flex justify-content-between">
                <PButton label="Cancel" @click="isOpen = false" class="p-button-sm p-button-danger p-button-outlined" />
                <div>
                    <PButton label="USD" @click="resetUSDAccount" class="p-button-sm p-button-outlined" />
                    <PButton label="KHR" @click="resetKHRAccount" class="p-button-sm p-button-outlined" />
                </div>
                <PButton label="OK" @click="changeAccount" class="p-button-sm px-5" :disabled="v$.$invalid" />
            </div>
        </template>
    </PDialog>
</template>
