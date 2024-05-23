import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },

},{timestamps: true}//to know the timestamp of user's entered data
);


const User = mongoose.model('User', userSchema);

export default User;