import express from "express";
const sessionsRouter = express.Router()
import { UserModel } from "../models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";

import { Router } from "express";
import { login, register } from "./controllers/user.controller.js";
import { invokePassport } from "../middlewares/handleError.js";

const route = Router();

route.post('/login', login)
route.post('/register', register)

route.get('/current', invokePassport('jwt'), (req, res) => {
    console.log(req.user)
    res.send('Bienvenido ' + req.user.nombre)
})


export default route
/*
sessionsRouter.get("/getSession", (req, res)=>{
  res.json({session: req.session})
})
sessionsRouter.post("/register", async (req, res)=>{

  const { nombre, apellido, email, edad, password } = req.body;
  if(!nombre || !apellido || !email || !edad || !password) res.send({message: "Campos incompletos"})
  try{
    await userModel.create({
      nombre, 
      apellido,
      email,
      edad, 
      password: createHash(password)
    })
    res.status(200).json({message: "Usuario creado correctamente"})
  } catch(e){
    res.status(500).json({message: "Error al crear un usuario"})
  }

  
})

sessionsRouter.post("/login", async (req, res)=>{
  const {email, password} = req.body
  if(!email || !password) return res.status(400).json({message: "Valores no ingresados"})
  try{
    const user = await userModel.findOne({email, password}).lean()
    if(!isValidPassword(user, password)) return res.status(400).json({message: "Credenciales Incorrectas"})
    if(!user) return res.status(404).json({message: "Ingreso mal el mail o contraseña"})
    if(!req.session.isLog){
      req.session.isLog = true
      req.session.user = {
      nombre: user.nombre,
      apellido: user.apellido,
      edad: user.edad
    }
    }
    res.status(200).json({message: "Logueado"})
    console.log(user)
  } catch(e){
    res.status(500).json({message: "Error al encontrar el usuario"})
  }

})

sessionsRouter.get("/cerrarSession", (req, res)=>{
  req.session.destroy((err)=>{
    if(err) return res.send("Error al cerrar la sesión")
    return res.redirect("/")
  })
})


export default sessionsRouter;

*/