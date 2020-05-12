/* eslint-disable no-console */
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

// import socketio from 'socket.io-client';
// import VueSocketIO from 'vue-socket.io';

// stitch app sdk - anonymous login
const {
  Stitch,
  RemoteMongoClient,
  AnonymoustCredential,
} = require('mongodb-stitch-browser-sdk');

const client = Stitch.initializeDefaultAppClient('gracewaystitch-hcrtu');

const db = client
  .getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas')
  .db('test');

client.auth
  .loginWithCredential(new AnonymoustCredential())
  .then((user) =>
    db
      .collection('users')
      .updateOne(
        { owner_id: client.auth.user.id },
        { $set: { number: 50 } },
        { upsert: true }
      )
  )
  .then((docs) => {
    console.log('found docs', docs);
    console.log('[Mongodb Stitch] Connected to Stitch');
  })
  .catch((err) => {
    console.error(err);
  });

import ApolloClient from 'apollo-boost';
import VueApollo from 'vue-apollo';

// export const SocketInstance = socketio('https://gwradio.herokuapp.com:14872', {transports: ['websocket']});
// export const SocketInstance = socketio('http://localhost:4000', {transports: ['websocket']});
// Vue.use(VueSocketIO as any, SocketInstance)
Vue.use(VueApollo);
Vue.config.productionTip = false;

export const defaultClient = new ApolloClient({
  uri: 'https://gwradio.herokuapp.com/graphql',
  fetchOptions: {
    credentials: 'include',
  },
  request: (operation) => {
    if (!localStorage.token) {
      localStorage.setItem('token', '');
    }
    operation.setContext({
      headers: {
        authorization: localStorage.getItem('token'),
      },
    });
  },
  onError: ({ graphQLErrors, networkError }) => {
    if (networkError) {
      console.log('[Network Error]', networkError);
    }

    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        console.dir(err);
        if (err.name === 'AuthenticationError') {
          store.commit('SET_AUTH_ERROR', err);
          store.dispatch('signoutUser');
        }
      }
    }
  },
});

const apolloProvider = new VueApollo({ defaultClient });

new Vue({
  apolloProvider,
  router,
  store,
  vuetify,
  render: (h) => h(App),
  created() {
    store.dispatch('getCurrentUser');
  },
}).$mount('#app');
