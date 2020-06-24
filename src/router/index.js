import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import store from "../store/index.js";

Vue.use(VueRouter);
// Vue.use(Vuex);

const routes = [
  {
    name: "Home",
    path: "/",
    component: Home
  },
  {
    name: "About",
    path: "/about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  },
  {
    name: "Login",
    path: "/login/:form",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Login.vue")
  },
  {
    name: "Dashboard",
    path: "/dashboard",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Dashboard.vue")
  }
];

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  if (to.name == "Dashboard" && !store.state.isLoggedIn) {
    next({ path: "login/login" });
  } else {
    next();
  }
});

export default router;
