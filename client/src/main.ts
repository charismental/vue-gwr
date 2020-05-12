/* eslint-disable no-console */
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

// Moved these to the top 
import ApolloClient, { HttpLink, InMemoryCache } from 'apollo-boost';
import { setContext } from 'apollo-link-context';
import VueApollo, {} from 'vue-apollo';

// import socketio from 'socket.io-client';
// import VueSocketIO from 'vue-socket.io';

// stitch app sdk - anonymous login
const {
  Stitch,
  RemoteMongoClient,
  AnonymoustCredential,
} = require('mongodb-stitch-browser-sdk');

const APP_ID = 'gracewaystitch-hcrtu';

const client = Stitch.initializeDefaultAppClient(APP_ID);

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

// Stitch GraphQL endpoint - not sure if this and the above functions are required to exist together

const app = Stitch.hasAppClient(APP_ID) ? Stitch.getAppClient(APP_ID) : Stitch.initializeAppClient(APP_ID);

async function getAccessToken(credential) {
  if (!app.auth.user) {
    await app.auth.loginWithCredential(credential);
  } else {
    await app.auth.refreshAccessToken();
  }
  const { accessToken } = app.auth.activeUserAuthInfo;
  return accessToken;
}

const credential = new AnonymoustCredential();
const authorizationHeaderLink = setContext(async (_, { headers }) => {
  const accessToken = await getAccessToken(credential);
  return {
    headers: {
      ...headers,
      Authorization: `Bearer ${accessToken}`,
    },
  };
});

//move this line to variables?
const graphql_url = `https://us-west-2.aws.stitch.mongodb.com/api/client/v2.0/app/${APP_ID}/graphql`; 
const httpLink = new HttpLink({ uri: graphql_url });

const client = new ApolloClient({
  link: authorizationHeaderLink.concat(httpLink),
  cache: new InMemoryCache(),
});



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
