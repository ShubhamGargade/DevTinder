const express = require('express');
const userRouter = express.Router();
const { adminAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../model/connectionRequest.js');
const User = require('../model/user.js');

userRouter.get("/user/requests/received", adminAuth, async (req, res) => {
    try {
        const user = req.user;

        const userRequestData = await ConnectionRequest.find({
            toUserId: user._id,
            status: 'interested'
        }).populate('fromUserId', 'firstName lastName about photoUrl age gender skills')
            .catch(e => console.log(e));
        res.json({
            message: 'Data found.',
            data: userRequestData
        });

    } catch (error) {
        res.status(400).send("Error in getting user request data: ", error);
    }
});

userRouter.get("/user/connections", adminAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionResults = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, status: "accepted" },
                { toUserId: loggedInUser._id, status: "accepted" }
            ]
        })
            .populate("fromUserId", "firstName lastName about photoUrl age gender skills")
            .populate("toUserId", "firstName lastName about photoUrl age gender skills");

        if (!connectionResults) {
            throw new Error("No connection data found");
        }

        const data = connectionResults.map(data => {
            if (data.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return data.toUserId;
            }
            else {
                return data.fromUserId;
            }
        });
        res.json({
            data: data
        })
    } catch (error) {
        res.status(400).send("Error in getting connections: " + error);
    }
});

userRouter.get("/feed", adminAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const page = req.query.page ? req.query.page : 1;
        const limit = req.query.limit ? req.query.limit : 10;

        let skip = (page-1) * limit;

        const connectionWithUser = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        })
            .populate("fromUserId", "firstName")
            .populate("toUserId", "firstName");

        const connectedUserData = connectionWithUser.map(data => {
            if (data.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return data.toUserId._id.toString();
            }
            else {
                return data.fromUserId._id.toString();
            }
        });

        connectedUserData.push(loggedInUser._id.toString());

        let allUserData = await User.find({}).select(["firstName", "lastName", "age", "photoUrl", "about", "gender"]).skip(skip).limit(limit);
        allUserData = allUserData.map(user => {
            if (!connectedUserData.includes(user._id.toString())) {
                return user;
            }
            return;
        }).filter(data => (data)?true:false);

        res.json({
            data: allUserData
        });

    } catch (error) {
        res.status(400).send("Error in getting feed data: " + error);
    }
});

module.exports = userRouter;
