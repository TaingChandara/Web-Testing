<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { RouterLink, useRouter } from 'vue-router';
const emit = defineEmits(['menu-toggle']);
function onMenuToggle(event: MouseEvent) {
    emit('menu-toggle', event);
}

defineProps<{
    appName: string;
}>();

const authStore = useAuthStore();
const { authInfo } = storeToRefs(authStore);
const { logout } = authStore;
const router = useRouter();

const signOut = () => {
    logout();
    router.push('/');
};
</script>

<template>
    <div class="layout-topbar">
        <RouterLink to="/" class="layout-topbar-logo">
            <img alt="Logo" src="@/assets/svg/logo.svg" />
            <span>{{ appName }}</span>
        </RouterLink>
        <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle">
            <i class="pi pi-bars"></i>
        </button>

        <span class="layout-topbar-greeting">Hi, {{ authInfo?.username }}</span>
        <button
            class="p-link layout-topbar-menu-button layout-topbar-button"
            v-styleclass="{
                selector: '@next',
                enterClass: 'hidden',
                enterActiveClass: 'scalein',
                leaveToClass: 'hidden',
                leaveActiveClass: 'fadeout',
                hideOnOutsideClick: true,
            }"
        >
            <img alt="Profile" src="@/assets/svg/avatar.svg" />
        </button>
        <ul class="layout-topbar-menu hidden origin-top">
            <li>
                <button class="p-link layout-topbar-button">
                    <i class="pi pi-user"></i>
                    <span>Profile</span>
                </button>
            </li>
            <li>
                <button class="p-link layout-topbar-button" @click="signOut">
                    <i class="pi pi-sign-out"></i>
                    <span>Sign out</span>
                </button>
            </li>
        </ul>
    </div>
</template>
