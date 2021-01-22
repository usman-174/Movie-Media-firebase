<template>
  <h1 class="text-center text-danger">Find People</h1>
  <div class="row ">
    <div class="col-12 text-center my-2" v-if="searchError">
      <h4 class="text-danger ">{{searchError}}</h4>
    </div><br>
    <div class="col-4 offset-4 text-center search py-2 ">
      <input
        type="text"
        v-model="search"
        class="form-control"
        placeholder="Search by Username.."
      />
      <button class="btn btn-danger my-2" @click="Start">Search</button>
    </div>
  </div>
  <div class="row" v-if="People.length && !loading">
    <div
      v-for="user in People"
      :key="user.uid"
      class=" user col-md-4 offset-1  back my-2  p-1"
    >
      <div class="row details">
        <div class=" text-center  mx-auto imagee">
          <div class="img_wrapper">
            <img
              :src="
                user.photoURL
                  ? user.photoURL
                  : 'https://firebasestorage.googleapis.com/v0/b/gallery-42412.appspot.com/o/unknown.jpg?alt=media&token=b1814813-8238-486d-a7be-4f863b3cf6b9'
              "
              alt="PIC"
              class="IMG"
            />
          </div>
        <!-- <div class="col-lg-6 text-center"> -->
          <h4 class="text-uppercase name my-1">{{ user.username }}</h4>

          <router-link
            class="btn btn-info"
            :to="{ name: 'PeopleProfile', params: { id: user.uid } }"
          >
            Profile
          </router-link>
        <!-- </div> -->
        </div>
      </div>
    </div>
  </div>
  <div v-if="!People.length && !loading">
    <h2 class="text-warning text-center my-5">
      No user Available by this USERNAME.
    </h2>
  </div>
  <div v-if="loading === true"  class="spinner-border text-danger Loading" role="status">
  <span class="sr-only">Loading...</span>
</div>
</template>

<script>
import { computed, reactive, ref, watchEffect } from "vue";
import { db } from "../FIREBASE";
import { useStore } from "vuex";
export default {
  setup() {
    const store = useStore();
    const search = ref("");
    const authUser = computed(() => store.state.auth.user);
    const searchError = ref('')
    watchEffect(async () => {
      await store.dispatch("Load_people")
    });

    const Start = async () => {
      searchError.value = ''
      if (search.value === "") {
        searchError.value = 'Please type Username before searching.'
      } else {
        store.dispatch("Query_SEARCH_PEOPLE", search.value);
        const people = computed(() => store.state.people.peoples);
      }
    };
    return {
      People: authUser.value ?  computed(() => store.state.people.peoples.filter((val) => val.uid !== authUser.value.uid)) : [],
      loading: computed(() => store.state.people.loading),
      search,searchError,
      Start,
    };
  },
};
</script>

<style scoped>
.user {
  border-radius: 6px;
}
.name{
color: aqua;
}
.back{
background: rgb(190, 34, 34);
}

.IMG {
  padding: 2px;
  border-radius: 50%;
  width: 55px;
  height: 55px;
}
.details{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
@media screen and (max-width: 754px) {
 .search{
   width: 100px!important
 }
 .back{
  
   margin: 10px 50px;
 }
  }
  @media screen and (max-width: 992px) {
  .details{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  .imagee{
    margin: 0 auto;
    text-align: center;
  }
  }
</style>
