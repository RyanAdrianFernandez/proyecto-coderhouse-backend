import mongoose, {Schema} from "mongoose"

const userCollection = "users"

const userSchema = new Schema({
  nombre: {
    type: String,
    required: true
  },
  apellido: {
    type: String,
    required: true
  },
  rol: {
    type: String,
    defautl: "user"
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'carts'
},
  email: {
    type: String,
    required: true,
    unique: true
  },
  edad: {
    type: Number,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

export const UserModel = mongoose.model(userCollection, userSchema)