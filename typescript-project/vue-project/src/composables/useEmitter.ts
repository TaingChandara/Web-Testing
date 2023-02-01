import { getCurrentInstance } from 'vue';

export function useEmitter() {
    const internalInstance = getCurrentInstance();
    return internalInstance?.appContext.config.globalProperties.emitter;
}
