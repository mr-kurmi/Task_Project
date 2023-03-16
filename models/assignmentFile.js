var constants = require('./modelConstants');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var assignmentFileSchema = new Schema(
    {
        assignmentTitle: {
            type: String,
            required: true,
            index: true
        },
        student:{
            type:Array,
            required:true,
            Student:[]
        },
        // student: [
        //     {
        //         students: {
        //             type: Schema.Types.ObjectId,
        //             ref: constants.UserModel,
        //             required: true
        //         }
        //     }
        // ]
            
        // ,
        assignmentFile: {
            type: String,
            default: null,
            get: avatarGetter
        },
        
        
    },
    {
        collection: constants.assignmentFileModel,
        versionKey: false,
        timestamps: true,
        toObject: { virtuals: true, getters: true },
        toJSON: { virtuals: true, getters: true }
    }
);

assignmentFileSchema.index({'createdAt':-1});

function avatarGetter(assignmentFile) {
    if (assignmentFile) {
        return process.env.WEBURL + '/' + assignmentFile;
    } else {
        return process.env.WEBURL + '/images/user2-160x160.jpg';
    }
}

mongoose.model(constants.assignmentFileModel, assignmentFileSchema);
