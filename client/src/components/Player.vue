<template>
  <v-container>
    <v-layout class="mt-n2">
      <img
        :src="imgUrl"
        class="main-image"
        :class="{'mobile': $vuetify.breakpoint.smAndDown}"
      />
    </v-layout>
    <div class="mt-2">
      <span class="d-block text-center title">{{ currentSongInfo.title }}</span>
      <span class="d-block text-center mt-n1 subtitle-1">{{ currentSongInfo.artist }}</span>
    </div>
    <v-row align="center" class="controls">
      <v-col>
        <div class="text-center">
          <v-btn text icon height="80" width="80" @click="playPause" v-if="!isPlaying">
            <v-icon size="80">play_arrow</v-icon>
          </v-btn>
          <v-btn text icon height="80" width="80" @click="playPause" v-else>
            <v-icon size="80">pause</v-icon>
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  name: "player",
  // data() {
  //   return {
  //     isConnected: false
  //   }
  // },
  // sockets: {
  //   connect() {
  //     this.isConnected = true
  //   },

  //   disconnect() {
  //     this.isConnected = false
  //   },
  //   updateSongInfo() {
  //     this.refreshSongInfo()
  //   }
  // },
  computed: {
    ...mapGetters(["currentSongInfo", "stream", "isPlaying", "imgUrl"])
  },
  // created() {
  //   this.$store.dispatch("getCurrentSongs")
  // },
  methods: {
    // refreshSongInfo() {
    //   this.$store.dispatch("getCurrentSongs")
    //   // eslint-disable-next-line no-console
    //   console.log("update the song info, jimmy!")
    // },
    playPause() {
      this.$store.dispatch('playPause')
    }
  }
}
</script>

<style>
.main-image {
  display: block;
  margin-left: auto;
  margin-right: auto;
  border: 2px solid white;
  border-radius: 15px;
  height: 400px;
  max-width: 400px;
}
.mobile {
  height: 90vw;
  max-width: 90vw;
}
.meta-text {
  display: block !important;
  text-align: center;
}
</style>