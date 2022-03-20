import { createRouter, createWebHistory } from "vue-router";
import axios from "./store/axios.js";

import UserAuth from "./pages/auth/UserAuth.vue";
import UserRegister from "./pages/auth/UserRegister.vue";
import MainPage from "./pages/main/MainPage.vue";
import DocumentsPage from "./pages/documents/DocumentsPage.vue"
import FilesPage from "./pages/documents/FilesPage.vue"
import GroupsPage from "./pages/tables/GroupsPage.vue"
import SubjectsPage from "./pages/tables/SubjectsPage.vue"
import UsersPage from "./pages/tables/UsersPage.vue"
import SecretKeysPage from "./pages/tables/SecretKeysPage.vue"

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
    {
      name: "Files",
      path: "/files",
      meta: { requireAuth: true },
      component: FilesPage,
    },
    {
      name: "Groups",
      path: "/groups",
      meta: { requireAuth: true },
      component: GroupsPage,
    },
    {
      name: "Subjects",
      path: "/subjects",
      meta: { requireAuth: true },
      component: SubjectsPage,
    },
    {
      name: "Users",
      path: "/users",
      meta: { requireAuth: true },
      component: UsersPage,
    },
    {
      name: "SecretKeys",
      path: "/secretkeys",
      meta: { requireAuth: true },
      component: SecretKeysPage,
    },
    //{ path: "/test2/:testId", component: HelloWorld, props: true },
    { path: "/:404(.*)", component: MainPage, alias: "/" },
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
