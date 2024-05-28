const express = require('express')
const orderController = require('../controllers/orders_controller')

const orderRouter = express.Router()

orderRouter.post('/addOrder', orderController.addOrder)
orderRouter.get('/viewOrderByRefId/:ref_id', orderController.viewOrderByRefId)

module.exports = orderRouter