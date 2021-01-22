<template>
  <div v-if="loading === false">
    <p>
      <span class=" text-warning font-weight-bold">Followers</span> :
      <span class="text-primary font-weight-bold">{{ totalF }}</span>
    </p>

    <button
      class="btn btn-info m-2"
      v-if="followStatus === false"
      @click="FollowRequest"
    >
      Follow
    </button>
    <button
      class="btn btn-danger m-2"
      v-if="followStatus === true"
      @click="UnfollowRequest"
    >
      UnFollow
    </button>
  </div>
  <div v-if="loading === true" class="Loading">
    <div class="lds-default">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
</template>

<script>
import { watchEffect, ref, computed } from "vue"
import { useStore } from "vuex"
import { db } from "../FIREBASE"
export default {
  props: ["SingleUser", "user"],
  setup({ SingleUser, user }) {
    const store = useStore()
    const followStatus = computed(() => store.state.people.followStatus)
    const totalF = computed(() => store.state.people.totalFollowers)
    watchEffect(() => {
      store.dispatch("Check_follow", { to: SingleUser, from: user })
    }, totalF.value,followStatus.value)

    const FollowRequest = async () => {
      await store.dispatch("Follow_people", { to: SingleUser, from: user })
    }
    const UnfollowRequest = async() => {
       await store.dispatch("Unfollow_people", { to: SingleUser, from: user })
    }

    return {
      FollowRequest,
      UnfollowRequest,
      followStatus,
      totalF,
      loading: computed(() => store.state.people.loading),
    }
  },
}
</script>

<style></style>
