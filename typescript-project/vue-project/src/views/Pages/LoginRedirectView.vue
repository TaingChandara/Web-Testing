<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { sleep } from '@/misc';
import { useAuthStore } from '@/stores/auth';
import { AppRoute } from '@/constants';
import { useEventService } from '@/composables/useEventService';
import { storeToRefs } from 'pinia';

const evs = useEventService();
const route = useRoute();
const router = useRouter();
const authtore = useAuthStore();
const { authenicate } = authStore;
const { loggedIn } = storeToRefs(authtore);

onMounted(async() =>{
    if (loggedIn.value){
        router.push({name: AppRoute.Home.name});
    }else if (route.query.code){
        evs.showProgress();
        try{
            const codr = route.query.code;
            if (typeof code !== 'string'){
                throw 'Invalid code param';
            }

            //dispatch authnicate to get accessToken
            await authenicate(code);
            router.push({name: AppRoute.Home.name});
        }catch(err){
            router.push({name: AppRoute.LOGIN.name});
            evs.captureError(err);
        }finally{
            evs.hideProgress();
        }
    }else{
        evs.showProgress();
        await sleep(1000);
        evs.hideProgress();
        // if not LoggedIn and no code param, redirect to login page
        router.push({ name: AppRoute.LOGIN.name});
    }
});

</script>

<template>
    <div></div>
</template>