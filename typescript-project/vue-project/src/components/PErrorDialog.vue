<script setup lang="ts">
import axios, { AxiosError } from 'axios';
import { onMounted, ref } from 'vue';
import { useEmitter } from '@/composables/useEmitter';
import { EVENT_BUS } from '@/constants';

const defaultMessage = 'We cannot process your request at the moment. Please try again later.';
const displayDialog = ref(false);
const dialogTitle = ref('Error Occurred');
const dialogMessage = ref(defaultMessage);
const emitter = useEmitter();

onMounted(() => {
    emitter.on(EVENT_BUS.ERROR_CAPTURE, (error?: unknown) => {
        if (!axios.isCancel(error)) {
            displayDialog.value = true;
            dialogMessage.value = defaultMessage;
            if (typeof error === 'string') {
                dialogMessage.value = error;
            } else if (error instanceof AxiosError) {
                if (error.response && error.response.data) {
                    const errorData = error.response.data;
                    if (errorData.message) {
                        dialogMessage.value = errorData.message;
                    } else if (errorData.errorMessage) {
                        dialogMessage.value = errorData.errorMessage;
                    }
                } else {
                    dialogMessage.value = error.message;
                }
            } else if (error instanceof Error) {
                dialogMessage.value = error.message;
            }
        }
    });
});

function close() {
    displayDialog.value = false;
    dialogMessage.value = defaultMessage;
}
</script>

<template>
    <PDialog
        v-model:visible="displayDialog"
        :showHeader="false"
        :closable="false"
        :modal="true"
        :breakpoints="{ '960px': '75vw' }"
        :style="{ width: '30vw' }"
    >
        <h5 class="pt-4" :style="{ color: 'var(--red-500)' }">
            {{ dialogTitle }}
        </h5>
        <p class="line-height-3 m-0">{{ dialogMessage }}</p>
        <template #footer>
            <div class="flex justify-content-center">
                <PButton label="OK" @click="close" class="p-button-sm p-button-danger p-button-outlined px-5" />
            </div>
        </template>
    </PDialog>
</template>
