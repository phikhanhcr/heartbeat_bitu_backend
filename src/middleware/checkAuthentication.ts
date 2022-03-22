import jsonwebtoken from 'jsonwebtoken';

const checkAuthentication = async (req, res, next) => {
  try {
    let token = '';
    if (req.headers && req.headers["x-auth-token"]) {
      token = req.headers["x-auth-token"];
    }

    let jwt = {
      exp: 0,
      userID: ""
    };

    jwt = await jsonwebtoken.verify(token, process.env.JWT_SECRET);
    let expiredJwt = new Date();
    if (jwt && jwt.exp) {
      expiredJwt = new Date(jwt.exp * 1000);
    }

    if (expiredJwt < new Date()) {
      return res.status(403).send({
        message: "Token expired"
      })
    }
    req.user = jwt.userID;
    next();

  } catch (err) {
    return res.status(403).send({
      message: "Token expired"
    })
  }
};

export {
  checkAuthentication
}