<template>
  <div>
    <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            outlined 
            color="white" 
            large 
            fab 
            @click="playStream" 
            v-if="!isPlaying">
            <v-icon>play_arrow</v-icon>
        </v-btn>
        <v-btn
            outlined 
            color="white" 
            large 
            fab 
            @click="pauseStream" 
            v-else>
            <v-icon>pause</v-icon>
        </v-btn>
    </v-card-actions>
  </div>
</template>

<script>
import { Howl, Howler } from "howler";

export default {
  name: "player",
  data() {
    return {
        isPlaying: false
    }
  },
  computed: {
      stream: () => {
        const streamObject = new Howl({
            src: 'http://136.0.16.57:8000/.stream',
            html5: true,
            // eslint-disable-next-line no-console
            onplayerror: () => console.log('play error')
        })
        return streamObject
      }
  },
  methods: {
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
    }
  }
};
</script>
