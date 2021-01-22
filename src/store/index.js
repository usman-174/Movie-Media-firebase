import { createStore } from 'vuex'

import auth from './auth'
import people from './people'
import search from './search'
import playlist from './playlist'

export default createStore({
  modules: {
    auth,playlist,
    people,search
    
  }
})
