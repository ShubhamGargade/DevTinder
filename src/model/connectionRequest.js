const mongoose = require('mongoose');

const ConnectionRequest = new mongoose.Schema({
    fromUserId: {
        type: String,
        required: true,
        ref: 'User'
    },
    toUserId: {
        type: String,
        required: true,
        ref: 'User'
    },
    status: {
        type: String,
        enum: {
            values: ['interested', 'ignored', 'accepted', 'rejected'],
            message: '{VALUE} is not a valid status.'
        }
    }
}, { timestamps: true });

ConnectionRequest.index({ fromUserId: 1, toUserId: 1 });

ConnectionRequest.pre('save', function(next){
    if(this.fromUserId === this.toUserId){
        throw new Error("Self connection not allowed");
    }
    next();
});

module.exports = mongoose.model('ConnectionRequest', ConnectionRequest);

