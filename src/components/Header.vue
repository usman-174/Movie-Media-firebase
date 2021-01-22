<template>
  <nav class="navbar navbar-expand-lg  navbar-dark">
    <div class="container">
      <router-link to="/" class="navbar-brand">|GALLERY|</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item">
            <router-link :to="{ name: 'SearchData' }" class="nav-link"
              >Movies/TV
            </router-link>
          </li>

          <li v-if="auth" class="nav-item">
            <router-link :to="{ name: 'FindPeople' }" class="nav-link">
              Find People
            </router-link>
          </li>
          <li v-if="auth" class="nav-item">
            <router-link :to="{ name: 'PlayLists' }" class="nav-link">
              PlayLists
            </router-link>
          </li>
          <li v-if="auth" class="nav-item">
            <router-link :to="{ name: 'Logout' }" class="nav-link"
              >Logout
            </router-link>
          </li>
          <li v-if="auth && user" class="Profile_Icon text-center">
            <router-link
              to="/profile"
              class="Profile-link text-uppercase profile_name"
            >
              <img
                class="IMG"
                v-if="user.photoURL"
                :src="user.photoURL"
                alt="Profile"
              />
              <span class="icon_profile" v-else>
                <span>
                  {{ user.firstname[0] + user.lastname[0] }}
                </span> </span
              >{{ user.username }}
            </router-link>
          </li>
          <li v-if="auth === false && auth !== null" class="nav-item">
            <router-link :to="{ name: 'Login' }" class="nav-link"
              >Login</router-link
            >
          </li>
          <li v-if="auth === false && auth !== null" class="nav-item">
            <router-link :to="{ name: 'Register' }" class="nav-link"
              >Register</router-link
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { useStore, mapState } from "vuex"
import { computed, watchEffect, ref } from "vue"

export default {
  computed: mapState({
    auth: (store) => store.auth.authenticated,
    user: (store) => store.auth.user,
  }),
}
</script>

<style>
.navbar {
  background: rgba(0, 0, 0, 0.7);
}
.navbar-brand {
  color: rgb(202, 56, 85) !important;
  font-weight: bold;
  font-size: 24px;
}
.IMG {
  padding: 2px;
  /* border-radius: 50%; */
  width: 55px;
  height: 55px;
  border-radius: 50%;
  margin-right: 4px;
  text-align: center;
  color: rgb(64, 83, 83) !important;
}
.Profile-link:hover {
  color: rgb(30, 189, 189) !important;
  text-decoration: none;
}
.icon_profile {
  padding: 3px;
  border-radius: 50%;
  margin: 0 auto;
  text-align: center;
  background: palevioletred;
  color: rgb(64, 83, 83) !important;
}
.nav-item {
  font-size: 17px;
  margin: auto;
}
.Profile_Icon {
  font-weight: bold;
  padding: 0 3px;
  border-radius: 6px;
  margin: auto 15px;
}

.Profile_Icon .profile_name {
  font-size: 17px;
  color: rgb(214, 100, 100);
}
.nav-link {
  padding: auto 4px;

  color: rgb(218, 65, 65) !important;
}
.nav-link:hover {
  border-radius: 6px;
  padding: 4px 2px;
  /* background: rgb(78, 72, 62); */
  border: 1px solid rgb(218, 65, 65);
  color: rgb(30, 189, 189) !important;
}
</style>
