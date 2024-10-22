import { createApp, reactive } from 'vue';
import AppWrapper from './AppWrapper.vue';
import router from './router';
import Locale_FR from '@/config/Locale_FR';
import Message from 'primevue/message';
import Button from 'primevue/button';
import Card from 'primevue/card';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import Avatar from 'primevue/avatar';
import InputSwitch from 'primevue/inputswitch';
import StyleClass from 'primevue/styleclass';
import Ripple from 'primevue/ripple';
import Badge from 'primevue/badge';
import Dialog from 'primevue/dialog';
import ConfirmPopup from 'primevue/confirmpopup';
import Password from 'primevue/password';
import Toast from 'primevue/toast';
import InputText from 'primevue/inputtext';
import Calendar from 'primevue/calendar';
import TabMenu from 'primevue/tabmenu';
import Listbox from 'primevue/listbox';
import Menubar from 'primevue/menubar';
import Dropdown from 'primevue/dropdown';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';
import Row from 'primevue/row';
import InputNumber from 'primevue/inputnumber';
import ProgressBar from 'primevue/progressbar';
import AvatarGroup from 'primevue/avatargroup';
import Steps from 'primevue/steps';
import Menu from 'primevue/menu';
import Chart from 'primevue/chart';
import Breadcrumb from 'primevue/breadcrumb';
import AutoComplete from 'primevue/autocomplete';
import ConfirmDialog from 'primevue/confirmdialog';
import RadioButton from 'primevue/radiobutton';
import MultiSelect from 'primevue/multiselect';
import OverlayPanel from 'primevue/overlaypanel';
import Chips from 'primevue/chips';
import Tooltip from 'primevue/tooltip';
import BadgeDirective from 'primevue/badgedirective';
import FileUpload from 'primevue/fileupload';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Checkbox from 'primevue/checkbox';
import Textarea from 'primevue/textarea';

import 'primeflex/primeflex.css';
import 'primevue/resources/primevue.css';
import 'primeicons/primeicons.css';
import './assets/styles/layout.scss';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '@/assets/styles/global.scss';

const app = createApp(AppWrapper);

app.config.globalProperties.$appState = reactive({
  theme: 'lara-light-indigo',
  darkTheme: false,
});

app.use(PrimeVue, { ripple: true, inputStyle: 'outlined', locale: Locale_FR });
app.use(ConfirmationService);
app.use(ToastService);
app.use(router);

app.directive('badge', BadgeDirective);
app.directive('ripple', Ripple);
app.directive('styleclass', StyleClass);
app.directive('tooltip', Tooltip);

// PrimeVue components
app.component('Avatar', Avatar);
app.component('Badge', Badge);
app.component('PButton', Button);
app.component('Card', Card);
app.component('InputSwitch', InputSwitch);
app.component('Message', Message);
app.component('PDialog', Dialog);
app.component('ConfirmPopup', ConfirmPopup);
app.component('Toast', Toast);
app.component('InputText', InputText);
app.component('Calendar', Calendar);
app.component('TabMenu', TabMenu);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('ColumnGroup', ColumnGroup);
app.component('Row', Row);
app.component('Listbox', Listbox);
app.component('InputNumber', InputNumber);
app.component('MultiSelect', MultiSelect);
app.component('Dropdown', Dropdown);
app.component('Menubar', Menubar);
app.component('ProgressBar', ProgressBar);
app.component('AvatarGroup', AvatarGroup);
app.component('Steps', Steps);
app.component('PMenu', Menu);
app.component('AutoComplete', AutoComplete);
app.component('ConfirmDialog', ConfirmDialog);
app.component('Chart', Chart);
app.component('Breadcrumb', Breadcrumb);
app.component('RadioButton', RadioButton);
app.component('OverlayPanel', OverlayPanel);
app.component('Chips', Chips);
app.component('FileUpload', FileUpload);
app.component('Password', Password);
app.component('Accordion', Accordion);
app.component('AccordionTab', AccordionTab);
app.component('Checkbox', Checkbox);
app.component('PTextarea', Textarea);

app.mount('#app');
