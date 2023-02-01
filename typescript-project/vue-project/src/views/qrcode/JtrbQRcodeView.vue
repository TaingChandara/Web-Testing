<script setup lang="ts">
import { reactive, ref } from 'vue';
import JtrbKhqr from './JtrbKhqr.vue';
import { toPng } from 'html-to-image';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';


type FormData = {
    accountNumber: string | null;
};
const formData = reactive<FormData>({
    accountNumber: null,
});
const rules = {
    accountNumber: { required },
};
const v$ = useVuelidate(rules, formData);

type ResponseType = {
    qr?: string;
    ccy?: 'USD' | 'KHR';
    cname?: string;
};
const response = reactive<ResponseType>({});
const loading = reactive({
    generate: false,
});
const dialog = reactive({
    preview: false,
});
const jtrbQrCode = ref<typeof JtrbKhqr | null>(null);

const resetData = (data: ResponseType) => {
    const { ccy, cname, qr } = data;
    response.ccy = ccy;
    response.cname = cname;
    response.qr = qr;
};

const handleGenerate = () => {
    // invoke backend api to get QRcode
    resetData({
        ccy: 'KHR',
        cname: 'Ishin Vin',
        qr: formData.accountNumber as string,
    });
};

const handleDownload = async () => {
    if (jtrbQrCode.value) {
        const dataUrl = await toPng(jtrbQrCode.value.jtrbKhqrRef);
        const link = document.createElement('a');
        link.download = `${response.cname ? response.cname.replace(/\s/g, '') : 'JTRB-KHQR'}.png`;
        link.href = dataUrl;
        link.click();
    }
};

const handlePrint = async () => {
    if (jtrbQrCode.value) {
        const dataUrl = await toPng(jtrbQrCode.value.jtrbKhqrRef);
        const strHtml = `<html><body><div><img style="display:block;margin:0 auto;width:986px" src="${dataUrl}" /></div></body></html>`;
        const printWindow = window.open(
            '',
            'PrintWindow',
            'width=1024,height=800,toolbars=no,scrollbars=yes,status=no,resizable=yes'
        );
        printWindow?.document.writeln(strHtml);
        printWindow?.document.close();
        printWindow?.print();
    }
};

</script>
<template>
    <div class="grid">
        <div class="col-12" style="max-width: 418px">
            <div class="card">
                <h5>Generate KHQR</h5>
                <div class="mt-6" style="max-width: 360px">
                    <form class="p-fluid">
                        <div class="field">
                            <div class="p-float-label" :class="{ 'p-input-icon-right': loading.generate }">
                                <i v-if="loading.generate" class="pi pi-spin pi-spinner"></i>
                                <PInputText
                                    id="accountNumber"
                                    v-model="v$.accountNumber.$model"
                                    :format="false"
                                    :class="{ 'p-invalid': v$.accountNumber.$invalid && v$.accountNumber.$dirty }"
                                    :disabled="loading.generate"
                                />
                                <label for="accountNumber">Account Number*</label>
                            </div>
                            <span v-if="v$.accountNumber.$silentErrors && v$.accountNumber.$dirty">
                                <span v-for="(error, index) of v$.accountNumber.$silentErrors" :key="index">
                                    <small class="p-error">{{
                                        String(error.$message).replace('Value', 'Account Number')
                                    }}</small>
                                </span>
                            </span>
                        </div>
                        <div class="grid">
                            <PButton
                                class="col mx-2"
                                type="button"
                                label="Generate"
                                @click="handleGenerate"
                                :disabled="v$.$invalid"
                            />
                            <PButton
                                class="col mx-2"
                                type="button"
                                label="Preview"
                                @click="dialog.preview = true"
                                :disabled="!response.qr"
                            />
                        </div>
                    </form>
                </div>

                <div class="card mt-5 overflow-x-auto" style="padding: 5px; max-width: 360px">
                    <JtrbKhqr :qr="response.qr" :ccy="response.ccy" :cname="response.cname" small />
                </div>
            </div>
        </div>
    </div>

    <PDialog v-model:visible="dialog.preview" :showHeader="false" :closable="false" :modal="true">
        <div class="card my-5">
            <JtrbKhqr :qr="response.qr" :ccy="response.ccy" :cname="response.cname" ref="jtrbQrCode" />
        </div>
        <template #footer>
            <div class="flex justify-content-between mt-5">
                <PButton label="Back" @click="dialog.preview = false" class="p-button-sm p-button-outlined" />
                <div class="grid">
                    <PButton label="Download" @click="handleDownload" class="p-button-sm" />
                    <PButton label="Print" @click="handlePrint" class="p-button-sm px-5" />
                </div>
            </div>
        </template>
    </PDialog>
</template>
