
import { checkAuthenticationAndReturnUserId } from '../utils/isAuthenticated';
import UserModel from '../db/models/User/UserModel';

class User {

  public getListUser = async (req, res) => {
    let page = req.params.page || 1;
    let perPage = 10;
    const userId = await checkAuthenticationAndReturnUserId(req, res);
    const users = await UserModel
      .find({ _id: { $ne: userId } })
      // .skip((perPage * page) - perPage)
      // .limit(perPage);
      // have an error on the client side, don't know how to fix it so I have not done the pagination

    return res.status(200).json({ data: users });
  };

  public likeAction = async (req, res) => {

    const userId = await checkAuthenticationAndReturnUserId(req, res);
    const { target_user_id } = req.body;
    const targetUser = await UserModel.findById(target_user_id);

    const checkLikeOrNot = await UserModel.find({
      _id: target_user_id,
      liked_user: { $in: [userId] },
    });

    if (checkLikeOrNot.length > 0) {

      return res.status(400).json({ msg: "You liked this user." });
    } else {
      targetUser.like_count++;
      targetUser.liked_user.push(userId);
      await targetUser.save();
      return res.status(200).json({ msg: "oke", action: "like" });
    }
  };

  public unLikeAction = async (req, res) => {

    const userId = await checkAuthenticationAndReturnUserId(req, res);
    const { target_user_id } = req.body;
    const targetUser = await UserModel.findById(target_user_id);

    const checkLikeOrNot = await UserModel.find({
      _id: target_user_id,
      liked_user: { $in: [userId] },
    });

    if (checkLikeOrNot.length > 0) {

      targetUser.like_count--;
      targetUser.liked_user = targetUser.liked_user.filter(ele => ele.toString() !== userId);
      await targetUser.save();

      return res.status(200).json({ msg: "oke", action: "unlike" });
    } else {
      return res.status(400).json({ msg: "You have not liked this user." });
    }
  };
}

const UserController = new User();

export default UserController;
