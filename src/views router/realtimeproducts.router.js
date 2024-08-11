import express from "express";
import { productManager } from "../app.js";

const realTimeRouter = express.Router()

realTimeRouter.get("/realtimeproducts", async (req,res)=>{
    const lista = await productManager.getProductList();
    res.render("realtimeproducts", {lista}) 
})


export default realTimeRouter;