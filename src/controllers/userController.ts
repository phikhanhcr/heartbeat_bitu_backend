
import UserModel from '../db/models/User/UserModel';
import initSocket from '../socket.io'
import { clients } from '../socket.io/user';
class User {

  public getListUser = async (req, res) => {
    let page = req.params.page || 1;
    let perPage = 10;
    const userId = req.user;
    const users = await UserModel
      .find({ _id: { $ne: userId } })
      // .skip((perPage * page) - perPage)
      // .limit(perPage);
      // have an error on the client side, don't know how to fix it so I have not done the pagination

    return res.status(200).json({ data: users });
  };

  public likeAction = async (req, res) => {
    // initSocket
    const userId = req.user;
    const { target_user_id } = req.body;

    const targetUser = await UserModel.find({
      _id: target_user_id,
      liked_user: { $in: [userId] },
    });

    if (targetUser.length > 0) {
      return res.status(400).json({ msg: "You liked this user." });
    } else {

      const checkUser = await UserModel.findById(target_user_id)
      checkUser.like_count++;
      checkUser.liked_user.push(userId);
      await checkUser.save();

      if (clients[target_user_id]) {
        clients[target_user_id].forEach(e => {
          req.app.settings.io.to(e).emit("response-handle-like", 1);
        });
      }


      return res.status(200).json({ msg: "oke", action: "like" });
    }
  };

  public unLikeAction = async (req, res) => {

    const userId = req.user;
    const { target_user_id } = req.body;
    // const targetUser = await UserModel.findById(target_user_id);

    const targetUser = await UserModel.find({
      _id: target_user_id,
      liked_user: { $in: [userId] },
    });
    if (targetUser.length > 0) {

      targetUser[0].like_count--;
      targetUser[0].liked_user = targetUser[0].liked_user.filter(ele => ele.toString() !== userId);
      await targetUser[0].save();


      if (clients[target_user_id]) {
        clients[target_user_id].forEach(e => {
          req.app.settings.io.to(e).emit("response-handle-unlike", -1);
        });
      }

      return res.status(200).json({ msg: "oke", action: "unlike" });
    } else {
      return res.status(400).json({ msg: "You have not liked this user." });
    }
  };
}

const UserController = new User();

export default UserController;
