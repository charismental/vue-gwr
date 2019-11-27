const mongoose = require("mongoose");

const SongInfoSchema = new mongoose.Schema({
  song_info: {
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
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    genre: {
      type: String
    }
  },
  song_history: [
    {
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
        type: String,
        required: true
      },
      type: {
        type: String,
        required: true
      },
      genre: {
        type: String
      }
    }
  ],
  song_queue: [
    {
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
        type: String,
        required: true
      },
      type: {
        type: String,
        required: true
      },
      genre: {
        type: String
      }
    }
  ]
});

module.exports = mongoose.model("SongInfo", SongInfoSchema);
