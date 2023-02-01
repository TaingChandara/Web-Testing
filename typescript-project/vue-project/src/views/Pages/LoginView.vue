<script setup lang="ts">
import { useEventService } from '@/composables/useEventService';
import { AuthService } from '@/service/auth';
import { stringLiteral } from '@babel/types';


defineProps<{
    appName: string;
}>();

const evs = useEventService();
const signIn = () => {
    try{
        AuthService.lo
    }
}
</script>