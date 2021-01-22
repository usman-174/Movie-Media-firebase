import { db, auth } from "../FIREBASE"
import firebase from "firebase/app"
import store from "../store"
import axios from 'axios'
const Init = () => {
  return {
    loading: null,
    peoples: [],
    playlistLoading: null,
    playlistDATALoading : null,
    playlist_Data : null,
    peoplePlaylist: null,
    singlePeople: null,
    followStatus: null,
    errors: null,
    totalFollowers: 0,
  }
}
export default {
  state: Init,
  actions: {
    async Query_SEARCH_PEOPLE({ commit }, query) {
      commit("SET_LOADING", true)
      let result = []
      const FireUser = db.collection("users")
      const data = await FireUser.where("username", "==", query).get()
      if (data) {
        data.forEach(async (doc) => {
          result.push(doc.data())
        })

        await commit("SET_PEOPLE", result)

        commit("SET_LOADING", false)
      }
    },
    async Load_people({ commit }) {
      commit("SET_LOADING", true)
      let result = []
      const FireUser = db.collection("users")
      const data = await FireUser.get()
      if (data) {
        data.forEach(async (doc) => {
          result.push(doc.data())
        })

        await commit("SET_PEOPLE", result)

        commit("SET_LOADING", false)
      }
    },
    async Show_profile({ commit }, uid) {
      const usersRef = db.collection("users").doc(uid)
      commit("SET_LOADING", true)
      usersRef.onSnapshot((doc) => {
        const data = doc.data()

        commit("SET_SINGLE_PROFILE", data)
        commit("SET_LOADING", false)
      })
    },
    async Follow_people({ commit, state }, { to, from }) {
      if (state.followStatus === false) {
        const Check = db
          .collection("followers")
          .doc(to.uid)
          .get()
        const toRef = db.collection("followers").doc(to.uid)
        const chek = (await Check).exists

        chek
          ? toRef.update({
              uid: to.uid,
              followers: firebase.firestore.FieldValue.arrayUnion({
                uid: from.uid,
                name: from.username,
              }),
            })
          : toRef.set({
              uid: to.uid,
              username: to.username,
              followers: firebase.firestore.FieldValue.arrayUnion({
                uid: from.uid,
                name: from.username,
              }),
            })
        await commit("SET_FOLLOW_STATUS", true)
        const check = await db
          .collection("followers")
          .doc(to.uid)
          .get()
        const data = check.data()
        if (data && data.followers.length) {
          data.followers.length
          commit("SET_TOTAL_FOLLOWERS", data.followers.length)
        }
      } else {
        
      }
    },
    async Unfollow_people({ commit, state }, { to, from }) {
      if (state.followStatus === true) {
        const toRef = db.collection("followers").doc(to.uid)
        toRef.update({
          followers: firebase.firestore.FieldValue.arrayRemove({
            uid: from.uid,
            name: from.username,
          }),
        })

        store.dispatch("Check_follow", { to, from })
      }
    },
    async Check_follow({ commit, state }, { to, from }) {
      let userDoc = []

      const check = await db
        .collection("followers")
        .doc(to.uid)
        .get()
      commit("SET_LOADING", true)
      if (check.data()) {
        const data = check.data()
        if (data.followers.length) {
          data.followers.length
          commit("SET_TOTAL_FOLLOWERS", data.followers.length)
          const exists = data.followers.find((doc) => doc.uid === from.uid)
          if (exists) {
            commit("SET_FOLLOW_STATUS", true)
          } else {
            commit("SET_FOLLOW_STATUS", false)
          }
        } else {
          commit("NULL_TOTAL_FOLLOWERS")
          commit("SET_FOLLOW_STATUS", false)
        }
      } else {
        commit("NULL_TOTAL_FOLLOWERS")
        commit("SET_FOLLOW_STATUS", false)
      }
      commit("SET_LOADING", false)
    },
    async People_playlist({ commit, state }, ID) {
      commit("SET_PLAYLIST_LOADING", true)

      let playlist = []
      const userRef = db.collection("users").doc(ID)

      const data = await userRef.collection("playlists").get()
      data.forEach(async (doc) => {
        playlist.push(doc.data())
      })
      await commit("SET_PEOPLE_PLAYLIST", playlist)
      commit("SET_PLAYLIST_LOADING", false)
    },
    async FETCH_PEOPLE_PLAYLIST_DATA({ commit }, { id, IMDBIDS }) {
      let list = []
      commit("SET_PLAYLIST_DATA_LOADING", true)
      if (IMDBIDS.length) {
        await IMDBIDS.forEach(async (doc) => {
          const { data } = await axios.get(
            `http://www.omdbapi.com/?i=${doc.imdbID}&apikey=91ee902`
          )
          if (data.Response === "True") {
            list.push(data)
          }
          if (list.length === IMDBIDS.length) {
            await commit("SET_PLAYLIST_MOVIES", list)
            await commit("SET_PLAYLIST_DATA_LOADING", false)
          }
          await commit("SET_PLAYLIST_DATA_LOADING", false)
        })
      }
      commit('NULL_PLAYLIST_MOVIES')
      await commit("SET_PLAYLIST_DATA_LOADING", false)
    },
    
  },
  mutations: {
    SET_PEOPLE_PLAYLIST(state, payload) {
      state.peoplePlaylist = payload
    },
    SET_FOLLOW_STATUS(state, payload) {
      state.followStatus = payload
    },
    SET_LOADING(state, payload) {
      state.loading = payload
    },
    SET_PLAYLIST_LOADING(state, payload) {
      state.playlistLoading = payload
    }, 
    SET_PLAYLIST_DATA_LOADING(state, payload) {
      state.playlistDATALoading = payload
    },
    SET_PLAYLIST_MOVIES(state, payload) {
      state.playlist_Data = payload
    }, 
     NULL_PLAYLIST_MOVIES(state, payload) {
      state.playlist_Data = null
    },

    SET_PEOPLE(state, people) {
      state.peoples = people
    },
    SET_SINGLE_PROFILE(state, payload) {
      state.singlePeople = payload
    },
    SET_TOTAL_FOLLOWERS(state, payload) {
      state.totalFollowers = payload
    },
    NULL_TOTAL_FOLLOWERS(state) {
      state.totalFollowers = 0
    },
  },
}
