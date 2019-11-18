const mongoose = require("mongoose");

const SongSchema = new mongoose.Schema({
  combine: {
    type: String
  },
  title: {
    type: String
  },
  artist: {
    type: String
  },
  album: {
    type: String
  },
  minsec: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  picture: {
    type: String
  },
  buycd: {
    type: String
  },
  songid: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  feedback: {
    likes: { type: Number, min: 0 },
    dislikes: { type: Number, min: 0 }
  }
});

//Create index to search on all fields of songs
SongSchema.index({
  "$**": "text"
});

module.exports = mongoose.model("Song", SongSchema);
