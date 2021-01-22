<template>
<div v-if='loading===false && (auth===true || auth===false && auth!== null)'>
    <Header/>
   
  <div class="App container">
    <router-view />
  </div>
</div>
 <div v-if="loading === true"  class="spinner-border text-primary Loading" role="status">
  <span class="sr-only">Loading...</span>
</div>
</template>

<script>
import "bootstrap/dist/css/bootstrap.min.css";
import Header from './components/Header'
import { useStore, } from "vuex";
import {useRouter} from 'vue-router'
import { computed, watchEffect, ref } from "vue";
export default {
  components:{
    Header 
  },
  setup(){
    
    const store = useStore()
    const router = useRouter();
    watchEffect( () => {
         store.dispatch("CheckUserStatus");
    });
    
    return{
      loading : computed(()=>store.state.auth.loading),
      auth : computed(()=>store.state.auth.authenticated)
      
    }
    
  }
}
</script>

<style>

*{
 
  margin: 0%;
  padding: 0%;
  box-sizing: border-box;
}
.Loading{
  position: absolute;
  top: 50%;
  left: 50%;
  margin: 0 auto;
  width: 50px;
  height: 50px;
}
.lds-default {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-default div {
  position: absolute;
  width: 6px;
  height: 6px;
  background: rgb(52, 137, 163);
  border-radius: 50%;
  animation: lds-default 1.2s linear infinite;
}
.lds-default div:nth-child(1) {
  animation-delay: 0s;
  top: 37px;
  left: 66px;
}
.lds-default div:nth-child(2) {
  animation-delay: -0.1s;
  top: 22px;
  left: 62px;
}
.lds-default div:nth-child(3) {
  animation-delay: -0.2s;
  top: 11px;
  left: 52px;
}
.lds-default div:nth-child(4) {
  animation-delay: -0.3s;
  top: 7px;
  left: 37px;
}
.lds-default div:nth-child(5) {
  animation-delay: -0.4s;
  top: 11px;
  left: 22px;
}
.lds-default div:nth-child(6) {
  animation-delay: -0.5s;
  top: 22px;
  left: 11px;
}
.lds-default div:nth-child(7) {
  animation-delay: -0.6s;
  top: 37px;
  left: 7px;
}
.lds-default div:nth-child(8) {
  animation-delay: -0.7s;
  top: 52px;
  left: 11px;
}
.lds-default div:nth-child(9) {
  animation-delay: -0.8s;
  top: 62px;
  left: 22px;
}
.lds-default div:nth-child(10) {
  animation-delay: -0.9s;
  top: 66px;
  left: 37px;
}
.lds-default div:nth-child(11) {
  animation-delay: -1s;
  top: 62px;
  left: 52px;
}
.lds-default div:nth-child(12) {
  animation-delay: -1.1s;
  top: 52px;
  left: 62px;
}
@keyframes lds-default {
  0%, 20%, 80%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5);
  }
}
</style>
