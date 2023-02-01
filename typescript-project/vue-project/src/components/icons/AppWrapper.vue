<script setup lang="ts">
import { ref, computed } from 'vue';
import { RouterView } from 'vue-router';
import AppTopBar from './AppTopBar.vue';
import AppMenu from './AppMenu.vue';

import type { MenuItem } from 'primevue/menuitem';
import AppFooter from './AppFooter.vue';

type MenuEventProps = {
    item?: MenuItem;
    originalEvent: UIEvent;
};

defineProps<{
    appName: string;
    menu: MenuItem[];
}>();

const menuClick = ref(false);
const staticMenuInactive = ref(false);
const mobileMenuActive = ref(false);
const containerClass = computed(() => {
    return [
        'layout-wrapper',
        'layout-static',
        {
            'layout-static-sidebar-inactive': staticMenuInactive.value,
            'layout-mobile-sidebar-active': mobileMenuActive.value,
        },
    ];
});

function isDesktop() {
    return window.innerWidth >= 992;
}

function onWrapperClick() {
    if (!menuClick.value) mobileMenuActive.value = false;
    menuClick.value = false;
}

function onSidebarClick() {
    menuClick.value = true;
}

function onMenuToggle(event: UIEvent) {
    menuClick.value = true;
    if (isDesktop()) staticMenuInactive.value = !staticMenuInactive.value;
    else mobileMenuActive.value = !mobileMenuActive.value;
    event.preventDefault();
}

function onMenuItemClick(event: MenuEventProps) {
    if (event.item && !event.item.items) {
        mobileMenuActive.value = false;
    }
}
</script>

<template>
    <div :class="containerClass" @click="onWrapperClick">
        <AppTopBar :app-name="appName" @menu-toggle="onMenuToggle" />
        <div class="layout-sidebar" @click="onSidebarClick">
            <div class="layout-menu-container">
                <AppMenu :items="menu" class="layout-menu" :root="true" @menuitem-click="onMenuItemClick" />
            </div>
        </div>

        <div class="layout-main-container">
            <div class="layout-main">
                <RouterView />
            </div>
            <AppFooter />
        </div>

        <transition name="layout-mask">
            <div class="layout-mask p-component-overlay" v-if="mobileMenuActive"></div>
        </transition>
    </div>
</template>
