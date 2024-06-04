import {errorHandler} from '../utils/error.js'
import bcryptjs from 'bcryptjs'
import User from '../models/user.model.js'


export const test = (req, res) => {
    res.json({message: "API is Working"});
}

export const updateUser = async(req, res, next) => {
    if(req.user.id !== req.params.userId){
        return next(errorHandler(403,"You are not allowed to update tis user"))
    }
    if(req.body.password){
        if(req.body.password.length < 6){
            return next(errorHandler(401, "password should be atleast 6 characters long"))
        }
        req.body.password = bcryptjs.hashSync(req.body.password,10);
    }
    if(req.body.username){
        if(req.body.username.length < 7 || req.body.username.length > 20){
            return next(errorHandler(400, "Username must be 7 to 20 characters long"))
        }
        if(req.body.username.includes(' ')){
            return next(errorHandler(400, "Username must not contain any spaces"))
        }
        if(req.body.username != req.body.username.toLowerCase()){
            return next(errorHandler(400, "Username must be in Lower Case"))
        }
        if(!req.body.username.match(/^[a-zA-Z0-9]+$/)){
            return next(errorHandler(400, "Username can only contain numbers and letters"))
        }
        try {
            const updateUser = await User.findByIdAndUpdate(req.params.userId, {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    profilePicture: req.body.profilePicture,
                    password: req.body.password,
                }
            }, {new: true})

            const {password, ...rest} = updateUser._doc;
            res.status(200).json(rest);
        } catch (error) {
            next(error);
        }        
    }


}