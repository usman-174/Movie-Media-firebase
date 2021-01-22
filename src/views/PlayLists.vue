<template>
  <div v-if="loading === true"  class="spinner-border text-success Loading" role="status">
  <span class="sr-only">Loading...</span>
</div>
  <div v-if="loading === false">
    <div class="row">
      <div class="col-12">
        <h1 class="text-center title m-3">PLAYLISTS</h1>
      </div>
      <div class="col-4 offset-1">
        <div class="m-2 d-flex">
          <h3 class="heading text-uppercase">Create playlist</h3>
          <i class="far fa-plus-square" @click="showModal"></i>
        </div>
      </div>
    </div>
    <div class="row mx-4" v-if="show_modal">
      <div class="col-4 offset-1 my-2">
        <div class="m-2 ">
          <input
            type="text"
            class="form-control w-auto"
            v-model="playlist_name"
            placeholder="Playlist Name"
          />
          <p v-if="err" class="text-danger">
            {{ err }}
          </p>
        </div>
        <div class="btns m-2">

        <button class="btn btn-success ml-3 mt-2" @click="Create">Save</button>
        <button class="btn btn-secondary ml-3 mt-2" @click="showModal">
          Cancel
        </button>
        </div>
      </div>
    </div>
    <br />
    <br />
    <br />
    <div class="row mx-4" v-if="loading === false">
      <div class="col-3 offset-1">
        <div
          class="playlist_wrapper p-2 "
          v-if="playlists && playlists.length && !delete_playlist"
        >
          <ul
            class="list d-inline"
            v-for="playlist in playlists"
            :key="playlist"
          >
            <li
              class="text-uppercase m-2 list_option"
              @click="FetchMovies(playlist.id, playlist.data)"
            >
              <p class="p-1 name" data-toggle="modal" data-target="#exampleModal">
                {{ playlist.name }}
              </p>
            </li>
            <!-- Modal -->
            <div
              class="modal fade"
              id="exampleModal"
              tabindex="-1"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title text-info" id="exampleModalLabel">
                      Movies / TV in the playlist.
                    </h5>
                    <button
                      type="button"
                      class="close"
                      data-dismiss="modal"
                      aria-label="Close"
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>

                  <div
                    class="modal-body"
                    v-if="
                      playlist_data &&
                        playlist_data.length &&
                        fetchloading === false
                    "
                  >
                    <ol class=" m-1">
                      <span
                        v-for="result in playlist_data"
                        :key="result.imdbID"
                      >
                        <li class="m-2 movie">
                          <div class="details ">
                            <div class="m-2 type">
                              <h4>{{ result.Title }}</h4>
                              Type : {{ result.Type }} || Rating :
                              {{ result.imdbRating }}
                              <span v-if="result.Type !== 'movie'">
                                || Seasons : {{ result.totalSeasons }}
                              </span>
                              <i
                                class="fas fa-trash mx-2 btn remove"
                                @click="remove(playlist.id, result.imdbID)"
                              ></i>
                            </div>
                          </div>
                        </li>
                      </span>
                    </ol>
                  </div>
                  <div
                    v-else-if="
                      (!playlist_data && fetchloading === false) ||
                        !playlist.data
                    "
                  >
                    <h2 class="text-center text-danger m-2">
                      This playlist is empty.
                    </h2>
                  </div>

                  <div v-if="fetchloading === true">
                    <div class="spinner-border text-primary" role="status">
                      <span class="sr-only">Loading...</span>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button
                      type="button"
                      class="btn btn-danger"
                      data-dismiss="modal"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </ul>
        </div>
        <div
          v-else-if="playlists && playlists.length && delete_playlist"
          class="delete_wrapper my-2 mx-auto"
        >
          <ul class="list-group bg-light">
            <li
              v-for="playlist in playlists"
              :key="playlist.id"
              class="list-group-item w-auto"
            >
              <div class="form-check">
                <input
                  type="checkbox"
                  class="form-check-input"
                  v-model="delete_selected"
                  :value="playlist.id"
                />
                <label
                  class="form-check-label font-weight-bold text-uppercase"
                  :class="
                    delete_selected.find((id) => id === playlist.id)
                      ? 'text-danger'
                      : 'text-dark'
                  "
                  >{{ playlist.name }}</label
                >
              </div>
            </li>
          </ul>
        </div>
        <button
          class="btn del_btn my-3 "
          v-if="playlists && playlists.length"
          :class="
            delete_selected.length
              ? 'btn-danger'
              : delete_playlist
              ? 'btn-dark'
              : 'btn-warning'
          "
          @click="toggle_del"
        >
          <span v-if="delete_selected.length" @click="Delete_PLAYLISTS">
            Delete Selected <i class="fas fa-trash mx-2"></i>
          </span>
          <span v-else>
            <span v-if="delete_playlist">Cancel</span>
            <span v-else>Delete Playlists</span>
            <i class="fas fa-trash mx-2"></i>
          </span>
        </button>
      </div>
    </div>
    <div v-if="!playlists.length && !loading">
      <div class="row">
        <div class="col-6 offset-3 text-center">
          <h1 class="text-warning">You don't have any Playlists.</h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex"
import { computed, watchEffect, ref, reactive } from "vue"
export default {
  setup() {
    const store = useStore()
    const playlist_data = computed(() => store.state.playlist.playlist_data)
    watchEffect(() => {
      store.dispatch("FETCH_PLAYLISTS")
    })
    const delete_playlist = ref(false)
    const delete_selected = ref([])
    const toggle_del = () => {
      delete_selected.value = []
      delete_playlist.value = !delete_playlist.value
    }
    const Delete_PLAYLISTS = () => {
      if (delete_selected.value.length) {
        store.dispatch("DELETE_playLISTS", delete_selected.value)
      }
    }
    const playlist_name = ref("")

    const showPlayList = ref(false)
    const playlists = computed(() => store.state.playlist.playlists)

    const err = ref("")
    const show_modal = ref(false)
    const showModal = () => {
      show_modal.value = !show_modal.value
    }
    const Create = async () => {
      if (playlist_name.value.length < 3) {
        err.value = "PlayList name must be atleast 3 characters long."
      } else {
        err.value = ""
        store.dispatch("CreatePlaylist", {
          name: playlist_name.value,
        })
        playlist_name.value = ""
        show_modal.value = !show_modal.value
      }
    }
    const FetchMovies = async (id, IMDBIDS) => {
      if (IMDBIDS) {
        
        await store.dispatch("FETCH_MOVIES", { id, IMDBIDS })
      }
    }
    const remove = (id, imdbID) => {
      store.dispatch("Delete_Movies", { id, imdbID })
    }
    return {
      Create,
      remove,
      showModal,
      delete_playlist,
      toggle_del,
      delete_selected,
      FetchMovies,
      playlist_name,
      show_modal,
      Delete_PLAYLISTS,
      fetchloading: computed(() => store.state.playlist.Floading),
      loading: computed(() => store.state.playlist.loading),
      playlists,
      playlist_data,
      err,
    }
  },
}
</script>

<style scoped>
.title{
  color: #CA3855;
}
.form-check-input {
  cursor: pointer;
}
.details {
  background: rgb(252, 195, 91);
  border-radius: 5px;
}
.type {
  font-size: 15px;
}
.far {
  margin: 0 7px;
  cursor: pointer;
  font-size: 40px;
  padding: 7px;
  color: rgb(212, 83, 83);
}
.far:hover {
  background: rgb(212, 83, 83);
  border-radius: 50%;
  color: rgb(47, 187, 223);
}
.heading {
  border-bottom: 1px solid gray;
  margin-top: 8px;
}
.remove {
  margin: 3px 7px;
  border-radius: 10px;
  background: rgb(189, 47, 47);
}
.remove:hover {
  background: rgb(27, 168, 168);
}
.playlist_wrapper{
  width: 100%;
  border-top: 3px solid rgba(233, 23, 23, 0.6);
  border-bottom: 3px solid rgba(207, 50, 50, 0.6);
}
.playlist_wrapper .name {
  width: 100%;
  color: rgb(237, 240, 243);
  border-radius: 5px;
  background: rgb(192, 131, 131);
  border: 2px solid rgb(95, 90, 90);
  border-bottom: none;
}
.playlist_wrapper .name:hover{
  color:rgb(47, 187, 223);
}
.list,
.list_option {
  font-size: 22px;
  text-align: center;
  list-style: none;
  text-decoration: none;
}
.list_option {
  cursor: pointer;
  
}
@media screen and (max-width: 754px) {
 .btns{
   display: flex;
   justify-content: center;
   align-items: center;
   margin :5px 30px
 }
 .playlist_wrapper .name {
   color: rgb(65, 57, 57);
   border: none;
  background: none
  }
  .playlist_wrapper .name:hover{
    color :rgb(177, 47, 47)
  }
  .list-group , .list-group-item{
    list-style: none;
    border: none;
    outline: none;
    text-decoration: none;
  }

  }

</style>
