import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

import App from "./App.vue";
import router from "./router.js";
import store from "./store/index.js";

const app = createApp(App);

app.use(router).use(store).use(ElementPlus).mount("#app");
