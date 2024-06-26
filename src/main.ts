import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faCircleMinus,
  faClose,
  faCopy,
  faFont,
  faImage,
  faLink,
  faPersonRunning,
  faPlus,
  faSave,
  faSitemap,
  faToolbox,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { faClipboard } from '@fortawesome/free-regular-svg-icons'

library.add(faToolbox, faClose, faSave, faTrashCan, faCopy, faClipboard, faPersonRunning);
library.add(faSitemap, faLink, faImage, faFont, faPlus, faCircleMinus);

const pinia = createPinia();
const app = createApp(App);
app.component('fai', FontAwesomeIcon);
app.use(pinia);
app.use(router);
app.mount('#app');
