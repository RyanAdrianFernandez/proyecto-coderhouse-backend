import express from "express";
import {isLog} from "../middlewares/protected.route.js"

const loginRouter = express.Router()

loginRouter.get("/login", isLog, (req,res)=>{
    res.render("login", {})
})

export default loginRouter;