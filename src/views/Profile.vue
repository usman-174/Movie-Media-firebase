<template>
  <div class="row" v-if="auth">
    <div class="col-md-4 text-left m-4 text-center " v-if="!Edit">
      <div class="info_form bg-danger lead">
        <h2 class="my-2 text-success">DETAILS:</h2>
        <h3>
          <span class="text-warning">Firstname</span> :
          {{ user.firstname[0].toUpperCase() + user.firstname.slice(1) }}
        </h3>
        <h3>
          <span class="text-warning">Lastname</span> :
          {{ user.lastname[0].toUpperCase() + user.lastname.slice(1) }}
        </h3>
        <h3>
          <span class="text-warning">Username</span> : {{ user.username }}
        </h3>
        <h3><span class="text-warning">Email</span> : {{ user.email }}</h3>
        <h3><span class="text-warning">Followers</span> : {{ followers }}</h3>
        <br />
        <button class="btn btn-info" @click="selectProfile">
          Edit Profile Details
        </button>
        <router-link :to="{ name: 'PlayLists' }" class="btn btn-warning mx-2">
          Vists PlayLists
        </router-link>
      </div>
    </div>
    <div class="col-md-4 text-left" v-else>
      <span v-if="user" class="m-4">
        <EditProfile :User="user" :edit="selectProfile" />
      </span>
    </div>
    <div class="col-md-4 ">
      <h3 class="mx-2 mt-3 text-danger">Profile Picture</h3>
      <img
        v-if="user.photoURL"
        :src="user.photoURL"
        alt="ProfilePic"
        class="img-fluid"
      />

      <label class="label uploadname">
        <span v-if="user.photoURL">Update DP.</span
        ><span v-else>Upload Profile Picture</span
        ><i class="fas fa-upload mx-2"></i>

        <input type="file" class="uploadProfile" @change="FileHandler" />
      </label>
      <span v-if="Picture.file">
        <h6 class="my-2  text-success ml-3">{{ Picture.fileName }}</h6>
        <button
          class="btn btn-primary ml-3"
          :class="disableBtn ? 'btn-success' : ''"
          @click="Upload"
          :disabled="disableBtn"
        >
          {{ StartUpload ? "Uploading" : "Upload" }}
        </button>
      </span>
      <div v-if="StartUpload">
        <ProgressBar :Picture="Picture" />
      </div>
      <p v-if="error" class="text-danger ">
        {{ error }}
      </p>
    </div>
  </div>
</template>

<script>
import { computed, reactive, ref, watchEffect } from "vue"
import { useStore } from "vuex"
import ProgressBar from "../components/ProgressBar"
import EditProfile from "../components/EditProfile"
export default {
  components: {
    EditProfile,
    ProgressBar,
  },
  setup(props, e) {
    const store = useStore()
    const Edit = ref(false)
    const StartUpload = ref(false)
    const Picture = reactive({})
    const error = ref()
    const disableBtn = ref(false)
    const user = computed(() => store.state.auth.user)
    watchEffect(() => {
      store.dispatch("My_Followers")
    })
    const FileHandler = (e) => {
      const types = ["image/png", "image/jpeg"]
      const selected = e.target.files[0]
      if (selected && types.includes(selected.type) && !Picture.file) {
        Picture.file = selected
        Picture.fileName = selected.name
        error.value = ""
      } else {
        Picture.file = null
        error.value = "Please select an image file (png or jpg)"
      }
    }
    const selectProfile = () => {
      Edit.value = !Edit.value
    }

    const Upload = () => {
      StartUpload.value = true
      disableBtn.value = true
    }
    return {
      Edit,
      selectProfile,
      error,
      user,
      auth: computed(() => store.state.auth.authenticated),
      followers: computed(() => store.state.auth.myFollowers),
      FileHandler,
      Picture,
      Upload,
      StartUpload,
      disableBtn,
    }
  },
}
</script>

<style>
.info_form {
  border-radius: 5px;
  padding: 5px 0;
}
.label {
  text-align: center;
  cursor: pointer;
  margin-left: 30px;
  margin-top: 20px;
  padding: 3px 0;
  display: table;
  color: #ca3855;
  font-size: 20px;
}
.label:hover {
  color: rgb(18, 155, 155);
}
.uploadProfile,
input[type="file"] {
  display: none;
}
.img-fluid {
  height: 200px;
  width: 200px;
  border-radius: 50%;
}
</style>
