const express = require('express')
const userController = require('../controllers/users_controller')

const userRouter = express.Router()

userRouter.post('/guest', userController.guest)

module.exports = userRouter