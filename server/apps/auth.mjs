import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  const user = {
    username: req.body.username,
    password: req.body.password,
    firstname: req.body.firstName,
    lastname: req.body.lastName,
    email: req.body.email,
    created_at: new Date(),
    updated_at: new Date(),
    last_logged_in: new Date(),
  };
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  console.log(user);

  try {
    await connectionPool.query(
      `insert into users (firstname,lastname,username,email,password,created_at,updated_at,last_logged_in)
          values ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [
        user.firstname,
        user.lastname,
        user.username,
        user.email,
        user.password,
        user.created_at,
        user.updated_at,
        user.last_logged_in,
      ]
    );
  } catch {
    res
      .status(500)
      .json({
        messeage: "Server could not register because database connection",
      });
    res
      .status(400)
      .json({
        messeage:
          "Server could not register there are missing data from client",
      });
  }

  return res.json({
    message: "User has been created successfully",
  });
});

authRouter.post("/login", async (req, res) => {
  const loginUser = {
    username: req.body.username,
    password: req.body.password,
    last_logged_in: new Date(),
  };
  try {
    const users = await connectionPool.query(
      `SELECT * FROM users WHERE username = $1`,
      [loginUser.username]
    );

    await connectionPool.query(
      `update users set last_logged_in =$1 where username =$2`,
      [loginUser.last_logged_in, loginUser.username]
    );
    const user = users.rows;

    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user[0].password
    );
    if (!isValidPassword) {
      return res.status(401).json({
        message: "password not valid",
      });
    }

    const token = jwt.sign(
      {
        firstName: user[0].firstName,
        lastName: user[0].lastName,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "900000", //900000ms
      }
    );

    return res.status(200).json({
      message: "login successfully",
      token,
    });
  } catch {
    res.status(404).json({ message: "user not found" });
  }
});

export default authRouter;
