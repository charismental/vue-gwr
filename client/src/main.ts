/* eslint-disable no-console */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

import socketio from 'socket.io-client';
import VueSocketIO from 'vue-socket.io';

import ApolloClient from 'apollo-boost'
import VueApollo from 'vue-apollo'

export const SocketInstance = socketio('https://gwradio.herokuapp.com:5325', {transports: ['websocket']});
Vue.use(VueSocketIO, SocketInstance)
Vue.use(VueApollo)
Vue.config.productionTip = false

export const defaultClient = new ApolloClient({
  uri: 'https://gwradio.herokuapp.com/graphql',
  fetchOptions: {
    credentials: 'include'
  },
  request: operation => {
    if (!localStorage.token) {
      localStorage.setItem('token', '')
    }
    operation.setContext({
      headers: {
        authorization: localStorage.getItem('token')
      }
    })
  },
  onError: ({ graphQLErrors, networkError }) => {
    if (networkError) {
      console.log('[Network Error]', networkError)
    }

    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        console.dir(err)
        if (err.name === 'AuthenticationError') {
          store.commit('SET_AUTH_ERROR', err)
          store.dispatch('signoutUser')
        }
      }
    }
  }
})

const apolloProvider = new VueApollo({ defaultClient })

new Vue({
  apolloProvider,
  router,
  store,
  vuetify,
  render: h => h(App),
  created() {
    store.dispatch('getCurrentUser')
  }
}).$mount('#app')
