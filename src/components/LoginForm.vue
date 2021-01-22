<template>
  <div class="row" v-if="loading===false">
    <div class="col-12 text-center my-2">
      <h2 class="text-danger text-center text-uppercase">LOGIN</h2>
    </div>
    <div class="col-sm-4 LoginForm offset-4">
      <p v-if="errors" class="text-danger m-3">
        {{ errors }}
      </p>
      <form @submit.prevent="Submit">
        <div class="form-group">
          <label for="exampleInputEmail1">Email address</label>
          <input
            type="email"
            class="form-control"
            v-model="Details.email"
            placeholder="Email..."
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
          />
          <small id="emailHelp" class="form-text text-muted"
            >We'll never share your email with anyone else.</small
          >
        </div>
        <div class="form-group">
          <label for="exampleInputPassword1">Password</label>
          <input
            type="password"
            v-model="Details.password"
            placeholder="Password..."
            class="form-control"
            id="exampleInputPassword1"
          />
        </div>

        <button type="submit" class="btn btn-danger">Login</button>
      </form>
      <p class="text-success para">
        Dont have an account?
        <router-link :to="{ name: 'Register' }" class="btn btn-success"
          >Register</router-link
        >
      </p>
    </div>
  </div>
</template>

<script>
import { computed, reactive, ref, onBeforeMount, watch, watchEffect } from "vue"
import { useRouter } from "vue-router"
import { useStore } from "vuex"
export default {
  setup() {
    const store = useStore()
    const router = useRouter()

    const Details = reactive({
      email: "",
      password: "",
    })
    const formValues = reactive({})

    const Submit = async () => {
      await store.dispatch("LOGIN", Details)
    }
    return {
      Submit,
      Details,
      formValues,
      loading: computed(() => store.state.auth.loading),
      errors: computed(() => store.state.auth.errors),
    }
  },
}
</script>

<style>
@media screen and (max-width: 992px) {
  .LoginForm{
    margin:auto;
    text-align: center;
  
  }
  .para{
    margin: 5px auto;
  }}</style>
