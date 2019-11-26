import axios from 'axios'

export const current = {
    state: {
        songInfo: [],
        songHistory: [],
        songQueue: [],
        loading: false
    },

    mutations: {
        SET_CURRENT (state, payload) {
            state.songInfo = payload.song_info
            state.songHistory = payload.song_history
            state.songQueue = payload.song_queue
        },
        SET_LOADING (state, bool) {
            state.loading = bool
        }
    },

    actions: {
        getCurrent ({ state, commit }) {
            const temp = state.songInfo
            axios
                .get('https://radiomv.org/samHTMweb/info.json')
                .then(({ data }) => {
                    if (!temp.title || temp.title !== data.song_info.title) {
                        commit('SET_CURRENT', data)
                    }
                })
        }
    },

    getters: {
        songInfo: state => state.songInfo,
        songHistory: state => state.songHistory,
        songQueue: state => state.songQueue
    }
}