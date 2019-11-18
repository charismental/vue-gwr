const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createToken= (user, secret) => {
    const { username, email } = user;
    return jwt.sign({ username, email }, secret);
};

module.exports = {
    Query: {
        getCurrentUser: async (_, args, { User, currentUser }) => {
            if (!currentUser) {
                return null;
            }
            const user = await User.findOne({ username: currentUser.username }).populate({
                path: 'favorites',
                model: 'Song'
            });
            return user;
        },
        getSongs: async (_, args, { Song }) => {
            const songs = await Song.find({})
                .sort({ artist: "asc"});
            return songs;
        },
        // getSong: async (_, { songId }, { User }) => {
        //     const song = await User.findOne({ _id: songId });
        //     return song;
        // },
        // searchSong: async (_, { searchTerm }, { Song }) => {
        //     if (searchTerm) {
        //         const searchResults = await Song.find(
        //             { $text: { $search: searchTerm }},
        //             { score: { $meta: 'textScore' } }
        //         ).sort({
        //             score: { $meta: 'textScore' },
        //             likes: 'desc'
        //         })
        //         .limit(25);
        //         return searchResults;
        //     }
        // }
    },
    Mutation: {
        // updateUser: async () => {},
        // likeSong: async () => {},
        // dislikeSong: async () => {},
        // resetSong: async () => {},
        // signinUser: async () => {},
        signupUser: async (_, { username, email, password }, { User }) => {
            const user = await User.findOne({ username });
            if (user) {
                throw new Error("User already exists");
            }
            const newUser = await new User({
                username,
                email,
                password
            }).save();
            return { token: createToken(newUser, process.env.SECRET) };
        }
    }
};