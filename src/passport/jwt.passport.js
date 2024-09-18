import passport from 'passport';
import jwt, { ExtractJwt } from 'passport-jwt';
import { getJWTCookie } from "../utils.js";
import { UserModel } from '../models/user.model.js';

const JWTStrategy = jwt.Strategy

const initializePassport = () => {
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([getJWTCookie]),
        secretOrKey: process.env.SECRET
    },async (payload, done)=> {
        try{
            // payload.email // el cuerpo del token decodificado
            const userFound = await UserModel.findOne({ email: payload.email }).populate('cart').lean()
            if(!userFound){
                return done(null, false)
            }

            return done(null, userFound)
        }catch (e){
            return done(e)
        }
    }))
}

export default initializePassport;