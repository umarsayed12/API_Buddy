import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    let token = req.cookies.token;
    if (
      !token &&
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized User",
        success: false,
      });
    }
    const decode = await jwt.verify(token, process.env.SECRET_KEY);
    if (!decode) {
      return res.status(401).json({
        message: "Invalid Credentials",
        success: false,
      });
    }
    req.id = decode.userId;
    next();
  } catch (error) {
    console.log("Authentication Error : ", error);
  }
};

export default isAuthenticated;
