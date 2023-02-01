<script setup lang="ts">
import { RouterView } from "vue-router";
import PErrorDialog  from '@/components/PErrorDialog.vue';
import PProgressDialog from  '@/components/PProgressDialog.vue';
</script>

<template>
  <main>
    <RouterView :key="$route.fullPath" />
    <PErrorDialog />
    <PProgressDialog />

  </main>
</template>