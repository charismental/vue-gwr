<template>
  <v-app>
    <v-navigation-drawer
      app
      fixed
      temporary
      v-model="sideNav">
      <div v-if="!user">
        <v-toolbar
          color="primary"
          dark text>
          <v-app-bar-nav-icon @click="toggleSideNav"></v-app-bar-nav-icon>
          <router-link to="/" tag="span" style="cursor: pointer">
            <h1 class="title pl-3">GraceWayRadio</h1>
          </router-link>
        </v-toolbar>

        <v-divider></v-divider>
      </div>
      <v-list nav>
          <div v-if="user">
            <v-list-item to="/profile">
              <v-list-item-avatar>
                <v-img :src="user.avatar"></v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="title">My Profile</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
          </div>
        <v-list-item
          ripple
          v-for="(item, i) in navItems"
          :key="i"
          :to="item.link"
        >
          <v-list-item-action>
            <v-icon>
              {{ item.icon }}
            </v-icon>
          </v-list-item-action>
          <v-list-item-content>
            {{ item.title }}
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="user" @click="handleSignoutUser">
          <v-list-item-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-item-action>
          <v-list-item-content>Signout</v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      app
      color="accent"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="GraceWay Radio Logo"
          class="mr-2"
          contain
          src="@/assets/graceway.png"
          transition="scale-transition"
          width="50"
        />
        <router-link
          class="mt-1"
          :class="{
              'title': $vuetify.breakpoint.smAndDown,
              'display-1': $vuetify.breakpoint.mdAndUp
            }"
          tag="span"
          to="/"
          style="cursor: pointer">
          GraceWayRadio
        </router-link>
      </div>

      <v-spacer></v-spacer>

      <v-app-bar-nav-icon v-if="!sideNav" @click="toggleSideNav"></v-app-bar-nav-icon>
    </v-app-bar>

    <v-content>
      <v-container fluid>
        <v-row>
          <v-col cols="12" md="6" v-if="!$vuetify.breakpoint.smAndDown || $route.name === 'home'">
            <v-fade-transition mode="out-in">
              <player />
            </v-fade-transition>
          </v-col>
          <v-col cols="12" md="6" v-if="$vuetify.breakpoint.mdAndUp || $route.name !== 'home' ">
            <transition name="fade">
              <router-view></router-view>
            </transition>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
    <v-expand-transition>
      <v-footer app padless v-if="$vuetify.breakpoint.smAndDown && $route.name !== 'home'">
        <v-card
          flat
          tile
          height="100px"
          width="100%"
          class="secondary text-center"
        >
          <v-container fluid class="pa-0">
            <v-row class="ml-0" align="center">
              <v-col class="pa-0" col="3">
                <v-img
                  :src="imgUrl"
                  height="100px"
                  max-width="100px"
                >
                  </v-img>
              </v-col>
              <v-col col="8" class="pr-0">
                <div class="marquee-container">
                  <span
                    class="d-block text-left title"
                    :class="[marqueeTrigger(currentSongInfo.title, 16) ? 'marquee' : '']">{{  currentSongInfo.title }}</span>
                  <span
                    class="d-block text-left mt-n1 subtitle-1"
                    :class="[marqueeTrigger(currentSongInfo.artist, 18) ? 'marquee' : '']">{{ currentSongInfo.artist }}</span>
                </div>
              </v-col>
              <v-spacer></v-spacer>
              <v-col col="1" class="align-center pl-0 pr-7">
                <v-btn text icon height="40" width="40" @click="playPause" v-if="!isPlaying">
                  <v-icon size="40">play_arrow</v-icon>
                </v-btn>
                <v-btn text icon height="40" width="40" @click="playPause" v-else>
                  <v-icon size="40">pause</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-footer>
    </v-expand-transition>
    <v-bottom-navigation
      app
      :value="activeBtn"
      grow
      fixed
      background-color="accent">
      <v-btn to="/">
        <span>Home</span>
        <v-icon>home</v-icon>
      </v-btn>
      <v-btn to="/history">
        <span>Recents</span>
        <v-icon>history</v-icon>
      </v-btn>

      <v-btn to="/favorites">
        <span>Favorites</span>
        <v-icon>favorite</v-icon>
      </v-btn>

      <v-btn to="/upcoming">
        <span>Upcoming</span>
        <v-icon>schedule</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Player from './components/Player.vue'
// import { sockets } from 'socket.io';
import io from 'socket.io-client'
import { mapGetters } from 'vuex';

export default Vue.extend({
  name: 'App',

  components: {
    Player
  },

  data: () => ({
    // socket: io('https://gwradio.herokuapp.com:14872'),
    socket: io('localhost:4000'),
    isConnected: false,
    activeBtn: 0,
    searchTerm: '',
    sideNav: false,
    isMinimized: false
  }),
  created() {
    this.$store.dispatch("getCurrentSongs")
  },
  // sockets: {
  //   connect(): void {
  //     this.isConnected = true
  //   },
  //   disconnect(): void {
  //     this.isConnected = false
  //   },
  // },
  computed: {
    ...mapGetters(['user', 'currentSongInfo', 'loading', 'isPlaying', 'imgUrl']),
    navItems() {
      let items = [
        { icon: 'library_music', title: 'Songs', link: '/songs' },
        { icon: 'lock_open', title: 'Log In', link: '/login' },
        // { icon: 'create', title: 'Sign Up', link: '/signup' }
      ]
      if (this.user) {
        items = [
          // { icon: 'chat', title: 'Posts', link: '/posts' },
          { icon: 'create', title: 'Placeholder link', link: '/post/add' }
        ]
      }
      return items
    },
  },
  mounted() {
    this.socket.on('updateSongInfo', () => {
      this.refreshSongInfo()
    })
  },
  methods: {
    async refreshSongInfo() {
      function timeout(ms): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
      await timeout(13000)
      this.$store.dispatch("getCurrentSongs")
      // eslint-disable-next-line no-console
      console.log("update the song info, jimmy!")
    },
    playPause() {
      this.$store.dispatch('playPause')
    },
    toggleSideNav() {
      this.sideNav = !this.sideNav
    },
    handleSignoutUser() {
      this.$store.dispatch('signoutUser')
    },
    marqueeTrigger (el, val) {
      return !!(el && el.length > val)
    }
  }
});
</script>

<style>
#app {
  /* background-color: #a4bcbc; */
  background: linear-gradient(to bottom left, #4c3f77, #051126);
}
.v-navigation-drawer__content {
  background-color: #a4bcbc;
}
.fade-enter-active,
.fade-leave-active {
  transition-property: opacity;
  transition-duration: 0.25s;
}

.fade-enter-active {
  transition-delay: 0.25s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
.main-content {
    border-radius: 20px !important;
    background: linear-gradient(to bottom right, #7c587f, #4c3f77);
}
@keyframes marquee {
  0% { transform: translateX(100%) }
  100% { transform: translateX(-130%) }
}
@-webkit-keyframes marquee {
  0% { transform: translateX(100%) }
  100% { transform: translateX(-130%) }
}
.marquee-container {
  overflow: hidden;
  width: 150px;
}
.marquee {
  white-space: nowrap;
  animation: marquee 8s linear infinite;
  -webkit-animation: marquee 8s linear infinite;
}
.marquee:hover {
  -webkit-animation-play-state: paused;
  animation-play-state: paused;
}
</style>