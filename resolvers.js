const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createToken = (user, secret) => {
  const { username, email } = user;
  return jwt.sign({ username, email }, secret);
};

module.exports = {
  Query: {
    getCurrentUser: async (_, args, { User, currentUser }) => {
      if (!currentUser) {
        return null;
      }
      const user = await User.findOne({
        username: currentUser.username
      }).populate({
        path: "favorites",
        model: "Song"
      });
      return user;
    },
    getCurrentSongs: async (_, args, { SongInfo }) => {
      const songInfo = await SongInfo.findOne()
      return songInfo
    },
    getSongs: async (_, args, { Song }) => {
      const songs = await Song.find({}).sort({ artist: "asc" });
      return songs;
    },
    getSong: async (_, { songId }, { Song }) => {
      const song = await Song.findOne({ _id: songId });
      return song;
    },
    searchSongs: async (_, { searchTerm }, { Song }) => {
      if (searchTerm) {
        const searchResults = await Song.find(
          { $text: { $search: searchTerm } },
          { score: { $meta: "textScore" } }
        ).sort({
          score: { $meta: "textScore" },
          likes: "desc"
        });
        // .limit(25);
        return searchResults;
      }
    }
  },
  Mutation: {
    // updateUser: async () => {},
    likeSong: async (_, { songId, username }, { Song, User }) => {
      const song = await Song.findOneAndUpdate(
        { _id: songId },
        { $inc: { "feedback.likes": 1 } },
        { new: true }
      );
      const user = await User.findOneAndUpdate(
        { username },
        { $addToSet: { favorites: songId } },
        { new: true }
      ).populate({
        path: "favorites",
        model: "Song"
      });
      return {
        likes: song.feedback.likes,
        dislikes: song.feedback.dislikes,
        favorites: user.favorites,
        disliked: user.disliked
      };
    },
    dislikeSong: async (_, { songId, username }, { Song, User }) => {
      const song = await Song.findOneAndUpdate(
        { _id: songId },
        { $inc: { "feedback.dislikes": 1 } },
        { new: true }
      );
      const user = await User.findOneAndUpdate(
        { username },
        { $addToSet: { disliked: songId } },
        { new: true }
      ).populate({
        path: "disliked",
        model: "Song"
      });
      return {
        likes: song.feedback.likes,
        dislikes: song.feedback.dislikes,
        favorites: user.favorites,
        disliked: user.disliked
      };
    },
    undislikeSong: async (_, { songId, username }, { Song, User }) => {
      const song = await Song.findOneAndUpdate(
        { _id: songId },
        { $inc: { "feedback.dislikes": -1 } },
        { new: true }
      );
      const user = await User.findOneAndUpdate(
        { username },
        { $pull: { disliked: songId } },
        { new: true }
      ).populate({
        path: "disliked",
        model: "Song"
      });
      return { dislikes: song.dislikes, disliked: user.disliked };
    },
    unlikeSong: async (_, { songId, username }, { Song, User }) => {
      const song = await Song.findOneAndUpdate(
        { _id: songId },
        { $inc: { "feedback.likes": -1 } },
        { new: true }
      );
      const user = await User.findOneAndUpdate(
        { username },
        { $pull: { favorites: songId } },
        { new: true }
      ).populate({
        path: "favorites",
        model: "Song"
      });
      return { likes: song.likes, favorites: user.favorites };
    },
    signinUser: async (_, { username, password }, { User }) => {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error("Username not found");
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error("Invalid password");
      }
      return { token: createToken(user, process.env.SECRET) };
    },
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
