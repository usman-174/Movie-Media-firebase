<template>
  <div v-if="loading === true"  class="spinner-border text-primary Loading" role="status">
  <span class="sr-only">Loading...</span>
</div>
  <div v-if="SingleUser && loading === false" class="row">
    <div class="col-md-4 m-2 text-center">
      <img
        class="Show_Image"
        :src="
          SingleUser.photoURL
            ? SingleUser.photoURL
            : 'https://firebasestorage.googleapis.com/v0/b/gallery-42412.appspot.com/o/unknown.jpg?alt=media&token=b1814813-8238-486d-a7be-4f863b3cf6b9'
        "
        alt="PIC"
      />
      <h1 class="text-uppercase text-danger username">
        {{ SingleUser.username }}
      </h1>
      <Follow :SingleUser="SingleUser" :user="user" />
    </div>
    <div class="col-6 offset-1 m-2" v-if="playlistLoading===false">
      <div v-if="!followStatus" class="text-center mt-5 text-info">
        <h1>
          Follow <span class="text-dark">{{ SingleUser.username.toUpperCase() }}</span> to see their Playlists.
        </h1>
      </div>
      <div v-else-if="peoplePlaylist && peoplePlaylist.length" class="mt-5 mx-auto ">
        <h2 class="my-3 text-danger font-weight-bold">PlayLists : </h2>
        <ol class="list-group" v-for="playlist in peoplePlaylist"
            :key="playlist.id">
          <li
            @click="FetchMovies(playlist.id, playlist.data)"
            
            class="list-group-item listPlay text-center"
            data-toggle="modal" data-target="#MoviesModal"
          >
            <div class="form-check">
              <label
                class="form-check-label font-weight-bold text-uppercase"
                for="exampleCheck1"
                >{{ playlist.name }}</label
              >
            </div>
          </li>
          <Movies />
        </ol>
      </div>
      <div v-else-if="!peoplePlaylist.length " class="text-center mt-5 text-warning">
        <h1><span class="text-dark">{{ SingleUser.username.toUpperCase() }}</span> don't have any playlists yet.</h1>
      </div>
      
    </div>
    <div class="col-6 offset-1 m-2" v-if="playlistLoading===true">
      <div class="Loading">
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
    </div>
  </div>
</template>

<script>
import { computed, watchEffect, ref } from "vue"
import Follow from "../components/Follow"
import { useStore } from "vuex"
import Movies from '../components/Movies'
import { useRouter } from "vue-router"
import { db } from "../FIREBASE"
export default {
  components: {
    Follow,Movies
  },
  props: ["id"],
  setup({ id }) {
    const router = useRouter()
    const store = useStore()
    
      
    const user = computed(() => store.state.auth.user)
    const SingleUser = computed(() => store.state.people.singlePeople)
    const followStatus = computed(() => store.state.people.followStatus)
    const totalF = computed(() => store.state.people.totalFollowers)
    const peoplePlaylist = computed(()=>store.state.people.peoplePlaylist)
    watchEffect(async () => {
      if (user.value && user.value.uid === id) {
        router.push({ name: "Profile" })
      } else {
        await store.dispatch("Show_profile", id)
        await store.dispatch("People_playlist", id)
        
      }
    }, totalF.value)
    const FetchMovies = async(id,IMDBIDS)=>{
    
      if (IMDBIDS) {
        await store.commit("NULL_PLAYLIST_MOVIES")
        await store.dispatch("FETCH_PEOPLE_PLAYLIST_DATA", { id, IMDBIDS })
      } 
    }

    return {
      SingleUser,
      peoplePlaylist,FetchMovies,
      followStatus,
      playlistLoading : computed(()=>store.state.people.playlistLoading),
      loading: computed(() => store.state.people.loading),
      user,
    }
  },
}
</script>

<style scoped>
.Show_Image {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  margin: 10px;
}
label{
  cursor: pointer;
}
.listPlay{
  width: 50%;
}
li{
  width: 100%;
  font-size: 22px;
  cursor: pointer;
  color: rgb(204, 40, 28);
  background: rgb(109, 168, 158);
}
li:hover{
  color: rgb(26, 179, 179);
  background: rgb(201, 47, 67);
}
@media screen and (max-width: 754px) {
 .listPlay{
   width: auto
 }

  }
</style>
