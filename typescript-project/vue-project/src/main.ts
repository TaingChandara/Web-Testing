import { createApp } from "vue";
import { createPinia } from "pinia";


//Event emitter

import App from "./App.vue";
import router from "./router";
import PrimeVue from 'primevue/config';
import StyleClass from 'primevue/styleclass';

import Dialog from 'primevue/dialog';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import InputMask from 'primevue/inputmask';
import Dropdown from 'primevue/dropdown';
import Badge from 'primevue/badge';
import ProgressSpinner from 'primevue/progressspinner';
import "./assets/main.css";

const app = createApp(App);

//setup axios interceptor after Pinia is created
setupInterceptor();


app.use(createPinia());
app.use(router);

// UI
app.use(PrimeVue);

app.directive('styleclass', StyleClass);

app.component('PDialog', Dialog);
app.component('PBadge', Badge);
app.component('PDataTable', DataTable);
app.component('PColumn', Column);
app.component('PButton', Button);
app.component('PInputText', InputText);
app.component('PInputNumber', InputNumber);
app.component('PInputMask', InputMask);
app.component('PDropdown', Dropdown);
app.component('PProgressSpinner', ProgressSpinner);

app.config.globalProperties.emitter = mitt();
app.mount("#app");
