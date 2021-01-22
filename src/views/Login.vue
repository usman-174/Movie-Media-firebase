<template>
  <div v-if="auth===false">
    <LoginForm />
  </div>

  
</template>

<script>
import LoginForm from "../components/LoginForm";
import { useStore } from "vuex";
import { computed, watchEffect } from "vue";
export default {
  components: {
    LoginForm,
  },
  setup() {
    const store = useStore();
    watchEffect(()=>{store.commit('Reset_Error')})
    
    return {
      auth: computed(() => store.state.auth.authenticated),
     
    };
  },
};
</script>

<style></style>
