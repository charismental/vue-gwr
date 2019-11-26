<template>
  <div>
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
            <v-card-title class="headline" v-text="songInfo.title"></v-card-title>
            <v-card-subtitle v-text="songInfo.artist"></v-card-subtitle>
          </v-col>

          <v-col sm="2">
            <v-avatar class="ma-1" size="100" tile>
              <v-img :src="imgUrl(songInfo)"></v-img>
            </v-avatar>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
    <!--<v-col v-for="(song, i) in songHistory.slice(0,29)" :key="i" cols="12">
      <v-card color="warning">
        <div class="d-flex flex-no-wrap justify-space-between">
          <div>
            <v-card-title class="headline" v-text="song.title"></v-card-title>

            <v-card-subtitle v-text="song.artist"></v-card-subtitle>
          </div>
          <v-avatar class="ma-1" size="125" tile>
            <v-img :src="imgUrl(song)"></v-img>
          </v-avatar>
        </div>
      </v-card>
    </v-col>-->

  </div>
</template>

<script>
import { Howl, Howler } from "howler";
import { mapGetters } from "vuex";

export default {
  name: "player",
  data() {
    return {
      isPlaying: false
    };
  },
  computed: {
    ...mapGetters(["songInfo", "songHistory", "songQueue"]),
    stream: () => {
      const streamObject = new Howl({
        src: "http://136.0.16.57:8000/.stream",
        html5: true,
        // eslint-disable-next-line no-console
        onplayerror: () => console.log("play error")
      });
      return streamObject;
    }
  },
  created() {
    this.$store.dispatch("getCurrent");
  },
  methods: {
    playStream() {
      if (!this.isPlaying) {
        this.stream.play();
        this.isPlaying = true;
      }
    },
    pauseStream() {
      if (this.isPlaying) {
        this.stream.pause();
        this.isPlaying = false;
      }
    },
    imgUrl (song) {
      const url = 'https://radiomv.org/samHTMweb/'
      if (song.picture) {
        return url + song.picture
      } else if (this.loading) {
        return url + 'loading.gif'
      } else {
        return url + 'customMissing.jpg'
      }
    }
  }
};
</script>
