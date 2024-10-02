const express = require('express');
const router = express.Router();
const User = require('./../models/user');
const { jwtAuthMiddleware, generateToken } = require('./../jwt');
// Post route to add a person
router.post('/signup', async (req, res) => {
    try {
        const data = req.body
        const newUser = new User(data);
        const response = await newUser.save();
        console.log('data saved');

        const payload = {
            id: response.id,
        }
        console.log(JSON.stringify(payload));
        const token = generateToken(payload);
        console.log("Token is:", token);
        res.status(200).json(response);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
})
//login Route
router.post('/login', async (req, res) => {
    try {
        const { aadharCardNumber, password } = req.body;
        const user = await User.findOne({ aadharCardNumber: aadharCardNumber });
        if (!user || (await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        // generate Token
        const payload = {
            id: user.id,
        }
        const token = generateToken(payload);
        res.json({ token })
    } catch (err) {
        console.error(err);
        req.status(500).json({ error: 'Internal Server Error' });
    }
});
//profile route
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
    try {
        const userData = req.user;
        const userId = userData.id;
        const user = await User.findById(userId);
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        req.status(500).json({ error: 'Internal Server Error' });
    }
})

router.put('/profile/password', async (req, res) => {
    try {
        const userId = req.user;
        const { currentPassword, newPassword } = req.body

        //find the user by userID
        const user = await User.findById(userId);

        //if password does not match, return error
        if (!(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        // update the users password
        user.password = newPassword;
        await user.save();

        console.log('password updated');
        res.status(200).json({ message: "password updated" });
    } catch (err) {
        console.log('err');
        res.status(500).json({ error: err.message });
    }
})

module.exports = router;