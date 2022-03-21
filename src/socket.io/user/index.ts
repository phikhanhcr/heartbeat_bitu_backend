import UserModel from '../../db/models/User/UserModel'
import { addUser, removeUser } from '../../utils/socketCrud'

let userSocket = io => {
  let clients = {};
  io.on('connection', socket => {

    socket.on("user-init", data => {
      addUser(clients, data._id, socket.id)
    })

    // NOTE -----------------------------------------

    // In this situation, I have 2 ways to handle this situation

    // 1. call api like what I am doing, 
    // I have 2 api for this ( like and unlike api);, socket is used for triggering an event

    // 2. no need to call api, solve it in socket when receiving an event
    // socket for handling event, and save into database


    // WAY 1

    socket.on("handle-like", data => {
      const { target_user_id } = data;

      if (clients[target_user_id]) {
        clients[target_user_id].forEach(e => {
          io.to(e).emit("response-handle-like", 1);
        });
      }
    })

    // WAY 2

    socket.on("handle-unlike", async data => {
      const { target_user_id } = data;

      if (clients[target_user_id]) {
        clients[target_user_id].forEach(e => {
          io.to(e).emit("response-handle-unlike", -1);
        });
      }
    })


    // socket.on("handle-unlike", async data => {
    //   const { target_user_id } = data;
    //   const targetUser = await UserModel.findById(target_user_id);

    //   const checkLikeOrNot = await UserModel.find({
    //     _id: target_user_id,
    //     liked_user: { $in: [socket.currentUserId] },
    //   });

    //   if (checkLikeOrNot.length > 0) {
    //     targetUser.like_count--;
    //     targetUser.liked_user = targetUser.liked_user.filter(ele => ele.toString() !== socket.currentUserId);
    //     await targetUser.save();
    //     if (clients[target_user_id]) {
    //       clients[target_user_id].forEach(e => {
    //         io.to(e).emit("response-handle-unlike", -1);
    //       });
    //     }
    //   }
    // })


    socket.on("disconnect", () => {
      removeUser(clients, socket.currentUserId, socket.id);
    })
  })
}

export default userSocket;


