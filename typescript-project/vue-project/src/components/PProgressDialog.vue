<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useEmitter } from '@/composables/useEmitter';
import { EVENT_BUS } from '@/constants';

const defaultLabel = 'Loading ...';
const dialogLabel = ref(defaultLabel);
const displayDialog = ref(false);
const emitter = useEmitter();

onMounted(() => {
    emitter.on(EVENT_BUS.SHOW_PROGRESS, (label?: string) => {
        dialogLabel.value = label || defaultLabel;
        displayDialog.value = true;
    });

    emitter.on(EVENT_BUS.HIDE_PROGRESS, () => {
        dialogLabel.value = defaultLabel;
        displayDialog.value = false;
    });
});
</script>

<template>
    <PDialog
        v-model:visible="displayDialog"
        :showHeader="false"
        :closable="false"
        :modal="true"
        :style="{ background: 'none', boxShadow: 'none' }"
        :contentStyle="{ background: 'none', overflow: 'hidden' }"
        contentClass="text-center font-bold text-gray-50" >
        
        <PProgressSpinner
            style="width: 50px; height: 50px"
            strokeWidth="8"
            fill="var(--surface-ground)"
            animationDuration="1s"
        />
        <div>{{ dialogLabel }}</div>
    </PDialog>
</template>
