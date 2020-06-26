import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

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
    path: "/login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Login.vue"),
    children: [
      {
        name: "Login",
        path: "",
        component: () =>
          import(
            /* webpackChunkName: "login-login" */ "@/components/forms/LoginForm.vue"
          )
      },
      {
        name: "SignUp",
        path: "signup",
        component: () =>
          import(
            /* webpackChunkName: "login-signup" */ "@/components/forms/SignUpForm.vue"
          )
      }
    ]
  },
  {
    path: "/dashboard",
    component: () =>
      import(/* webpackChunkName: "dashboard" */ "../views/Dashboard.vue"),
    children: [
      {
        name: "Dashboard",
        path: "",
        component: () =>
          import(
            /* webpackChunkName: "dashboard-home" */ "@/components/dashboard/DashboardHome.vue"
          )
      },

      {
        name: "EditProfile",
        path: "edit-profile",
        component: () =>
          import(
            /* webpackChunkName: "dashboard-edit-profile" */ "@/components/dashboard/EditProfile.vue"
          )
      },
      {
        name: "Publish",
        path: "publish",
        component: () =>
          import(
            /* webpackChunkName: "dashboard-publish" */ "@/components/dashboard/Publish.vue"
          )
      }
    ]
  }
];

const router = new VueRouter({
  routes
});

// router.beforeEach((to, from, next) => {
//   if (to.name == "Dashboard" && !store.state.isLoggedIn) {
//     next({ path: "login" });
//   } else {
//     next();
//   }
// });

export default router;
