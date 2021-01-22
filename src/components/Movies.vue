<template>
  <div
    class="modal fade"
    id="MoviesModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title text-danger" id="exampleModalLabel">
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
        <div v-if="!playlist_data && fetchloading === false">
          <h2 class="text-center text-danger m-2">
            This playlist is empty.
          </h2>
        </div>
        <div
          class="modal-body text-center"
          v-if="
            playlist_data &&
              playlist_data.length &&
              fetchloading === false
              
          "
        >
          <ol class="card-text m-1">
            <span v-for="result in playlist_data" :key="result.imdbID">
              <li class="m-2 movie">
                <div class="details ">
                  <div class="m-2 type">
                    <h4>{{ result.Title }}</h4>
                    Type : {{ result.Type }} || Rating :
                    {{ result.imdbRating }}
                    <span v-if="result.Type !== 'movie'">
                      || Seasons : {{ result.totalSeasons }}
                    </span>
                  </div>
                </div>
              </li>
            </span>
          </ol>
        </div>

        <div v-if="fetchloading === true">
          LOADING
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" data-dismiss="modal">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "vue"
import { useStore } from "vuex"
export default {
  setup() {
    const store = useStore()

    return {
      playlist_data: computed(() => store.state.people.playlist_Data),
      fetchloading: computed(() => store.state.people.playlistDATALoading),
    }
  },
}
</script>

<style scoped>
.details {
  background: rgb(252, 195, 91);
  border-radius: 5px;
}
.type {
  font-size: 15px;
}
</style>
