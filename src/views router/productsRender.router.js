import express from "express";
import productsRouter from "../routes/products.router.js";

const productsRenderRouter = express.Router()

productsRouter.get("/ver-productos", async (req,res)=>{
    res.render("products")
})
export default productsRenderRouter;