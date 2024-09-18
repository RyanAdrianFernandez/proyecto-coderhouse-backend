import express from "express";
import {isAuth} from "../middlewares/protected.route.js"

const perfilRouter = express.Router()

perfilRouter.get("/perfil", isAuth, (req,res)=>{
  const user = req.session.user
  const isLog = req.session.isLog
  res.render("perfil", {user, isLog})
})

export default perfilRouter;