import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        dark: true,
        themes: {
            dark: {
                primary: '#007f97',
                secondary: '#a4bcbc',
                accent: '#7c587f',
                info: '#4c3f77',
                warning: '#051126'
                // error: '',
                // success: ''
            }
        }
    }
});
