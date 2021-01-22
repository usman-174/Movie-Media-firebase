<template>
  <form @submit.prevent="Submit">
    <div class="form-group">
      <label for="username">Firstname :</label>
      <input
        type="text"
        class="form-control"
        id="firstname"
        placeholder="firstname"
        v-model="Details.firstname"
      />
    </div>
    <div class="form-group">
      <label for="username">lastname :</label>
      <input
        type="text"
        class="form-control"
        id="lastname"
        placeholder="lastname"
        v-model="Details.lastname"
      />
    </div>
    <div class="form-group">
      <label for="username">Username :</label>
      <input
        type="text"
        class="form-control"
        id="username"
        placeholder="Username"
        v-model="Details.username"
      />
    </div>
    <div class="form-group">
      <label for="Email">Email address :</label>
      <input
        type="email"
        class="form-control"
        id="Email"
        placeholder="Enter email"
        v-model="Details.email"
      />
    </div>
    <p v-if="error" class="text-danger mx-auto ">{{ error }}</p>
    <br />
    <button type="submit" class="btn btn-success">Update</button>
    <button @click="Cancel" class="btn btn-secondary mx-2">Cancel</button>
    
  </form>
</template>

<script>
import "bootstrap/dist/js/bootstrap.min.js";
import { reactive, ref } from "vue";
import { useStore } from "vuex";
export default {
  props: {
    User: Object,
    edit: Function,
  },
  setup(props) {
    const store = useStore();
    const error = ref(null);
    const Details = reactive({
      email: props.User.email,
      username: props.User.username,
      uid: props.User.uid,
      firstname: props.User.firstname,
      lastname: props.User.lastname,
    });

    const Submit = async () => {
      if (
        Details.email !== props.User.email ||
        Details.username !== props.User.username ||
        Details.firstname !== props.User.firstname ||
        Details.lastname !== props.User.lastname
      ) {
        await store.dispatch("UpdateProfile", Details);
        props.edit();
      } else {
        error.value = "Please do some changed before updating.";
      }
    };
    const Cancel = async () => {
      await props.edit();
    };
   
    return {
      Submit,
      Details,
      Cancel,
      
      error,
    };
  },
};
</script>

<style></style>
