import { createApp } from "vue";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import "./assets/style.css";
import App from "./App.vue";
import { Session, store } from "./store";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: () => import("./views/Home.vue"),
  },
  {
    path: "/sessions/:name",
    component: () => import("./views/Session.vue"),
    beforeEnter: async (to, from, next) => {
      const name = to.params.name as string;
      const session = await store.dispatch("GET_SESSION", name);
      store.commit("setSession", session);
      return next();
    },
  },
  {
    path: "/sessions/:name/admin",
    component: () => import("./views/AdminSession.vue"),
    beforeEnter: async (to, from, next) => {
      const name = to.params.name as string;
      const id = localStorage.getItem(`bingo::${name}`);

      if (!id) return next(from);

      const session = await store.dispatch("GET_SESSION", to.params.name);
      store.commit("setSession", session);
      return next();
    },
  },
];

const router = createRouter({
  routes,
  history: createWebHistory(),
});

createApp(App).use(router).use(store).mount("#app");
