<script setup lang="ts">
import { useEventService } from '@/composables/useEventService';
import { AuthService } from '@/service/auth';


defineProps<{
    appName: string;
}>();

const evs = useEventService();
const signIn = () => {
    try{
        AuthService.lo
    }
};
</script>
<template>
    <div class="surface-0 flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="h-fit w-fit p-8" style="background-color: var(--primary-50); border-radius: 12px">
            <div class="text-center mb-5">
                <img src="@/assets/svg/logo.svg" alt="Logo" height="50" class="mb-3" />
                <div class="text-900 text-3xl font-medium mb-8 text-primary">Welcome To {{ appName }}</div>
                <span class="text-600 font-medium"> Sign in to continue </span>
            </div>
            <div class="text-center">
                <PButton label="Sign In" class="text-xl p-button-outlined" @click="signIn" />
            </div>
        </div>
    </div>
</template>