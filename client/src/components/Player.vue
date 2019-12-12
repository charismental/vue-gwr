<template>
  <!-- <div>
    <v-col cols="12">
      <v-card color="warning">
        <v-row>
          <v-col sm="2">
            <v-btn outlined color="white" large fab @click="playStream" v-if="!isPlaying">
              <v-icon>play_arrow</v-icon>
            </v-btn>
            <v-btn outlined color="white" large fab @click="pauseStream" v-else>
              <v-icon>pause</v-icon>
            </v-btn>
          </v-col>

          <v-col sm="8">
            <v-card-title class="headline" v-text="currentSongInfo.title"></v-card-title>
            <v-card-subtitle v-text="currentSongInfo.artist"></v-card-subtitle>
          </v-col>

          <v-col sm="2">
            <v-avatar class="ma-1" size="100" tile>
              <v-img :src="imgUrl(currentSongInfo)"></v-img>
            </v-avatar>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </div>-->
  <v-container>
    <v-layout>
      <img
        :src="imgUrl(currentSongInfo)"
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
          <v-btn text icon height="80" width="80" @click="playStream" v-if="!isPlaying">
            <v-icon size="80">play_arrow</v-icon>
          </v-btn>
          <v-btn text icon height="80" width="80" @click="pauseStream" v-else>
            <v-icon size="80">pause</v-icon>
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { Howl, Howler } from "howler"
import { mapGetters } from "vuex"

export default {
  name: "player",
  data() {
    return {
      isPlaying: false,
      isConnected: false
    }
  },
  sockets: {
    connect() {
      this.isConnected = true
    },

    disconnect() {
      this.isConnected = false
    },
    updateSongInfo() {
      this.refreshSongInfo()
    }
  },
  computed: {
    ...mapGetters(["currentSongInfo"]),
    stream: () => {
      const streamObject = new Howl({
        src: "http://136.0.16.57:8000/.stream",
        html5: true,
        // eslint-disable-next-line no-console
        onplayerror: () => console.log("play error")
      })
      return streamObject
    }
  },
  created() {
    this.$store.dispatch("getCurrentSongs")
  },
  methods: {
    refreshSongInfo() {
      this.$store.dispatch("getCurrentSongs")
      // eslint-disable-next-line no-console
      console.log("update the song info, jimmy!")
    },
    playStream() {
      if (!this.isPlaying) {
        this.stream.play()
        this.isPlaying = true
      }
    },
    pauseStream() {
      if (this.isPlaying) {
        this.stream.pause()
        this.isPlaying = false
      }
    },
    imgUrl(song) {
      const url = "https://radiomv.org/samHTMweb/"
      if (song.picture) {
        return url + song.picture
      } else if (this.loading) {
        return url + "loading.gif"
      } else {
        return url + "customMissing.jpg"
      }
    }
  }
};
</script>

<style>
.main-image {
  display: block;
  margin-left: auto;
  margin-right: auto;
  border: 2px solid white;
  border-radius: 15px;
  height: 300px;
  max-width: 300px;
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