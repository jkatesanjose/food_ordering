const cart_model = (menu_id, menu_size, quantity)=>{

    let Cart = {
        menu_id: menu_id,
        menu_size: menu_size,
        quantity: quantity
    }
    return Cart
}

module.exports = {
    cart_model
}