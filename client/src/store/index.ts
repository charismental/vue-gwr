/* eslint-disable no-console */
import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'
import { Howl, Howler } from "howler"
import { defaultClient as ApolloClient } from '../main'


import {
  GET_CURRENT_USER,
  SIGNIN_USER,
  SIGNUP_USER, 
  GET_SONGS,
  GET_SONG,
  GET_CURRENT_SONGS
} from '../queries'

// import { current } from './current.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    songs: [],
    currentSongInfo: {},
    currentSongHistory: [],
    currentSongQueue: [],
    song: {},
    user: null,
    loading: false,
    error: null,
    authError: null,
    searchResults: [],
    isPlaying: false,
    hqStream: "http://136.0.16.57:8000/.stream"
  },
  mutations: {
    SET_IS_PLAYING: (state, bool) => {
      state.isPlaying = bool
    },
    SET_SONGS: (state, songs) => {
      state.songs = songs
    },
    SET_CURRENT_SONG_INFO: (state, song) => {
      state.currentSongInfo = song
    },
    SET_CURRENT_SONG_HISTORY: (state, songs) => {
      state.currentSongHistory = songs
    },
    SET_CURRENT_SONG_QUEUE: (state, songs) => {
      state.currentSongQueue = songs
    },
    SET_SONG: (state, song) => {
      state.song = song
    },
    SET_ERROR: (state, error) => {
      state.error = error
    },
    SET_AUTH_ERROR: (state, authError) => {
      state.authError = authError
    },
    SET_USER: (state, user) => {
      state.user = user
    },
    CLEAR_USER: state => state.user = null,
    CLEAR_ERROR: state => state.error = null,
    SET_LOADING: (state, bool) => {
      state.loading = bool
    }
  },
  actions: {
    playPause: ({ commit, state, getters }) => {
      if (!state.isPlaying) {
        getters.stream.play()
        commit('SET_IS_PLAYING', true)
      } else {
        getters.stream.pause()
        commit('SET_IS_PLAYING', false)
      }
    },
    getCurrentUser: ({ commit }) => {
      commit('SET_LOADING', true)
      ApolloClient
        .query({
          query: GET_CURRENT_USER
        })
        .then(({ data }) => {
          commit('SET_LOADING', false)
          commit('SET_USER', data.getCurrentUser)
        })
        .catch(err => {
          commit('SET_LOADING', false)
          console.error(err)
        })
    },
    signinUser: ({ commit }, formData) => {
      commit('CLEAR_ERROR')
      commit('SET_LOADING', true)

      ApolloClient
        .mutate({
          mutation: SIGNIN_USER,
          variables: formData
        })
        .then(({ data }) => {
          commit('SET_LOADING', false)
          localStorage.setItem('token', data.signinUser.token)
          router.go(0)
        })
        .catch(err => {
          commit('SET_LOADING', false)
          commit('SET_ERROR', err)
        })
    },
    signupUser: ({ commit }, formData) => {
      commit('CLEAR_ERROR')
      commit('SET_LOADING', true)
      ApolloClient
        .mutate({
          mutation: SIGNUP_USER,
          variables: {
            email: formData.email,
            password: formData.password,
            username: formData.username
          }
        })
        .then(({ data }) => {
          commit('SET_LOADING', false)
          localStorage.setItem('token', data.signupUser.token)
          router.go(0)
        })
        .catch(err => {
          commit('SET_LOADING', false)
          commit('SET_ERROR', err)
        })
    },
    signoutUser: async ({ commit }) => {
      commit('CLEAR_USER')
      localStorage.setItem('token', '')
      await ApolloClient.resetStore()
      if (router.currentRoute.path !== '/') {
        router.push('/')
      }
    },
    getCurrentSongs: async ({ commit }) => {
      commit('SET_LOADING', true)
      ApolloClient
        .query({
          query: GET_CURRENT_SONGS,
          fetchPolicy:'no-cache'
        })
        .then(({ data }) => {
          commit('SET_CURRENT_SONG_INFO', data.getCurrentSongs.song_info)
          commit('SET_CURRENT_SONG_HISTORY', data.getCurrentSongs.song_history)
          commit('SET_CURRENT_SONG_QUEUE', data.getCurrentSongs.song_queue)
          commit('SET_LOADING', false)
        })
        .catch(err => {
          commit('SET_LOADING', false)
          console.error(err)
        })
    },
    getSongs: async ({ commit }) => {
      commit('SET_LOADING', true)
      ApolloClient
        .query({
          query: GET_SONGS
        })
        .then(({ data }) => {
          commit('SET_SONGS', data.getSongs)
          commit('SET_LOADING', false)
        })
        .catch(err => {
          commit('SET_LOADING', false)
          console.error(err)
        })
    },
    getSong: async ({ commit }, songId) => {
      commit('SET_LOADING', true)
      ApolloClient
        .query({
          query: GET_SONG,
          variables: songId
        })
        .then(({ data }) => {
          commit('SET_LOADING', false)
          commit('SET_SONG', data.getSong)
        })
        .catch(err => {
          commit('SET_LOADING', false)
          console.error(err)
        })
    }
  },
  getters: {
    songs: state => state.songs,
    searchResults: state => state.searchResults,
    loading: state => state.loading,
    user: state => state.user,
    authError: state => state.authError,
    error: state => state.error,
    song: state => state.song,
    currentSongInfo: state => state.currentSongInfo,
    currentSongHistory: state => state.currentSongHistory,
    currentSongQueue: state => state.currentSongQueue,
    isPlaying: state => state.isPlaying,
    stream: state => {
      const streamObject = new Howl({
        src: state.hqStream,
        html5: true,
        onplayerror: () => console.log("play error")
      })
      return streamObject
    },
    imgUrl: (state, getters) => {
      const url = "https://radiomv.org/samHTMweb/"
      if (getters.currentSongInfo.picture) {
        return url + getters.currentSongInfo.picture
      } else if (state.loading) {
        return url + "loading.gif"
      } else {
        return url + "customMissing.jpg"
      }
    }
  },
  modules: {
  }
})
