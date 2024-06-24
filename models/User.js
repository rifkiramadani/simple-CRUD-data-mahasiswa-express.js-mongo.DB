const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Perlu Memasukkan Username']
    },
    password: {
        type: String,
        required: [true, 'Perlu Memasukkan Password']
    },
});

// REFACTOR FUNGSI REGISTER DAN LOGIN
//untuk fungsi login
userSchema.statics.findByCredentials = async function (username, password) {
    const user = await this.findOne({username});
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch ? user : false
}

//untuk fungsi register
userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) {
        return next();
    } else {
        this.password = await bcrypt.hash(this.password, 10)
        next();
    }
})

const User = mongoose.model('User', userSchema);

module.exports = User;