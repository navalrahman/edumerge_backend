const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Admin', 'Admission Officer', 'Management'],
        default: 'Admin'
    }
})

userSchema.statics.signup = async function (name, email, password, role) {

    if (!email || !password || !name) {
        throw Error('All fields must be filled')
    }
    if (!name) {
        throw Error('Name is required')
    }
    const isEmail = validator.isEmail(email);
    const isMobile = /^[0-9]{10}$/.test(email);

    if (!isEmail && !isMobile) {
        throw Error('Enter a valid email or 10-digit mobile number')
    }
    const exist = await this.findOne({ email })
    if (exist) {
        throw Error('Email id already exists')
    }
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    const user = await this.create({ name, email, password: hash, role })
    return user
}

userSchema.statics.login = async function (email, password) {
    if (!email || !password) {
        throw Error('All fields must be filled')
    }
    const user = await this.findOne({ email })
    if (!user) {
        throw Error('Incorrect email')
    }
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        throw Error('Incorrect password')
    }
    return user
}

const userModel = mongoose.model('users', userSchema)
module.exports = userModel