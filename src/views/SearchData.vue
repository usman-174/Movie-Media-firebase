<template>
  <div class="row">
    <div class="col-12">
      <h1 class="text-center text-danger">Search Movie or TV Series.</h1>
    </div>
    <div class="col-4 offset-4 media d-flex my-2">
      <input
        type="text"
        placeholder="Enter name"
        class="form-control  p-1 mediaSearch"
        v-model="query"
      />
      <select class="form-control select mx-2 p-1" v-model="type">
        <option value="" selected>Select Type.</option>
        <option value="movie">Movie</option>
        <option value="series">Series</option>
      </select>
      <i class="fas fa-search-plus mx-1 mediaIcon" @click="onSearch"></i>
    </div>
   <div class="col-12 text-center text-danger" v-if="queryError">
   <h3>
       {{queryError}}
   </h3>
   </div>
  </div>
  <div class="row my-3 mediaMovie" v-if="loading ===false && result"><br>
    <div class="col-sm-4  mx-auto" v-if="result.Response ==='True'">
    <div class="card text-center" style="width: 18rem;">
  <img class="card-img-top  mx-auto"  v-if="result.Poster !== 'N/A'" :src="result.Poster" alt="Image not Found.">
  <img  class="card-img-top  mx-auto"  v-else :src="blackPoster" alt="Image not Found.">
  
  <div class="card-body">
    <h5 class="card-title text-center" v-if="result.Title !== 'N/A'">{{result.Title}}</h5>
    <p class="card-text">
      <ul>
        <li class="m-1"  v-if="result.Released !== 'N/A'">
          <span class="labels">Released : </span>{{result.Released}}
        </li>
        <li class="m-1"  v-if="result.Genre !== 'N/A'">
          <span class="labels">Genre : </span>{{result.Genre}}
        </li>
        <li class="m-1"  v-if="result.Type !== 'movie' && result.totalSeasons !== 'N/A'">
          <span class="labels">Total Seasons : </span>{{result.totalSeasons}}
        </li>
        <li class="m-1"  v-if="result.imdbRating !== 'N/A'">
        <span class="labels">IMDB Rating : </span>{{result.imdbRating}}
        </li>
        
        <li  class="m-1" v-if="result.Actors !== 'N/A'">
         <span class="labels">Actors : </span>{{result.Actors}}
        </li>
      </ul>
    </p>

    <button :class="auth ? 'add_playlist_btn' : 'btn btn-secondary' " :disabled='auth ? false:true' @click="setNull"
     data-toggle="modal" data-target="#PlaylistModal">Add to Playlist</button>
    <p v-if='!auth' class="text-danger my-1">
      Login to update Playlist.
    </p>
<!-- Modal -->
<div class="modal fade" id="PlaylistModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title text-info" id="exampleModalLabel">Select Playlist.</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body ">
        <p v-if="errors" class="text-danger m-1">
          {{errors}}
        </p> 
        <p v-if="success" class="text-success m-1">
          {{success}}
        </p>
        
        <div v-if=" auth && playlists && playlists.length && Save_loading === false">
          <ul class="form-list"  v-for="playlist in playlists" :key="playlist">
            <li class="text-uppercase name p-1" @click="saveToPlaylist(playlist.id,playlist.name)">{{playlist.name}} ~</li>
          </ul>
      </div>
      <div v-else-if="auth && !playlists.length && Save_loading === false">
        <h3 class="text-center text-danger m-2">Create <router-link 
         
        :to="{name : 'PlayLists'}">PlayLists</router-link>  First.</h3>
      </div>
      <div v-if="Save_loading === true">
            <h4 class="m-3 text-warning">
              <div class="spinner-border text-info" role="status">
  <span class="sr-only">Loading...</span>
</div>
            </h4>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
  </div>
</div>
    </div>
    
  </div>
  <div v-if="result && result.Error" class="text-center">
            <h1 class="text-danger">{{ result.Error}}</h1>
    </div>
  <div v-if="loading === true"  class="spinner-border text-secondary Loading" role="status">
  <span class="sr-only">Loading...</span>
</div>

</template>

<script>
import "bootstrap/dist/css/bootstrap.min.css";
import { computed, ref, watchEffect } from "vue";
import {useStore} from 'vuex'

export default {
 
  setup() {
    const blackPoster = 'https://firebasestorage.googleapis.com/v0/b/gallery-42412.appspot.com/o/black.jpg?alt=media&token=0337b361-cc53-4ce7-bb76-2a3727c8df45'
    const query = ref("");
    const type = ref("");
    const queryError = ref('')
    const store = useStore()
    const auth =  computed(()=>store.state.auth.authenticated)
   const playlists =  computed(() => store.state.playlist.playlists)
     watchEffect(()=>{
       if (auth.value) {
         
         store.dispatch('FETCH_PLAYLISTS')
       }
      
    })
    const result = computed(()=>store.state.search.result)
    
    const onSearch = async () => {
      queryError.value = ''
      if (type.value === "" && query.value === '') {
        queryError.value = "Please fill the required Fields."
      }else if(type.value === ""){
        queryError.value = "Please Select a TYPE."
      }else if(query.value === ''){
      queryError.value = "Please enter a Name before searching."
      }else {
         await store.dispatch('On_Search',{query : query.value,type : type.value})
        
         
      }
    };
    const saveToPlaylist = (id,name)=>{
      store.commit('NULL_ERROR')
      store.commit('NULL_SUCCESS_MSG')
      store.dispatch('SAVE_IN_PLAYLIST',{id,result :result.value,name})
    }
    return {queryError,
      saveToPlaylist,
      onSearch,
      result,
      type,
      playlists,
      auth ,
      query,blackPoster,
      loading : computed(()=>store.state.search.loading),
      errors : computed(()=>store.state.playlist.errors),
      success : computed(()=>store.state.playlist.succes_msg),
      Save_loading : computed(()=>store.state.playlist.loading),
      setNull : ()=>{store.commit('NULL_ERROR'),store.commit('NULL_SUCCESS_MSG')},
      
    }
  },
};
</script>

<style scoped>
.form-list{
  
  display: flex;
}
.name{
  cursor: pointer;
  color:rgb(28, 36, 36)
}
.name:hover{
  background: rgb(174, 225, 231);
  border-radius: 4px;
  color: chocolate;
}
.add_playlist_btn{
  border: transparent;
  outline: none;
  background: rgb(228, 93, 44);
  padding: 5px 10px
}
.add_playlist_btn:hover{
  border-radius: 8px;
transition-duration: 1s;
  background: rgb(233, 79, 24);
  color: rgb(152, 172, 209);
}
.labels{
  color: rgb(214, 198, 51);
}
ul{
  list-style: none;
  text-decoration: none;
}
li{
  color: aliceblue;
}
.fas {
  cursor: pointer;
  
  padding: 5px;
  font-size: 31px;
  border-radius: 8px;
  color: rgb(180, 49, 75);
  background: rgb(70, 68, 65);
}
.fas:hover {
  background-color: rgb(180, 49, 75);
  color: aquamarine;
}
.select{
  width: 110px;
}
.card-img-top{
  height: 330px;
}
.card{
  background: rgb(56, 56, 55);
}
.card-title{
  color: rgb(209, 90, 34);
  font-size: 26px;
  border-bottom: 1px solid gray;
  padding-bottom: 4px;
}
@media screen and (max-width: 992px) {
  .media {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .mediaSearch{
    margin: 5px;
  }
  .mediaIcon{
    margin: 4px auto;
  }
  .mediaMovie{
    margin: 0  auto;
    text-align: center;
  }
}
</style>
