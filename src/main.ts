import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faClose, faFont, faImage, faLink, faSave, faSitemap, faToolbox } from '@fortawesome/free-solid-svg-icons'

library.add(faSitemap, faToolbox, faClose, faLink, faImage, faFont, faSave);

const pinia = createPinia();
const app = createApp(App);
app.component('fai', FontAwesomeIcon);
app.use(pinia);
app.use(router);
app.mount('#app');
