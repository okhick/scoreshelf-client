import Vue from 'vue';
import VueRouter from 'vue-router';
// import { createRouter, createWebHashHistory } from 'vue-router';
// import Home from '../views/Home.vue';

Vue.use(VueRouter);
// Vue.use(Vuex);

const routes = [
  {
    name: 'Home',
    path: '/',
    component: () => import(/* webpackChunkName: "about" */ '@/views/Home.vue'),
  },
  {
    name: 'About',
    path: '/about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue'),
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/Login.vue'),
    children: [
      {
        name: 'Login',
        path: '',
        component: () =>
          import(/* webpackChunkName: "login-login" */ '@/components/forms/LoginForm.vue'),
      },
      {
        name: 'SignUp',
        path: 'signup',
        component: () =>
          import(/* webpackChunkName: "login-signup" */ '@/components/forms/SignUpForm.vue'),
      },
    ],
  },
  {
    path: '/dashboard',
    component: () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard.vue'),
    children: [
      {
        name: 'Dashboard',
        path: '',
        component: () =>
          import(/* webpackChunkName: "dashboard-home" */ '@/components/dashboard/Dashboard.vue'),
      },

      {
        name: 'EditProfile',
        path: 'edit-profile',
        component: () =>
          import(
            /* webpackChunkName: "dashboard-edit-profile" */ '@/components/dashboard/editProfile/EditProfile.vue'
          ),
      },
      {
        name: 'Publications',
        path: 'publications',
        component: () =>
          import(
            /* webpackChunkName: "dashboard-publish" */ '@/components/dashboard/publish/Publish.vue'
          ),
      },
      {
        name: 'Purchases',
        path: 'purchases',
        component: () =>
          import(
            /* webpackChunkName: "dashboard-publish" */ '@/components/dashboard/purchases/Purchases.vue'
          ),
      },
      {
        name: 'Sales',
        path: 'sales',
        component: () =>
          import(
            /* webpackChunkName: "dashboard-publish" */ '@/components/dashboard/sales/Sales.vue'
          ),
      },
    ],
  },
  {
    name: 'Search',
    path: '/search/:query',
    component: () => import(/* webpackChunkName: "about" */ '../views/Search.vue'),
  },
  {
    name: 'Listing',
    path: '/publication/:id',
    component: () => import(/* webpackChunkName: "listing" */ '../views/Listing.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

// router.beforeEach((to, from, next) => {
//   if (to.name == "Dashboard" && !this.store.state.isLoggedIn) {
//     next({ path: "login" });
//   } else {
//     next();
//   }
// });

export default router;
