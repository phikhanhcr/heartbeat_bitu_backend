import userSocket from "./user";

let initSocket = io => {

  io.use((socket, next) => {
    const currentUserId = socket.handshake.auth._id;
    if (!currentUserId) {
      return next(new Error("invalid userId"));
    }
    socket.currentUserId = currentUserId;
    next();
  });

  
  userSocket(io);
  
}

export default initSocket;