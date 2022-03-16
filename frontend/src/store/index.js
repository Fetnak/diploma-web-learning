import { createStore } from "vuex";

import authModule from "./modules/auth.js";
import headerModule from "./modules/header.js";

const store = createStore({
  modules: {
    auth: authModule,
    header: headerModule
  },
});

export default store;
