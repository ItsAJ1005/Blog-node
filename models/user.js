const { randomBytes, createHmac } = require('crypto');
const { Schema, model, mongoose } = require("mongoose");
const { createTokenForUser } = require('../utils/authentication');

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
    salt: {
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
}, { timestamps: true });

userSchema.pre("save", function(next) {
    const user = this;
    if (!user.isModified("password")) return next(); // Correct early return
    
    const salt = randomBytes(12).toString('hex');  // Specify encoding
    const hashedPass = createHmac('sha256', salt).update(user.password).digest("hex");

    this.salt = salt;
    this.password = hashedPass;

    next();
});

userSchema.static('matchPasswordAndGenerateToken', async function(email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("User Not Found!");

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedPass = createHmac('sha256', salt)
        .update(password)  // Hash the provided password
        .digest("hex");

    if (hashedPassword !== userProvidedPass){
        throw new Error("Incorrect password");
    } 

    const token = createTokenForUser(user);
    return token;
});

const User = mongoose.model('user', userSchema);

module.exports = { User };
