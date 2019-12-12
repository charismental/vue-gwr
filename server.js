const { ApolloServer, AuthenticationError } = require("apollo-server");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const chokidar = require('chokidar');
const io = require('socket.io')();

// typeDefs and Resolvers
const filePath = path.join(__dirname, "typeDefs.gql");
const typeDefs = fs.readFileSync(filePath, "utf-8");
const resolvers = require("./resolvers");

// ENV variables and Mongoose Models
require("dotenv").config({ path: "variables.env" });
const User = require("./models/User");
const Song = require("./models/Song");
const SongInfo = require("./models/SongInfo");

mongoose
    .connect(process.env.MONGO_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log("Connected to MongoDB")
        SongInfo.watch()
            .on('change', () => {
                io.sockets.emit('updateSongInfo')
            })
    })
    .catch(err => console.error(err));

    const getUser = async token => {
        if (token) {
            try {
                return await jwt.verify(token, process.env.SECRET)
            } catch (err) {
                throw new AuthenticationError('Your session has ended. Please sign in again.')
            }
        }
    }

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        formatError: error => ({
            name: error.name,
            message: error.message.replace("Context creation failed:", "")
        }),
        context: async ({ req }) => {
            const token = req.headers["authorization"]
            return { User, Song, SongInfo, currentUser: await getUser(token) }
        }
    });

    server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
        console.log(`Server listening on ${url}`);
    });

    io.sockets.on('connection', socket => {
        console.log('A new connection!');
        socket.on('connected', msg => {
            console.log(msg);
        })
        socket.on('pingServer', msg => {
            console.log(msg)
        })
    })

    io.listen(3000);
    const watcher = chokidar.watch('./ftp/info.json', {
        awaitWriteFinish: {
            stabilityThreshold: 60000,
            pollInterval: 100
        }
    }).on('change', () => {
        try {
            fs.readFile('./ftp/info.json', async (err, data) => {
                if (err) {
                    console.error(err)
                }
                const current = JSON.parse(data)
                const updatedInfo = await SongInfo.replaceOne({}, current)
            })
        } catch(err) {
            console.error(err)
        }
    });