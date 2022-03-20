import jwt from "jsonwebtoken";

import UserModel from "../db/models/User/UserModel";
import { checkPassword, hashPassword } from "../utils/crypt";
import { getUserIdFromReq, isAuthenticated } from "../utils/isAuthenticated";

class Authentication {


  public getUserByToken = async (req, res) => {
    const check = await isAuthenticated(req, res);
    if (check) {
      const userId = await getUserIdFromReq(req);
      const user = await UserModel.findById(userId, { password: 0 });
      return res.status(200).send({
        message: "Đăng nhập thành công",
        user: JSON.stringify(user),
        status: true,
      });
    }
    return res.status(500).json({
      message: "Token expired, Please try again",
    });
  };

  public register = async (req, res) => {
    try {
      const { password, username, repeat_password } = req.body;
      if (!password || !username || !repeat_password) {
        return res
          .status(500)
          .send({ message: "Vui lòng nhập đầy đủ thông tin !" });
      }

      const user = await UserModel.findOne(
        { username: username },
        { password: 0 }
      );
      if (user) {
        return res
          .status(500)
          .send({ message: "Username đã tồn tại trong hệ thống" });
      }

      if (repeat_password !== password) {
        return res.status(500).send({ message: "Không trùng mật khẩu" });
      }

      if (password.length < 6) {
        return res
          .status(500)
          .send({ message: "Mật khẩu phải dài hơn 6 ký tự" });
      }
      if (password.length > 25) {
        return res
          .status(500)
          .send({ message: "Mật khẩu phải ngắn hơn 25 ký tự" });
      }

      const newUser = await UserModel.create({
        password: await hashPassword(password),
        username,
      });
      const jsonWebToken = jwt.sign(
        { userID: newUser._id.toString() },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );

      const refreshToken = jwt.sign(
        { userID: newUser._id.toString() },
        process.env.JWT_SECRET,
        {
          expiresIn: "1y",
        }
      );

      return res
        .header("x-auth-token", jsonWebToken)
        .status(200)
        .send({
          message: "Đăng kí thành công",
          token: jsonWebToken,
          user: JSON.stringify(newUser),
          status: true,
          refreshToken,
        });
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  };

  public login = async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(500).send({
          message: "Vui lòng nhập đầy đủ thông tin !",
          status: "false",
        });
      }

      const user = await UserModel.findOne({ username: username });

      if (!user) {
        return res.status(500).send({
          message: "Tên đăng nhập hoặc mật khẩu không đúng!",
          status: false,
        });
      }

      const checkPasswordInput = await checkPassword(password, user.password);
      if (!checkPasswordInput) {
        return res.status(500).send({
          message: "Có cái mật khẩu không nhớ được là sao, buddy?",
          status: false,
        });
      }

      const jsonWebToken = jwt.sign(
        { userID: user._id.toString() },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );

      const refreshToken = jwt.sign(
        { userID: user._id.toString() },
        process.env.JWT_SECRET,
        {
          expiresIn: "1y",
        }
      );

      return res
        .header("x-auth-token", jsonWebToken)
        .status(200)
        .send({
          message: "Đăng nhập thành công",
          token: jsonWebToken,
          refreshToken,
          user: JSON.stringify(user),
          status: true,
        });
    } catch (err) {
      return res.status(500).send({ message: err.message, status: false });
    }
  };

  public getAccessToken = async (req, res) => {
    const { refreshToken } = req.body;
    // verify refreshToken
    if (!refreshToken) {
      return res.status(400).send({
        message: "no enough fields",
      });
    }
    const check = await jwt.verify(refreshToken, process.env.JWT_SECRET);
    // true => create new access token
    if (check.userID) {

      const checkUser = await UserModel.findById(check.userID);
      if (!checkUser) {
        return res.status(403).send({
          message: "Please Login",
        });
      }
      const jsonWebToken = jwt.sign(
        { userID: check.userID },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );
      return res.status(200).send({
        token: jsonWebToken,
        refreshToken: refreshToken,
        msg: "oke",
      });

    } else {
      return res.status(403).send({
        message: "Token expired, Please try again",
      });
    }

  };
}

const AuthenticationController = new Authentication();

export default AuthenticationController;
