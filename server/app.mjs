import express from "express"
import authRouter from "./apps/auth.mjs"
import dotenv from "dotenv"
import bookRouter from "./apps/book.mjs"
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

async function init() {
  dotenv.config();
  
  const app=express();
  const port = 4001;
  
  app.use(express.json());
  

  app.use("/auth",authRouter)
  app.use("/book",bookRouter)

  app.listen(port, () => {
    console.log(`Server is running at ${port}`);
  });
}

init();

