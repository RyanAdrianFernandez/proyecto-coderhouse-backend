import express from "express";
import {isLog} from "../middlewares/protected.route.js"


const registerRouter = express.Router()

registerRouter.get("/register",isLog, (req,res)=>{
    res.render("register", {})
})

export default registerRouter;