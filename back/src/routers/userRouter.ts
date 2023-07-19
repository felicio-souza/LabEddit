import express from "express"
import { UserController } from "../controller/UserController"
import { UserBusiness } from "../bussines/UserBusiness"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"
import { HashManager } from "../services/HashManager"
import { UserDataBase } from "../database/UserDataBase"




export const userRouter = express.Router()



const userController = new UserController(

new UserBusiness(

    new UserDataBase(),
    new IdGenerator(),
    new TokenManager(),
    new HashManager()


)

)


userRouter.post("/signup", userController.signup)
userRouter.post("/login", userController.login)