const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

const router = express.Router();

// CREATE USERS (for testing)
router.post("/create", async (req, res) => {
    const user = new User(req.body);
    await user.save();
    res.json(user);
});

// TRANSFER WITH TRANSACTION
router.post("/transfer", async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { fromId, toId, amount } = req.body;

        const sender = await User.findById(fromId).session(session);
        const receiver = await User.findById(toId).session(session);

        if (!sender || !receiver) {
            throw new Error("User not found");
        }

        if (sender.balance < amount) {
            throw new Error("Insufficient balance");
        }

        sender.balance -= amount;
        await sender.save({ session });

        // simulate failure
        if (amount > 5000) {
            throw new Error("Transaction failed intentionally");
        }

        receiver.balance += amount;
        await receiver.save({ session });

        await Transaction.create([{
            from: fromId,
            to: toId,
            amount,
            status: "SUCCESS"
        }], { session });

        await session.commitTransaction();
        session.endSession();

        res.json({ msg: "Transaction successful" });

    } catch (err) {
        await session.abortTransaction();
        session.endSession();

        res.status(400).json({
            msg: "Transaction rolled back",
            error: err.message
        });
    }
});

module.exports = router;