<template>
  
  <RegisterForm v-if="auth===false" />

</template>

<script>

import RegisterForm from '../components/RegisterForm'
import { useStore } from "vuex";
import { computed ,watchEffect} from 'vue';
export default {
components: {
    RegisterForm
},
 setup() {
    const store = useStore();
    watchEffect(()=>{store.commit('Reset_Error')})
    return {
      auth: computed(() => store.state.auth.authenticated),
     
    };
  },
}
</script>

<style>

</style>