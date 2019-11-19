<template>
  <v-app>
    <v-navigation-drawer app temporary fixed v-model="sideNav">
      <v-toolbar color="primary" dark text>
        <v-app-bar-nav-icon @click="toggleSideNav"></v-app-bar-nav-icon>
        <router-link to="/" tag="span" style="cursor: pointer">
          <h1 class="title pl-3">GraceWayRadio</h1>
        </router-link>
      </v-toolbar>

      <v-divider></v-divider>

      <v-list>
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

        <!-- Signout Button -->
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

        <router-link class="mt-1 display-1 hidden-xs-only" tag="span" to="/" style="cursor: pointer">
          GraceWayRadio
        </router-link>
      </div>

      <v-spacer></v-spacer>

      <v-app-bar-nav-icon v-if="!sideNav" @click="toggleSideNav"></v-app-bar-nav-icon>
    </v-app-bar>

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';

export default Vue.extend({
  name: 'App',

  components: {
  },

  data: () => ({
    activeBtn: 1,
    searchTerm: '',
    sideNav: false
  }),
  computed: {
    ...mapGetters(['user']),
    navItems() {
      let items = [
        { icon: 'library_music', title: 'Songs', link: '/songs' },
        { icon: 'lock_open', title: 'Sign In', link: '/signin' },
        { icon: 'create', title: 'Sign Up', link: '/signup' }
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
  background-color: #a4bcbc;
}
.v-navigation-drawer__content {
  background-color: #a4bcbc;
}
</style>