import { AppROute } from '@/constants';

const route = {
    INDEX: {
        path: AppRoute.LOG.INDEX.path,
        name: AppRoute.LOG.INDEX.name,
    redirect:{
        name: AppRoute.LOG.PROCESS.name,
    },
    children: [
        {
            path: AppRoute.LOG.PROCESS.path,
            name: AppRoute.LOG.PROCESS.name,
            component: () => import('@/views/query-logs/ProcessLogView.vue'),
        },
        {
            path: AppRoute.LOG.TRANSACTION.path,
            name: AppRoute.LOG.TRANSACTION.name,
            component: () => import('@/views/query-logs/TransactionView.vue'),
        },
        {
            path: AppRoute.LOG.CUSTOMER_TRANSACTION.path,
            name: AppRoute.LOG.CUSTOMER_TRANSACTION.name,
            component: () => import('@/views/query-logs/CustomerTransactionView.vue'),
        },
    ],
    },
};