<!-- eslint-disable prettier/prettier -->
<script setup lang="ts">
import usdImg from '@/assets/qr/usd.png';
import khrImg from '@/assets/qr/khr.png';
import standImg from '@/assets/qr/'
import { reactive, ref } from 'vue';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { useEventService } from '@/composables/useEventService';
import { QRService, type GenerateQRType } from '@/services/qrcode';
import QRCode from 'qrcode';
import { sleep } from '@/misc';
import { GenerateQRType } from '../../services/qrcode';

const qrStand = ref(standImg);
const evs = useEventService();
type FormData = { 
    accountNumber: string | null;
    mobileNumber: string | null;
    isMerchant: boolean | null;
};

const formData = reactive<FormData>({
    accountNumber: null,
    mobileNumber: null,
    isMerchant: true,
});
const rules = {
    accountNumber: { required },
    isMerchant: { required },
};

const v$ = useVuelidate(rules, formData);

const response = reactive<Partial<GenerateQRType>>({});
const loading = reactive({
    generate: false,
});

const resetData = (data?: GenerateQRType) => {
    response.qr = data?.qr;
    response.transactionCurrency = data?.transactionCurrency;
    response.accountNumber = data?.accountNumber;
    response.merchantName = data?.merchantName;
    response.mobileNumber = data?.mobileNumber;
    response.isMerchant = data?.isMerchant;
};


const handleGenerate = async () => {
    evs.showProgress('Processing ...');
    try {
        await sleep(800);
        // reset data
        resetData();
        const response = await QRService.generate({
            isMerchant: formData.isMerchant,
            accountNumber: formData.accountNumber,
            mobileNumber: formData.mobileNumber,
        });
        // Handle API Gateway timeout, response OK 200
        if (!response) return evs.captureError();
        resetData(response);
        qrStand.value = await createKHQRCanvas();
    } catch (err) {
        evs.captureError(err);
    } finally {
        evs.hideProgress();
    }
};

const handleDownload = async () => {
    const link = document.createElement('a');
    link.download = `${response.merchantName ? response.merchantName.replace(/\s/g, '') : 'JTRB-KHQR'}.png`;
    link.href = qrStand.value;
    link.click();
    link.remove();
};

const createKHQRCanvas = async () => {
    // Create Canvas
    const canvas = document.createElement('canvas');
    const stand = await loadImage(standImg);
    const width = stand.width;
    const height = stand.height;
    canvas.width = width;
    canvas.height = height;

    // Draw QR stand
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    context.drawImage(stand, 0, 0);

    // Generate QR code
    const qrFrame = width * 0.455;
    const qrSize = qrFrame * 0.86;
    const qrcode = await QRCode.toDataURL(String(response.qr), { width: qrSize, margin: 0 });
    const qrImage = await loadImage(qrcode);

    // Draw QR image
    const offsetW = width / 2 - qrSize / 2;
    const offsetH = height * 0.32;
    context.drawImage(qrImage, offsetW, offsetH);

    // Draw currency in the middle of QR
    const ccyWidth = qrSize * 0.2;
    const ccyImage = await loadImage(response.transactionCurrency === 'KHR' ? khrImg : usdImg);
    context.drawImage(
        ccyImage,
        offsetW + qrSize / 2 - ccyWidth / 2,
        offsetH + qrSize / 2 - ccyWidth / 2,
        ccyWidth,
        ccyWidth
    );

    // Register custom font
    const regularFont = new FontFace('NunitoSansRegular', `url(${NunitoSansRegular})`);
    const boldFont = new FontFace('NunitoSansBold', `url(${NunitoSansBold})`);
    const font = await regularFont.load();
    const fontBold = await boldFont.load();
    document.fonts.add(font);
    document.fonts.add(fontBold);

    context.font = `bold ${qrFrame * 0.12}pt NunitoSansBold`;
    context.textAlign = 'center';
    context.textBaseline = 'top';

    // Draw Merchant name
    const name = response.merchantName || '';
    const isLongName = name.length > 15;
    if (isLongName) {
        const splitText = name.split(' ');
        context.fillText(splitText[0].toUpperCase(), width / 2, height * 0.67);
        if (splitText[1]) {
            context.fillText(splitText.slice(1).join(' ').toUpperCase(), width / 2, height * 0.725);
        }
    } else {
        context.fillText(name.toUpperCase(), width / 2, height * 0.67);
    }

    // Draw merchant ID
    context.font = `${qrFrame * 0.06}pt NunitoSansRegular`;
    if (response.accountNumber) {
        const account = response.isMerchant ? `Merchant ID: ${response.accountNumber}` : response.accountNumber;
        context.fillText(account, width / 2, height * (isLongName ? 0.79 : 0.75));
    }

    // Draw mobile phone
    if (response.mobileNumber) {
        context.fillText(response.mobileNumber, width / 2, height * (isLongName ? 0.825 : 0.79));
    }

    const imageData = canvas.toDataURL('image/png');
    // Clean up
    document.fonts.delete(font);
    document.fonts.delete(fontBold);
    canvas.remove();

    return imageData;
};

const loadImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`load ${url} fail`));
        img.src = url;
    });
};

const handleReset = () => {
    formData.accountNumber = null;
    formData.mobileNumber = null;
    formData.isMerchant = true;
    resetData();
    qrStand.value = standImg;
};

</script>
<template>
    <div class="grid">
        <div class="col-12 md:col-6" style="min-width: 382px">
            <div class="card">
                <h5>Generate KHQR</h5>
                <div class="col-12 grid m-0">
                    <div class="col-12 my-5">
                        <form class="p-fluid">
                            <div class="field mb-5">
                                <div class="p-float-label">
                                    <PDropdown
                                        id="isMerchant"
                                        v-model="v$.isMerchant.$model"
                                        :options="[
                                            { label: 'Merchant', value: true },
                                            { label: 'Individual', value: false },
                                        ]"
                                        optionLabel="label"
                                        optionValue="value"
                                        showClear
                                    />
                                    <label for="isMerchant">Generate Type*</label>
                                </div>
                                <span v-if="v$.isMerchant.$silentErrors && v$.isMerchant.$dirty">
                                    <span v-for="(error, index) of v$.isMerchant.$silentErrors" :key="index">
                                        <small class="p-error">{{
                                            String(error.$message).replace('Value', 'Generate Type')
                                        }}</small>
                                    </span>
                                </span>
                            </div>

                            <div class="field mb-5">
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
                            <div class="field mb-5">
                                <div class="p-float-label">
                                    <PInputText type="number" id="phoneNumber" v-model.trim="formData.mobileNumber" />
                                    <label for="phoneNumber">Phone Number</label>
                                </div>
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
                                    label="Download"
                                    @click="handleDownload"
                                    :disabled="!response.qr"
                                />
                                <PButton
                                    class="col mx-2 p-button-outlined"
                                    type="button"
                                    label="Reset"
                                    @click="handleReset"
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 md:col-6">
            <div class="card p-2" style="max-width: 360px">
                <img :src="qrStand" style="width: 100%" />
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>

