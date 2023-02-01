<script setup lang="ts">
type CardProps = {
    cardType?: string;
    jtrbAccount: string | number;
    customerName: string;
    ccy: string;
    amount?: string | number;
};

withDefaults(defineProps<CardProps>(), {
    cardType: 'JTRB TEST ACCOUNT',
    amount: 'XXX.XX',
});
</script>

<template>
    <div class="card" style="background-color: var(--primary-50); min-width: 250px">
        <div class="grid justify-content-between">
            <div class="font-bold text-sm text-primary" style="align-self: center">{{ cardType }}</div>
            <div style="width: 36px; height: 36px"><img src="@/assets/svg/jtrb.svg" alt="" /></div>
        </div>
        <div class="mt-2">{{ jtrbAccount }}</div>
        <div class="font-bold text-sm">{{ customerName }}</div>
        <div class="font-bold text-sm mt-2">{{ ccy }} {{ amount }}</div>
    </div>
</template>
