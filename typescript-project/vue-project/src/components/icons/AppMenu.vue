<script setup lang="ts">
import type { MenuItem } from 'primevue/menuitem';
import { ref } from 'vue';

type MenuItemProps = Omit<MenuItem, 'key'>;

withDefaults(
    defineProps<{
        items?: MenuItemProps[];
        root?: boolean;
    }>(),
    { root: false }
);

const activeIndex = ref<Number | null>(null);

const emit = defineEmits(['menuitem-click']);

function onMenuItemClick(event: MouseEvent, item: MenuItemProps, index: Number) {
    if (item.disabled) {
        event.preventDefault();
        return;
    }

    if (!item.to && !item.url) {
        event.preventDefault();
    }

    //execute command
    if (item.command) {
        item.command({ originalEvent: event, item: item });
    }

    activeIndex.value = index === activeIndex.value ? null : index;

    emit('menuitem-click', {
        originalEvent: event,
        item: item,
    });
}

function visible(item: MenuItemProps) {
    return typeof item.visible === 'function' ? item.visible() : item.visible !== false;
}

</script>

<template>
  <ul v-if="items">
      <template v-for="(item, i) of items">
          <li
              v-if="visible(item) && !item.separator"
              :key="item.label || i"
              :class="[
                  {
                      'layout-menuitem-category': root,
                      'active-menuitem': activeIndex === i && !item.to && !item.disabled,
                  },
              ]"
              role="none"
          >
              <template v-if="root">
                  <div class="layout-menuitem-root-text" :aria-label="item.label">
                      {{ item.label }}
                  </div>
                  <AppMenu :items="visible(item) && item.items" @menuitem-click="$emit('menuitem-click', $event)" />
              </template>
              <template v-else>
                  <router-link
                      v-if="item.to"
                      :to="item.to"
                      :class="[item.class, { 'p-disabled': item.disabled }]"
                      :style="item.style"
                      @click="onMenuItemClick($event, item, i)"
                      :target="item.target"
                      :aria-label="item.label"
                      exact
                      role="menuitem"
                  >
                      <i :class="item.icon"></i>
                      <span>{{ item.label }}</span>
                      <i v-if="item.items" class="pi pi-fw pi-angle-down menuitem-toggle-icon"></i>
                      <PBadge v-if="item.badge" :value="item.badge" />
                  </router-link>
                  <a
                      v-if="!item.to"
                      :href="item.url || '#'"
                      :style="item.style"
                      :class="[item.class, { 'p-disabled': item.disabled }]"
                      @click="onMenuItemClick($event, item, i)"
                      :target="item.target"
                      :aria-label="item.label"
                      role="menuitem"
                  >
                      <i :class="item.icon"></i>
                      <span>{{ item.label }}</span>
                      <i v-if="item.items" class="pi pi-fw pi-angle-down menuitem-toggle-icon"></i>
                      <PBadge v-if="item.badge" :value="item.badge" />
                  </a>
                  <transition name="layout-submenu-wrapper">
                      <AppMenu
                          v-show="activeIndex === i"
                          :items="visible(item) && item.items"
                          @menuitem-click="$emit('menuitem-click', $event)"
                      />
                  </transition>
              </template>
          </li>
          <li
              class="p-menu-separator"
              :style="item.style"
              v-if="visible(item) && item.separator"
              :key="'separator' + i"
              role="separator"
          ></li>
      </template>
  </ul>
</template>
