var constants = require('./modelConstants');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usersSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            index: true
        },
        lastName: {
            type: String,
            default: null
        },
        school_name: {
            type: String,
            default: null
        },
        mobile: {
            type: Number,
            required: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            index: true
        },
        password: {
            type: String,
            required: true
        },
        avatar: {
            type: String,
            default: null,
            get: avatarGetter
        },
        
        
    },
    {
        collection: constants.UserModel,
        versionKey: false,
        timestamps: true,
        toObject: { virtuals: true, getters: true },
        toJSON: { virtuals: true, getters: true }
    }
);

usersSchema.index({'createdAt':-1});
usersSchema.virtual('fullName').get(function () {
    return [this.firstName, this.lastName].join(' ');
});


function avatarGetter(avatar) {
    if (avatar) {
        return process.env.WEBURL + '/' + avatar;
    } else {
        return process.env.WEBURL + '/images/user2-160x160.jpg';
    }
}

mongoose.model(constants.UserModel, usersSchema);
