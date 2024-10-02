const mongoose = require('mongoose');
const bcryptjs = require('bcrypt');

// Defining the person schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String
    },
    mobile: {
        type: String
    },
    address: {
        type: String,
        required: true
    },
    aadharCardNumber: {
        type: Number,
        required: true,
        unqiue: true
    },
    password: {
        type: String,
        required: true
    },
    roles: {
        type: String,
        enum: ['voter', 'admin'],
        default: 'voter'
    },
    isVoted: {
        type: Boolean,
        default: false
    }
});

userSchema.pre('save', async function (next) {
    const person = this;
    if (!person.isModified('password')) return next();

    try {
        //  hash password generation
        const salt = await bcryptjs.genSalt(10);

        // hash password
        const hashedPassword = await bcryptjs.hash(person.password, salt);

        //override the plain password with the hashed one
        person.password = hashedPassword;
        next();

    } catch (err) {
        return next(err);
    }
})

userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        // use bcryptjs to compare the password with the hashed password
        console.log(candidatePassword, this.password)
        const isMatch = await bcryptjs.compare(candidatePassword, this.password);
        console.log({ isMatch })
        return isMatch;

    } catch (err) {
        throw err;
    }
}

const User = mongoose.model('User', userSchema);
module.exports = User;