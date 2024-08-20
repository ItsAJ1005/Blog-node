const { randomBytes, createHmac } = require('crypto');
const { Schema, model, mongoose } = require("mongoose");

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt:{
        type: String,
    },
    profileUrl: {
        type: String,
        default: '/images/default.jpg'
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true} );

userSchema.pre("save", function(next) {
    const user = this;
    if(!user.isModified("password")) return;
    
    const salt = randomBytes(12).toString();

    const hashedPass = createHmac('sha256', salt).update(user.password).digest("hex");

    this.salt = salt;
    this.password = hashedPass;

    next();
});



const User = mongoose.model('user', userSchema);

module.exports = { User };