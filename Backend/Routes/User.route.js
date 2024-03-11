const express = require('express');
const userRouter = express.Router();
const bcrypt = require('bcrypt');
const { UserModel } = require('../Models/User.model');
const { authorize } = require("../Middleware/Authorization")
const { auth } = require("../Middleware/Authentication")
const validator = require('validator')
const jwt = require("jsonwebtoken")
require("dotenv").config()


userRouter.get('/auth', auth, async (req, res) => {
    let user = await UserModel.findById(req.user.userId)
    res.status(200).json(user)  
})

// Register route
userRouter.post('/register', async (req, res) => {
    const { name, email, password, age } = req.body;
    try {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        } if (!name || !email || !password || !age) {
            return res.status(400).json({ error: "All fields are required" });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: "Invalid email" });
        }
        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({ error: "Password must be strong" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({ name, email, password: hashedPassword, age });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

userRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                // Handle bcrypt error
                return res.status(500).json({ error: 'Internal server error' });
            }
            if (!result) {
                // Incorrect password
                return res.status(400).json({ error: 'Wrong password' });
            }
            // Password matches
            const token = jwt.sign({ userId: user._id, userName: user.name, role: user.role }, process.env.SECRET_KEY);
            res.status(200).json({ message: 'Login successful', token: token, user });
        });
    } catch (error) {
        // Handle other errors
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
userRouter.get('/', auth, authorize(["SUPER_ADMIN", "ADMIN"]), async(req, res) => {
    try {
        const users = await UserModel.find();
        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

userRouter.get('/:id', auth, authorize(["SUPER_ADMIN", "ADMIN"]),  async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await UserModel.findById(userId).populate("enrolledCourses");
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

userRouter.put('/:id', authorize(["SUPER_ADMIN", "ADMIN"]),async (req, res) => {
    const userId = req.params.id;
    const userData = req.body;
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, userData, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({message:"User Update Success!", updatedUser});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

userRouter.delete('/:id', auth, authorize(["SUPER_ADMIN", "ADMIN"]),  async (req, res) => {
    const userId = req.params.id;
    try {
        const deletedUser = await UserModel.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = { userRouter };
