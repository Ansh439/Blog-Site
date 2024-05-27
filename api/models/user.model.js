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
    profilePicture: {
        type: String,
        default: "https://pixabay.com/vectors/blank-profile-picture-mystery-man-973460/",
    }

},{timestamps: true}//to know the timestamp of user's entered data
);


const User = mongoose.model('User', userSchema);

export default User;