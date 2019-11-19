/* eslint-disable no-console */
import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'

import { defaultClient as ApolloClient } from '../main'
import {
  GET_CURRENT_USER,
  SIGNIN_USER,
  SIGNUP_USER, 
  GET_SONGS,
  GET_SONG
} from '../queries'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    songs: [],
    song: {},
    user: null,
    loading: false,
    error: null,
    authError: null,
    searchResults: []
  },
  mutations: {
    SET_SONGS: (state, songs) => {
      state.songs = songs
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
    song: state => state.song
  },
  modules: {
  }
})
