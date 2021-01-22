import { db, auth } from "../FIREBASE"
import router from "../router"
const initialState = () => {
  return {
    loading: null,
    authenticated: null,
    user: null,
    errors: null,
    myFollowers: 0,
  }
}
export default {
  state: initialState,
  actions: {
    async LOGIN({ commit, state }, data) {
      try {
        if (!data.email || !data.password) {
          commit("Set_Error", "Please fill the required fields.")
        } else {
          const User = await auth.signInWithEmailAndPassword(
            data.email,
            data.password
          )
          commit("START_LOADING")
          if (User) {
            const storeUser = db.collection("users").doc(User.user.uid)
            storeUser.onSnapshot((doc) => {
              const data = doc.data()
              commit("LOGIN", data)
            })
          }
          commit("STOP_LOADING")
        }
      } catch (error) {
        
        commit("Set_Error", error.message)
        commit("STOP_LOADING")
      }
    },
    async REGISTER({ commit, state }, data) {
      const {
        email,
        username,
        password,
        age,
        gender,
        Cpassword,
        firstname,
        lastname,
      } = data
      try {
        if (password !== Cpassword) {
          commit("Set_Error", "Passwords Must Match")
        } else if (!firstname || !lastname || !gender || !username) {
          commit("Set_Error", "Fill all the required fields")
        } else if (firstname.length <= 3 || lastname.length <= 3) {
          commit(
            "Set_Error",
            "Firstname and Lastname length must be 4 characters long."
          )
        } else {
          const User = await auth.createUserWithEmailAndPassword(
            email,
            password
          )
          commit("START_LOADING")
          if (!User) return alert("Reigistration failed")
          await User.user.updateProfile({ displayName: username })
          await db
            .collection("users")
            .doc(User.user.uid)
            .set({
              username,
              email,
              uid: User.user.uid,
              age,
              firstname,
              lastname,
              gender,
              phoneNumber: User.user.phoneNumber,
              registrationDate: new Date(),
            })
          const storeUser = db.collection("users").doc(User.user.uid)
          storeUser.onSnapshot(async (doc) => {
            const data = doc.data()

            commit("REGISTER", data)
          })
          commit("STOP_LOADING")
        }
      } catch (error) {
        
        
        commit("Set_Error", error.message)
        commit("STOP_LOADING")
      }
    },
    async CheckUserStatus({ commit }) {
      auth.onAuthStateChanged(async (inUser) => {
        commit("START_LOADING")
        if (inUser) {
          const storeUser = db.collection("users").doc(inUser.uid)
          storeUser.onSnapshot((doc) => {
            const data = doc.data()
            commit("CheckUserStatus", data)
          })
          // commit("STOP_LOADING");
        } else {
          commit("NoUser")
          //  commit("STOP_LOADING");
        }
        commit("STOP_LOADING")
      })
    },
    async SignOut({ commit }) {
      commit("NoUser")
    },
    async UpdateProfile({ commit, state }, data) {
      try {
        const { email, username, uid, phoneNumber, firstname, lastname } = data

        commit("START_LOADING")
        const User = auth.currentUser
        await User.updateProfile({ displayName: username })
        await User.updateEmail(email)
        const storeUser = db.collection("users").doc(uid)
        await storeUser.update({
          username,
          email,
          phoneNumber: phoneNumber ? phoneNumber : null,
          firstname,
          lastname,
        })
        storeUser.onSnapshot(async (doc) => {
          const data = doc.data()

          commit("UpdateProfile", data)
          commit("STOP_LOADING")
        })
      } catch (error) {
        
        state.errors = error.message
        commit("STOP_LOADING")
      }
    },

    async uploadProfile({ commit, state }, url) {
      commit("START_LOADING")
      const User = auth.currentUser
      User.updateProfile({ photoURL: url })
      await db
        .collection("users")
        .doc(User.uid)
        .update({
          photoURL: url,
        })
      commit("STOP_LOADING")
    },
    async My_Followers({ commit, state }) {
      if (state.user && state.authenticated) {
        const Ref = await db
          .collection("followers")
          .doc(state.user.uid)
          .get()
        const data = Ref.data()
        if (data && data.followers.length) {
          commit("set_my_followers", data.followers.length)
        } else {
          commit("null_my_followers")
        }
      }
    },
  },

  mutations: {
    START_LOADING(state) {
      state.loading = true
    },
    Reset_Error(state) {
      state.errors = null
    },
    Set_Error(state, payload) {
      state.errors = payload
    },
    STOP_LOADING(state) {
      state.loading = false
    },
    NoUser(state) {
      state.authenticated = false
      state.user = null
      state.errors = null
    },
    LOGIN(state, payload) {
      state.authenticated = true
      state.user = payload
      router.push({ name: "SearchData" })
    },
    REGISTER(state, payload) {
      state.authenticated = true
      state.user = payload
      router.push({ name: "SearchData" })
    },
    CheckUserStatus(state, payload) {
      state.authenticated = true
      state.user = payload
    },

    UpdateProfile(state, payload) {
      state.user = payload
    },
    set_my_followers(state, payload) {
      state.myFollowers = payload
    },
    null_my_followers(state) {
      state.myFollowers = 0
    },
  },
}
