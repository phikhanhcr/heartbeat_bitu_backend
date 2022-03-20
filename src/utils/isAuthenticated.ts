import jsonwebtoken from "jsonwebtoken";

const isAuthenticated = async (req, res) => {
  try {
    let token = '';
    if (req.headers && req.headers["x-auth-token"]) {
      token = req.headers["x-auth-token"];
    }

    let jwt = {
      exp: 0,
    };

    jwt = await jsonwebtoken.verify(token, process.env.JWT_SECRET);
    let expiredJwt = new Date();
    if (jwt && jwt.exp) {
      expiredJwt = new Date(jwt.exp * 1000);
    }

    if (expiredJwt < new Date()) {
      return false;
    }
    return true;
  } catch (err) {
      console.log(err)

    return false;
  }
};

const getUserIdFromReq = async (req) => {
  try {
    let token = '';
    if (req.headers && req.headers["x-auth-token"]) {
      token = req.headers["x-auth-token"];
    }
    let jwt = {
      exp: 0,
      userID: '',
    };

    jwt = await jsonwebtoken.verify(token, process.env.JWT_SECRET);
    return jwt.userID;

  } catch (err) {
    console.log(err);
    return null;
  }
};

const checkAuthenticationAndReturnUserId = async (req, res) => {
  if (! await isAuthenticated(req, res)) {
    return res.status(500).send({
      message: "You have to login"
    })
  }
  const userId = await getUserIdFromReq(req);
  if (!userId) {
    return res.status(500).send({
      message: "You have to login"
    })
  }
  return userId;
}

export { isAuthenticated, getUserIdFromReq, checkAuthenticationAndReturnUserId };
