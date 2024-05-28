const express = require('express')
const cartController = require('../controllers/cart_controller')

const cartRouter = express.Router()

cartRouter.post('/addToCart', cartController.addToCart)
cartRouter.put('/updateCartItem', cartController.updateCartItem)
cartRouter.put('/updateItemQty', cartController.updateItemQty)
cartRouter.delete('/deleteCartItem', cartController.deleteItem)
cartRouter.post('/viewCart', cartController.viewCart)

module.exports = cartRouter