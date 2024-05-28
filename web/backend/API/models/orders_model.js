const order_model = (ref_id, users_id, quantity, order_date, total_amount, delivery_date, payment_method, change_for)=>{

    let Order = {
        ref_id: ref_id,
        users_id: users_id,
        quantity: quantity,
        order_date: order_date,
        total_amount: total_amount,
        delivery_date: delivery_date,
        payment_method: payment_method,
        change_for: change_for
    }
    return Order
}

module.exports = {
    order_model
}