<template>
<p v-if="Pro" class="mx-4 my-3 text-success font-weight-bold">
        {{ Pro }}%
</p>
</template>

<script>
import { watchEffect, toRefs, computed, ref } from "vue";
import useStorage from "../hooks/useStorage";
import { useStore } from "vuex";
export default {
  props: {
    Picture: Object,
  },
  setup(props) {
    const store = useStore();
    const { Picture } = toRefs(props);
    const Pro = ref(null)
    const { progress, url } = useStorage(Picture.value.file);
    
    watchEffect(
      async () => {
        if (progress.value) {
          Pro.value = progress.value
        }
        if (url.value) {
          Picture.value.file = null
          Picture.value.fileName = null
          await store.dispatch("uploadProfile", url.value);
        }
      },
      url,progress,
      Picture
    );
    return {
      Pro,
      url,
    };
  },
};
</script>

<style scoped>
.progress{
    position: relative;
    widows: 100%;
    height: 100%;
    background-color: rgb(108, 116, 116);  
}
.progress .text-center{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
}
</style>
