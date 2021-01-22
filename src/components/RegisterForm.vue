<template>
  <div class="row " v-if="loading === false">
    <div class="col-12 text-center">
      <h2 class="text-danger text-center">Register</h2>
    </div>

    <div class="col-sm-4 registerForm offset-4">
      <form @submit.prevent="Submit">
        <p class="my-2 text-danger" v-if="errors">
          {{ errors }}
        </p>
        <div class="form-group">
          <label for="Username">Username</label>
          <input
            type="text"
            class="form-control"
            v-model="Details.username"
            placeholder="Username..."
            id="Username"
            aria-describedby="emailHelp"
          />
        </div>
        <div class="form-group">
          <label for="Email">Email address</label>
          <input
            type="email"
            class="form-control"
            v-model="Details.email"
            placeholder="Email..."
            id="Email"
            aria-describedby="emailHelp"
          />
          <small id="emailHelp" class="form-text text-muted"
            >We'll never share your email with anyone else.</small
          >
        </div>
        <div class="row">
          <div class="col-6">
            <div class="form-group">
              <label for="Firstname">FirstName</label>
              <input
                type="text"
                class="form-control"
                v-model="Details.firstname"
                placeholder="Firtname..."
                id="Firstname"
                aria-describedby="emailHelp"
              />
            </div>
          </div>
          <div class="col-6">
            <div class="form-group">
              <label for="LastName">LastName</label>
              <input
                type="text"
                class="form-control"
                v-model="Details.lastname"
                placeholder="Lastname..."
                id="LastName"
                aria-describedby="emailHelp"
              />
            </div>
          </div>
        </div>
        <div class="form-group">
          <label for=""> Gender :</label>
          <input
            type="radio"
            id="male"
            value="Male"
            v-model="Details.gender"
            class="mx-2"
          />
          <label for="male">Male</label>

          <input
            type="radio"
            id="female"
            value="Female"
            v-model="Details.gender"
            class="mx-2"
          />
          <label for="female">Female</label>
        </div>
        <div class="form-group">
          <label for="Age">Age</label>
          <input
            type="number"
            v-model.number="Details.age"
            minlength="1"
            maxlength="2"
            min="8"
            placeholder="Age..."
            class="form-control"
            id="Age"
          />
        </div>
        <div class="form-group">
          <label for="Pass">Password</label>
          <input
            type="password"
            v-model="Details.password"
            placeholder="Password..."
            class="form-control"
            id="Pass"
          />
        </div>
        <div class="form-group">
          <label for="Cpass">Confirm Password</label>
          <input
            type="password"
            v-model="Details.Cpassword"
            placeholder="Confirm Password..."
            class="form-control"
            id="Cpass"
          />
        </div>

        <button type="submit" class="btn btn-danger">Register</button>
      </form>
      <p class="text-success para">
        Already have an account?
        <router-link :to="{ name: 'Login' }" class="btn btn-success"
          >Login</router-link
        >
      </p>
    </div>
  </div>
</template>

<script>
import { computed, reactive, watchEffect } from "vue"
import { useRouter } from "vue-router"
import { useStore } from "vuex"
export default {
  setup() {
    const store = useStore()
    const Details = reactive({
      username: "",
      email: "",
      gender: "",
      password: "",
      Cpassword: "",
      age: 8,
      firstname: "",
      lastname: "",
    })
    const Submit = async () => {
      await store.dispatch("REGISTER", Details)
    }
    return {
      Details,
      Submit,
      errors: computed(() => store.state.auth.errors),
      loading: computed(() => store.state.auth.loading),
    }
  },
}
</script>

<style>
@media screen and (max-width: 992px) {
  .registerForm {
    margin: auto;
    text-align: center;
  }
  .para {
    margin: 5px auto;
  }
}
</style>
