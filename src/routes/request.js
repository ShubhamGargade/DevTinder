const express = require('express');
const connectionRouter = express.Router();
const { adminAuth } = require('../middlewares/auth.js');
const ConnectionRequest = require('../model/connectionRequest.js');
const User = require('../model/user.js');

connectionRouter.post("/request/connect/:status/:toUserId", adminAuth, async (req, res) => {
    try {
        const status = req.params.status;
        const toUserId = req.params.toUserId;
        const fromUserId = req.user._id;

        const allowedStatus = ['interested', 'ignored'];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ messsage: 'Status is invalid' });
        }

        const toUser = await User.findById(toUserId).catch((e) => { });
        if (!toUser) {
            return res.status(400).json({ message: 'To User does not exists' });
        }

        const existConnections = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });

        if (existConnections) {
            return res.status(400).json({ message: 'Users are already connected' });
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId: fromUserId,
            toUserId: toUserId,
            status: status
        });

        await connectionRequest.save();

        res.send(`${req.user.firstName} is ${status} in  ${toUser.firstName}.`);
    } catch (error) {
        res.status(400).send("Error to send connection request" + error.message);
    }
});

connectionRouter.post("/request/review/:status/:requestId", adminAuth, async (req, res) => {
    try {
        const { status, requestId } = req.params;
        const allowedStatus = ['accepted', 'rejected'];
        if(!allowedStatus.includes(status)){
            res.status(400).send('Status is not valid');
        }
        const connectionFound = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: req.user._id,
            status: 'interested'
        });
    
        if(!connectionFound){
            return res.status(404).json({message: 'Connection not found for ' + req.user.firstName});
        }
    
        connectionFound.status = status;
        connectionFound.save();
        res.send(`${req.user.firstName} has ${status}  ${connectionFound.fromUserId} request.`);
    } catch (error) {
        res.status(400).json({message: 'Error on request action: ' + error});
    }
});

module.exports = connectionRouter;