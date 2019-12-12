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
      <!-- <v-card color="primary"
        :class="{'mt-n12': $vuetify.breakpoint.mdAndDown}"
        class="main-content mx-auto mt-5" width="90vw">
        <player />
        <transition name="fade">
          <router-view></router-view>
        </transition>
      </v-card> -->
      <v-container fluid>
        <v-row>
          <v-col cols="12" md="6">
            <player />
          </v-col>
          <v-col cols="12" md="6">
            <transition name="fade">
              <router-view></router-view>
            </transition>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
    <v-bottom-navigation
      app
      :value="activeBtn"
      grow
      fixed
      background-color="accent">
      <v-btn>
        <span>Home</span>
        <v-icon>home</v-icon>
      </v-btn>
      <v-btn>
        <span>Recents</span>
        <v-icon>history</v-icon>
      </v-btn>

      <v-btn>
        <span>Favorites</span>
        <v-icon>favorite</v-icon>
      </v-btn>

      <v-btn>
        <span>Upcoming</span>
        <v-icon>schedule</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Player from './components/Player.vue'
import { mapGetters } from 'vuex';

export default Vue.extend({
  name: 'App',

  components: {
    Player
  },

  data: () => ({
    activeBtn: -1,
    searchTerm: '',
    sideNav: false
  }),
  computed: {
    ...mapGetters(['user']),
    navItems() {
      let items = [
        { icon: 'library_music', title: 'Songs', link: '/songs' },
        { icon: 'lock_open', title: 'Log In', link: '/login' },
        // { icon: 'create', title: 'Sign Up', link: '/signup' }
      ]
      if (this.user) {
        items = [
          // { icon: 'chat', title: 'Posts', link: '/posts' },
          { icon: 'create', title: 'Create Post', link: '/post/add' }
        ]
      }
      return items
    },
  },
  methods: {
    toggleSideNav() {
      this.sideNav = !this.sideNav
    },
    handleSignoutUser() {
      this.$store.dispatch('signoutUser')
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
</style>