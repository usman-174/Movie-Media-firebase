import { createRouter, createWebHistory, useRouter } from "vue-router";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import FindPeople from '../views/FindPeople.vue'
import PeopleProfile from '../views/PeopleProfile.vue'
import Playlists from '../views/PlayLists.vue'
import Profile from "../views/Profile.vue";
import { auth } from "../FIREBASE";
import store from "../store";
import SearchData from '../views/SearchData.vue'
import { computed } from "vue";

const routes = [
  
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      strict: true,
    },
    beforeEnter: (to, from, next) => {
      const loading = computed(() => store.state.auth.loading);
      const auth = computed(() => store.state.auth.authenticated);
      if (!auth.value ) {
        
        next(true);
      } else {
        next(false);
      }
    },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: {
      strict: true,
    },
    beforeEnter: (to, from, next) => {
      const auth = computed(() => store.state.auth.authenticated);
     
      if (!auth.value) {
        next(true);
      } else {
        next(false);
      }
    },
  },
  {
    path: "/playlists",
    name: "PlayLists",
    component: Playlists,
    meta: {
      strict: true,
    },
    beforeEnter: (to, from, next) => {
      const auth = computed(() => store.state.auth.authenticated).value;
      
      if (auth === false && to.meta.strict) {
        next('/login');
      } else {
        $('#PlaylistModal').modal('hide')
        next(true);
      }
    },
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: {
      strict: true,
    },
    beforeEnter: (to, from, next) => {
      const auth = computed(() => store.state.auth.authenticated).value;
      const loading = computed(() => store.state.auth.loading).value;
      if (auth === false && to.meta.strict) {
        next(false);
      } else {
        next(true);
      }
    },
  },
  {
    path: "/logout",
    name: "Logout",
    meta: {
      strict: true,
    },
    beforeEnter: (to, from, next) => {
      if (!store.state.auth.authenticated && to.meta.strict) {
        next("/login");
      } else if (store.state.auth.authenticated && to.meta.strict) {
        auth.signOut();
        // store.dispatch("SignOut");
        store.dispatch('CheckUserStatus')
        next("/login");
      }
    },
  },,
  {
    path: "/findpeople",
    name: "FindPeople",
    meta: {
      strict: true,
    },
    component : FindPeople,
    beforeEnter: (to, from, next) => {
      const auth = computed(() => store.state.auth.authenticated).value;
      
      if (auth === false && to.meta.strict) {
        next('/login');
      } else {
        next(true);
      }
    },
  },
  {
    path: "/findpeople/:id",
    name: "PeopleProfile",
    meta: {
      strict: true,
    },
    props : true,
    component : PeopleProfile,
    beforeEnter: (to, from, next) => {
      const auth = computed(() => store.state.auth.authenticated).value;
      
      if (auth === false && to.meta.strict) {
        next('/login');
      } else {
        next(true);
      }
    },
  },
  {
    path: "/",
    name: "SearchData",
    meta: {
      strict: true,
    },
    props : true,
    component : SearchData,
    meta: {
      strict: false,
    },
    beforeEnter: (to, from, next) => {
      if (!to.meta.strict) {
        next();
      }
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
