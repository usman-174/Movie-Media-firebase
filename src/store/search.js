
import { db, auth } from "../FIREBASE";
import axios from 'axios'
const Init = () => {
  return {
    result : null,
    loading : null,
    errors : null
  };
};
export default {
  state: Init,
  actions: {

    async On_Search({commit},details){
      try {
        commit('SET_MOVIE_LOADING',true)
        const {query,type} = details
        const { data } = await axios.get(
          `https://www.omdbapi.com/?t=${query.toLowerCase()}&type=${type.toLowerCase()}&apikey=91ee902`
        );
        commit('SET_RESULT',data)
        commit('SET_MOVIE_LOADING',false)
      } catch (error) {
        commit('SET_SEARCH_ERROR',error.message)
        commit('SET_MOVIE_LOADING',false)
      }
    }
  },
  mutations: {
    SET_MOVIE_LOADING(state,payload) {
      state.loading = payload;
    },
    SET_RESULT(state,payload){
      state.result = payload
    },
    SET_SEARCH_ERROR(state,payload){
      state.errors = payload
    }
    
  },
};
