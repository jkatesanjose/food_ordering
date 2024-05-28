const con_db = require('../models/con_db');
const cart_controller = require('../controllers/cart_controller')

const generateRefId = function(length = 10) {
  return Math.random().toString(36).substring(2, length + 2).toUpperCase();
}

const addOrder = (req, res, next) => {
  let firstName = req.body.first_name
  let lastName = req.body.last_name
  let emailAdd = req.body.email_add
  let contactNo = req.body.contact_no
  let address = req.body.address
  let orderData = req.body.orderData

  let checkCart = `SELECT quantity, menu_tbl.id as menu_id, menu_size, size, price
  FROM cart_tbl
  INNER JOIN menu_tbl on cart_tbl.menu_id = menu_tbl.id
  INNER JOIN menu_pricesize on cart_tbl.menu_size = menu_pricesize.id
  WHERE cart_tbl.cart_id = ${orderData.cart_id}`

  con_db.database.query(checkCart, (error, rows)=>{
    if (error) {
      res.status(500).json({
        successful: false,
        message: "Error inserting order.",
      })
    }
    else if (rows.length == 0){
      res.status(404).json({
        successful: false,
        message: "Cart doesn't exist.",
      })
    }
    else{
      cart_controller.computeTotal(rows, (totalAmount, totalCount)=>{
          if (orderData.payment_method.toLowerCase() == "cash" && totalAmount > orderData.payment_change){
            res.status(400).json({
              successful: false,
              message: "Please enter sufficient amount.",
            })
          }
          else{
            let user = {
              first_name: firstName,
              last_name: lastName,
              email_add: emailAdd,
              contact_no: contactNo,
              address: address
            }
          
            let userQuery = `INSERT INTO users_tbl SET ?`;
          
            con_db.database.query(userQuery, user, (userError, userRows) => {
              if (userError) {
                res.status(500).json({
                  successful: false,
                  message: "Error in user query.",
                })
              } 
              else {
                let users_id = userRows.insertId;
          
                let ref_id = generateRefId();
          
                let order = {
                  ref_id: ref_id,
                  users_id: users_id,
                  // order_date: orderData.order_date,
                  // total_amount: orderData.total_amount,
                  delivery_date: orderData.delivery_date,
                  payment_method: orderData.payment_method,
                  payment_change: orderData.payment_change,
                  total_amount: totalAmount,
                  // status: orderData.status,
                  cart_id: orderData.cart_id
                }

                let orderQuery = `INSERT INTO orders_tbl SET ?`;
                console.log(order)
          
                con_db.database.query(orderQuery, order, (orderError, orderRows) => {
                  if (orderError) {
                    console.log(orderError)
                    res.status(500).json({
                      successful: false,
                      message: "Error inserting order.",
                    })
                  } 
                  else {
                    res.status(200).json({
                      successful: true,
                      message: "Successfully placed an order!",
                      ref_id: ref_id
                    })
                  }
                })
          
              
          
                
              }
            })
          }
      })
    }
  })

 
}


const viewOrderByRefId = (req, res, next) => {
  let ref_id = req.params.ref_id

  let query = `SELECT ref_id, users_id, cart_id, order_date, delivery_date, payment_method, payment_change, status,
  first_name, last_name, email_add, contact_no, address
  FROM orders_tbl 
  INNER JOIN users_tbl ON users_tbl.id = orders_tbl.users_id
  WHERE ref_id = ?`;

  con_db.database.query(query, [ref_id], (error, rows, result) => {
    if (error) {
      res.status(500).json({
        successful: false,
        message: "Error in query"
      })
    } 
    else {

      // res.status(200).json({
      //   successful: true,
      //   message: "Order viewed successfully!",
      //   order: rows 
      // })

      formatViewOrder(rows[0], (formattedDetails)=>{
        res.status(200).json({
          successful: true,
          message: "Order viewed successfully!",
          order: formattedDetails 
        })
      })
      
    }
  })
}

const formatViewOrder = (data, callback)=>{

  

  let orderDetails = {
    reference_id: data.ref_id,
    order_date: data.order_date,
    delivery_date: data.delivery_date,
    payment_method: data.payment_method,
    payment_change: parseFloat(data.payment_change === null ? 0 : data.payment_change)
  }

  let userDetails = {
    user_id: data.users_id,
    first_name: data.first_name, 
    last_name: data.last_name, 
    email_address: data.email_add,
    contact_no: data.contact_no, 
    address: data.address
  }

  let formattedOrder = {
    order_details: orderDetails,
    user_details: userDetails,
    cart_details: {}
  }
  cart_controller.viewOrderCart(data.cart_id, (result)=>{
      if (result != false){
        formattedOrder.cart_details = {
          cart_id: data.cart_id,
          cart_total_count : result.total_count,
          cart_total_amount : result.total_amount,
          cart_items : result.cart_items
      }
      }
      callback(formattedOrder)
  })
}

module.exports = {
  addOrder,
  viewOrderByRefId
}
