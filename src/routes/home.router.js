import express from "express";
import { productManager } from "../app.js";
const homeRouter = express.Router()

homeRouter.get("/home", async (req,res)=>{
    const lista = await productManager.getProductList();
    res.render("home", {lista})
})


export default homeRouter;