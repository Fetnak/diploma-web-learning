import { createRouter, createWebHistory } from "vue-router";
import axios from "./store/axios.js";

import UserAuth from "./pages/auth/UserAuth.vue";
import UserRegister from "./pages/auth/UserRegister.vue";
import MainPage from "./pages/main/MainPage.vue";
import DocumentsPage from "./pages/documents/DocumentsPage.vue"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: "Auth",
      path: "/auth",
      meta: { requireAuth: false },
      component: UserAuth,
    },
    {
      name: "Register",
      path: "/register",
      meta: { requireAuth: false },
      component: UserRegister,
    },
    //{ path: "/", redirect: "/test1" },
    {
      name: "MainPage",
      path: "/",
      meta: { requireAuth: true },
      component: MainPage,
      title: "Начальная страница"
      //alias: "/",
      // children: [
      //   { name: "test-children-page", path: ":testId", component: HelloWorld },
      // ], // /test1/:testId
    },
    {
      name: "Documents",
      path: "/documents",
      meta: { requireAuth: true },
      component: DocumentsPage,
    },
    //{ path: "/test2/:testId", component: HelloWorld, props: true },
    //{ path: "/:404(.*)", redirect: "/test1" },
  ],
  //linkActiveClass: "active",
});

router.beforeEach(async (to, from, next) => {
  if (to.meta.requireAuth) {
    try {
      await axios({
        method: "get",
        url: "/api/v1/auth/check"
      }).then((data) => {
          if (data.data.authorized) {
            next();
          } else {
            next("/auth");
          }
        }).catch(() => {
          next("/auth");
        })
    } catch {
      next();
    }
  } else {
    next();
  }
});

export default router;
