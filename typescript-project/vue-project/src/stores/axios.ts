import { defineStore } from 'pinia';
import type { CancelTokenSource } from 'axios';

export const useCancelTokenStore = defineStore('cancelTokenStore', {
    state: (): { cancelToken: CancelTokenSource[] } => ({ cancelToken: [] }),
    actions: {
        // use to add cancel token via axios interceptor
        addCancelToken(token: CancelTokenSource) {
            this.cancelToken.push(token);
        },
        // use to cancel all request after route change
        cancelPendingRequest() {
            this.cancelToken.forEach((request) => {
                if (request.cancel) {
                    request.cancel();
                }
            });

            this.cancelToken = [];
        },
    },
});
