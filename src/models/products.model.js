import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"
const producsCollection = "products"

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    code: {
        type: String,
        index: true
    },
    price: Number,
    status: Boolean,
    stock: Number,
    category: String,
    thumbnail: String,
})

productSchema.plugin(mongoosePaginate)
export const productsModels = mongoose.model(producsCollection, productSchema)