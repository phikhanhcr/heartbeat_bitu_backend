require("dotenv").config()
import { Server } from 'socket.io';
import http from 'http';

import express from "express"
const app = express();
const PORT = process.env.PORT || 3000;

import ConnectionDb from './db/connection';
import { initApp } from './app'
import initSocket from './socket.io';


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  }
});

// like, unlike => push it to queue

ConnectionDb.connect();
initApp(app);


initSocket(io);

server.listen(PORT, () => console.log(`server is running on port ${PORT}`));
