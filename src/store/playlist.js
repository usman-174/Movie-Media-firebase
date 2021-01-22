import { db, auth } from "../FIREBASE"
import store from "../store"
import firebase from "firebase/app"
import axios from "axios"
import { v4 as uuidv4 } from "uuid"
const Init = () => {
  return {
    playlists: null,
    playlist_data: null,
    loading: null,
    Floading: null,
    errors: null,
    succes_msg: null,
  }
}
export default {
  state: Init,
  actions: {
    async CreatePlaylist({ commit }, { name }) {
      commit("SET_PLAYLIST_LOADING", true)
      let playlist = []
      const id = uuidv4()
      const userRef = db
        .collection("users")
        .doc(store.state.auth.user.uid)
        .collection("playlists")
      await userRef.doc(id).set({
        name,
        id,
      })
      const data = await userRef.get()

      if (data) {
        data.forEach(async (doc) => {
          playlist.push(doc.data())
        })
        await commit("SET_PLAYLIST", playlist)
        commit("SET_PLAYLIST_LOADING", false)
      }
    },
    async FETCH_PLAYLISTS({ commit, state }) {
      const user = store.state.auth.user
      if (user) {
        commit("SET_PLAYLIST_LOADING", true)
        let playlist = []
        const userRef = db.collection("users").doc(user.uid)
        const data = await userRef.collection("playlists").get()
  
        data.forEach(async (doc) => {
          playlist.push(doc.data())
        })
  
        await commit("SET_PLAYLIST", playlist)
        commit("SET_PLAYLIST_LOADING", false)
        
      }
    },
    async SAVE_IN_PLAYLIST({ commit, state }, details) {
      const { id, result, name } = details

      const idv4 = uuidv4()
      const userID = store.state.auth.user

      const check = await db
        .collection("users")
        .doc(userID.uid)
        .collection("playlists")
        .where("id", "==", id)
        .where("data", "array-contains", { imdbID: result.imdbID })
        .get()

      if (check.empty) {
        commit("SET_PLAYLIST_LOADING", true)
        const playlistRef = await db
          .collection("users")
          .doc(userID.uid)
          .collection("playlists")
          .doc(id)
          .update({
            data: firebase.firestore.FieldValue.arrayUnion({
              imdbID: result.imdbID,
            }),
          })
        commit("SET_SUCCESS_MSG", `Saved in ${name.toUpperCase()} Playlist.`)
        commit("SET_PLAYLIST_LOADING", false)
      } else {
        commit(
          "SET_PLAYLIST_ERROR",
          `This ${result.Type} is already in the Playlist`
        )
      }
    },
    async FETCH_MOVIES({ commit }, { id, IMDBIDS }) {
      let list = []
      commit("SET_FETCH_LOADING", true)
      const userRef = db.collection("users").doc(store.state.auth.user.uid)
      const data = userRef.collection("playlists").doc(id)
      data.onSnapshot((doc) => {
        const IDList = doc.data()
        if (IDList.data && IDList.data.length) {
          IDList.data.forEach(async (doc) => {
            const { data } = await axios.get(
              `https://www.omdbapi.com/?i=${doc.imdbID}&apikey=91ee902`
            )
            if (data.Response === "True") {
              list.push(data)
            }
            if (list.length === IMDBIDS.length) {
              await commit("SET_PLAYLIST_DATA", list)
              await commit("SET_FETCH_LOADING", false)
            }
          })
        } else {
          store.commit("NULL_PLAYLIST_DATA")
          commit("SET_FETCH_LOADING", false)
        }
      })
      await commit("SET_FETCH_LOADING", false)
    },
    async DELETE_playLISTS({ commit }, list) {
      commit("SET_PLAYLIST_LOADING", true)
      let x = []
      list.forEach(async (id) => {
        const userRef = db.collection("users").doc(store.state.auth.user.uid)
        const data = await userRef
          .collection("playlists")
          .doc(id)
          .delete()
        x.push("ppp")
        if (x.length === list.length) {
          commit("SET_PLAYLIST_LOADING", false)
          store.dispatch("FETCH_PLAYLISTS")
        }
      })
    },
    async Delete_Movies({ commit }, { id, imdbID }) {
      try {
        commit('SET_FETCH_LOADING',true)
        const userRef = db.collection("users").doc(store.state.auth.user.uid)
        const playList = userRef.collection("playlists").doc(id)
        
        await playList.update({
          data: firebase.firestore.FieldValue.arrayRemove({
            imdbID,
          }),
        })
        let list=[]
        playList.onSnapshot((doc) => {
          const IDList = doc.data()
          if (IDList.data && IDList.data.length) {
            IDList.data.forEach(async (doc) => {
              const { data } = await axios.get(
                `https://www.omdbapi.com/?i=${doc.imdbID}&apikey=91ee902`
              )
              if (data.Response === "True") {
                list.push(data)
              }
              if (list.length === IDList.data.length) {
                await commit("SET_PLAYLIST_DATA", list)
                await commit("SET_FETCH_LOADING", false)
              }
            })
          } else {
            store.commit("NULL_PLAYLIST_DATA")
            commit("SET_FETCH_LOADING", false)
          }
        })

        commit('SET_FETCH_LOADING',false)
        
      } catch (error) {
        console.log(error.message)
      }
    },
  },

  mutations: {
    SET_PLAYLIST_LOADING(state, payload) {
      state.loading = payload
    },
    SET_FETCH_LOADING(state, payload) {
      state.Floading = payload
    },
    SET_PLAYLIST(state, payload) {
      state.playlists = payload
    },
    SET_PLAYLIST_DATA(state, payload) {
      state.playlist_data = payload
    },

    SET_PLAYLIST_ERROR(state, payload) {
      state.errors = payload
    },
    NULL_ERROR(state) {
      state.errors = null
    },
    NULL_PLAYLIST_DATA(state) {
      state.playlist_data = null
    },
    SET_SUCCESS_MSG(state, payload) {
      state.succes_msg = payload
    },
    NULL_SUCCESS_MSG(state) {
      state.succes_msg = null
    },
  },
}
