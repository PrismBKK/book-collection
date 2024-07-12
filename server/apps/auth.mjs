import { query, Router } from "express";
import ConnectionPool from "../utils/db.mjs"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const authRouter=Router()

authRouter.post("/register",async(req,res)=>{
    const user={
        ...req.body,
        created_at: new Date(),
        updated_at: new Date(),
        last_logged_in:new Date(),
    };
    console.log(user)
    const salt=await bcrypt.genSalt(10);
    user.password=await bcrypt.hash(user.password,salt)
    
    console.log(user)

    try{
        await ConnectionPool.query(
          `insert into users (firstname,lastname,username,email,password,created_at,updated_at,last_logged_in)
          values ($1,$2,$3,$4,$5,$6,$7,$8)`,
          [
              user.firstName,
              user.lastName,
              user.username,
              user.email,
              user.password,
              new Date(),
              new Date(),
              new Date(),
          ]
          
        );
        }
        catch{
          res.status(500).json({messeage:"Server could not register because database connection"});
          res.status(400).json({messeage:"Server could not register there are missing data from client"});
        }

    return res.json({
        message : "User has been created successfully"
    });

});

authRouter.post("/login",async(req,res)=>{
    const login_user={
        ...req.body,
        last_logged_in:new Date(),
    };
    try{
        const users=await ConnectionPool.query(
            `SELECT * FROM users WHERE username = $1`,
            [
                req.body.username
            ]
        );

        await ConnectionPool.query(
            `update users set last_logged_in =$1 where username =$2`,
            [
                login_user.last_logged_in,
                login_user.username
            ]
            
          );
        const user=users.rows
        const isValidPassword = await bcrypt.compare(req.body.password, user[0].password);
        if (!isValidPassword) {
            return res.status(401).json({
                 "message": "password not valid"
            })
        }
        const token=jwt.sign(
            { id: user._id,
                firstName: user[0].firstName,
                lastName: user[0].lastName
            },
            process.env.SECRET_KEY,
            {
                expiresIn: "900000" //900000ms
            }
            );
        
              return res.json({
                message:"login succesfully",
                token,
              })
    }
    catch{
        res.status(404).json({"message": "user not found"})
    }
})

export default authRouter;