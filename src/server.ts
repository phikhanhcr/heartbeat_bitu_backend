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
export const io = new Server(server, {
  cors: {
    origin: process.env.DOMAIN,
  }
});

// like, unlike => push it to queue
app.set("io", io);


ConnectionDb.connect();
initApp(app);


initSocket(io);

server.listen(PORT, () => console.log(`server is running on port ${PORT}`));
