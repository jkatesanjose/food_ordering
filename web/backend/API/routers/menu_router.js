const express = require('express')
const menuController = require('../controllers/menu_controller')

const menuRouter = express.Router()

menuRouter.get('/viewAllMenu', menuController.viewAllMenu)
menuRouter.get('/viewMenu', menuController.viewMenuById)
menuRouter.post('/viewMenuByCateg/:category', menuController.viewMenuByCategory)
menuRouter.get('/viewMenuByPop', menuController.viewMenuByPopularity)

module.exports = menuRouter