<script setup lang="ts">
import usdImg from '@/assets/qr/usd.png';
import khrImg from '@/assets/qr/khr.png';
import { VQrcode } from 'qrcode-vuejs';
import { computed, ref } from 'vue';



const props = deifneProps<{
    qr?: string;
    ccy?: 'KRH' | 'USD';
    cname?: string;
    small?: boolean;
}>();

const ccyImg = computed(()=>{
    return props.ccy === 'KRH' ? khrImg: usdImg;
});

const jtrbKhqrRef = ref<HTMLDivElement | null>(null);
defineExpose({
    jtrbKhqrRef,
});
</script>

<template>
    <div
        ref="jtrbKhqrRef"
        :style="{ width: small ? '350px' : '700px', height: small ? '493px' : '986px' }"
        style="margin: 0; padding: 0"
    >
        <div style="position: relative; width: 100%; height: 100%; margin: 0; padding: 0">
            <img src="@/assets/qr/qr-stand-sample.png" alt="JTRB_BANK" style="width: 100%; height: 100%" />
            <v-qrcode
                class="jtrb-qrcode"
                :text="qr ?? ''"
                :size="small ? 200 : 400"
                :style="{ width: small ? '136.5px' : '273px' }"
            />
            <div class="jtrb-khqr-label" :style="{ width: small ? '300px' : '600px' }">
                <label :style="{ fontSize: small ? '14px' : '28px' }">{{ cname }}</label>
            </div>
            <div v-if="ccy" :style="{ width: small ? '32px' : '64px' }" style="position: absolute; top: 43%; left: 45%">
                <img :src="ccyImg" alt="currency" style="width: 100%" />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.jtrb-qrcode {
    top: 32%;
    left: 30.5%;
    position: absolute;

    :deep(canvas) {
        width: 100%;
    }
}

.jtrb-khqr-label {
    position: absolute;
    top: 68%;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    font-weight: bold;
    text-transform: uppercase;
    color: black;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
}
</style>
