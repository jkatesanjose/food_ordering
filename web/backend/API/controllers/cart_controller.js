const con_db = require('../models/con_db');

const generateCartId = function(length = 4) {
  const numbers = '0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * numbers.length);
    result += numbers.charAt(randomIndex);
  }
  return result;
}

// const addToCart = (req, res, next) => {
//   let menu_id = req.body.menu_id;
//   let menu_size = req.body.menu_size;
//   let quantity = req.body.quantity;
//   let cart_id = generateCartId();

//   let cartData = {
//     menu_id: menu_id,
//     menu_size: menu_size,
//     quantity: quantity,
//     cart_id: cart_id
//   }
  

//   let cartQuery = 'SELECT cart_id ';

//   con_db.database.query(cartQuery, cartData, (error, result) => {
//     if (error) {
//       return res.status(500).json({
//         successful: false,
//         message: "Error in query."
//       })
//     }

//     let cartQuery = 'INSERT INTO cart_tbl SET ?';

//     res.status(200).json({
//       successful: true,
//       message: "Successfully added an item to the cart!",
//       cart: rows
//     })
//   })
// }

const addToCart = (req, res, next) => {
  let menu_id = req.body.menu_id;
  let menu_size = req.body.menu_size;
  let quantity = req.body.quantity;
  let cart_id = (req.body.cart_id == null || req.body.cart_id == 0) ? parseInt(generateCartId()) : req.body.cart_id;

  let cartData = {
    menu_id: menu_id,
    menu_size: menu_size,
    quantity: quantity,
    cart_id: cart_id
  }

  // Check if cart_id already exists
  let cartQuery = 'SELECT cart_id, quantity FROM cart_tbl WHERE cart_id = ? AND menu_id = ?';

  con_db.database.query(cartQuery, [cart_id, menu_id], (error, result) => {
    if (error) {
     
      return res.status(500).json({
        successful: false,
        message: "Error in query."
      });
    }

    // Cart_id already exists, return an error response
    if (result.length > 0) {
      
      // UPDATE QUANTITY OF CART
      let newQuantity = quantity;

      let updateQuery = 'UPDATE cart_tbl SET quantity = ?, menu_size = ? WHERE cart_id = ? AND menu_id = ?';

      con_db.database.query(updateQuery, [newQuantity, menu_size, cart_id, menu_id], (error, result) => {
        if (error) {
          return res.status(500).json({
            successful: false,
            message: "Error in query."
          })
       }

        res.status(200).json({
          successful: true,
          message: "Item quantity updated successfully!",
          cart_id: cart_id
        })
      })
    }

    // Cart_id doesn't exist, proceed with insertion
    else{
      let insertQuery = 'INSERT INTO cart_tbl SET ?';

    con_db.database.query(insertQuery, cartData, (error, result) => {
      if (error) {
        console.log(error)
        return res.status(500).json({
          successful: false,
          message: "Error in query."
        });
      }

      res.status(200).json({
        successful: true,
        message: "Successfully added an item to the cart!",
        cart_id: cart_id
      });
    });
    }
  });
};


const updateCartItem = (req, res, next) => {
  let cartItemId = req.body.id;
  let newSize = req.body.menu_size;
  let quantity = req.body.quantity;

  const updateQuery = 'UPDATE cart_tbl SET quantity = ?, menu_size = ? WHERE id = ?';

  con_db.database.query(updateQuery, [quantity, newSize, cartItemId], (error, result) => {
    if (error) {
      return res.status(500).json({
        successful: false,
        message: "Error in query."
      })
    }

    res.status(200).json({
      successful: true,
      message: "Cart item updated successfully!"
    })
  })
}

const updateItemQty = (req, res, next) => {
  const cartItemId = req.params.id;
  const newQuantity = req.body.quantity;

  const updateQuery = 'UPDATE cart_tbl SET quantity = ? WHERE id = ?';

  con_db.database.query(updateQuery, [newQuantity, cartItemId], (error, result) => {
    if (error) {
      return res.status(500).json({
        successful: false,
        message: "Error in query."
      })
    }

    res.status(200).json({
      successful: true,
      message: "Item quantity updated successfully!"
    })
  })
}

const deleteItem = (req, res, next) => {
  const cartItemId = req.body.id;

  const deleteQuery = 'DELETE FROM cart_tbl WHERE id = ?';

  con_db.database.query(deleteQuery, [cartItemId], (error, result) => {
    if (error) {
      return res.status(500).json({
        successful: false,
        message: "Error in query."
      })
    }

    res.status(200).json({
      successful: true,
      message: "Successfully deleted an item!"
    })
  })
}

const viewMenuCart = (cartID, callback)=>{
  const viewQuery = `SELECT quantity, menu_tbl.id as menu_id, menu_size, size, price
  FROM cart_tbl
  INNER JOIN menu_tbl on cart_tbl.menu_id = menu_tbl.id
  INNER JOIN menu_pricesize on cart_tbl.menu_size = menu_pricesize.id
  WHERE cart_tbl.cart_id = ${cartID}`;

  con_db.database.query(viewQuery, (error, rows) => {
    if (error) {
      callback(
        {
          successful: false,
          message: "Error in query."
        }
      )
    }
    else{

      if (rows.length < 1){

        callback(
          {
            successful: true,
            message: "No cart Items!",
            cart_count: 0,
            cart_items: []
          }
        )
      }
      else{
        computeTotal(rows, (totalAmount, totalCount)=>{
          callback({
            successful: true,
            message: "Successfully viewed the cart items!",
            cart_count: totalCount,
            cart_items: rows
          })
        })
        
        
      }
    }


    
  })
}

const viewCart = (req, res, next) => {

  let cartID = req.body.cart_id
  const viewQuery = `SELECT cart_tbl.id as cart_id, quantity, menu_tbl.id as menu_id, name, menu_size, size, price, image
  FROM cart_tbl
  INNER JOIN menu_tbl on cart_tbl.menu_id = menu_tbl.id
  INNER JOIN menu_pricesize on cart_tbl.menu_size = menu_pricesize.id
  WHERE cart_tbl.cart_id = ${cartID}`;

  con_db.database.query(viewQuery, (error, rows) => {
    if (error) {
      return res.status(500).json({
        successful: false,
        message: "Error in query."
      })
    }

    if (rows.length < 1){
      res.status(200).json({
        successful: true,
        message: "No cart Items!",
        cart_items: []
      })
    }
    else{
      checkPriceRows(rows, (result)=>{
        if (result.successful == false){
          res.status(500).json({
            successful: false,
            message: result.message
          })
        }
        else{
          addPriceRows(rows, result.data, (newRows)=>{
            computeTotal(newRows, (totalAmount, totalCount)=>{
              res.status(200).json({
                successful: true,
                message: "Successfully viewed the cart items!",
                total_amount: totalAmount,
                total_count: totalCount,
                cart_items: newRows
              })
            })
          })
        }
        
        
      })
      
      
    }

    
  })
}

const viewOrderCart = (cartID, callback) => {

  const viewQuery = `SELECT cart_tbl.id as cart_id, quantity, menu_tbl.id as menu_id, name, menu_size, size, price, image
  FROM cart_tbl
  INNER JOIN menu_tbl on cart_tbl.menu_id = menu_tbl.id
  INNER JOIN menu_pricesize on cart_tbl.menu_size = menu_pricesize.id
  WHERE cart_tbl.cart_id = ${cartID}`;

  con_db.database.query(viewQuery, (error, rows) => {
    if (error) {
      callback({
        successful: false,
        message: "Error in query.",
        total_amount: 0,
        total_count: 0,
        cart_items: []
      })
    }

    if (rows.length < 1){
      callback({
        successful: false,
        message: "No cart Items!",
        total_amount: 0,
        total_count: 0,
        cart_items: []
      })
    }
    else{
      checkPriceRows(rows, (result)=>{
        if (result.successful == false){
          callback({
            successful: false,
            message: result.message,
            total_amount: 0,
            total_count: 0,
            cart_items: []
          })
        }
        else{
          addPriceRows(rows, result.data, (newRows)=>{
            computeTotal(newRows, (totalAmount, totalCount)=>{
              callback({
                successful: true,
                message: "Successfully viewed the cart items!",
                total_amount: totalAmount,
                total_count: totalCount,
                cart_items: newRows
              })
            })
          })
        }
        
        
      })
      
      
    }

    
  })
}

const checkPriceRows = (rows, callback)=>{

  let query = `SELECT menu_tbl.id, price, size, menu_pricesize.id as size_id FROM menu_tbl INNER JOIN menu_pricesize ON menu_pricesize.type = menu_tbl.pricesize WHERE `

  for (let i=0; i<rows.length; i++){
    if (i != rows.length - 1){
      query += ` menu_tbl.id = ${rows[i].menu_id} OR`
    }
    else{
      query += ` menu_tbl.id = ${rows[i].menu_id}`
    }
    
  }

  // console.log(query)
  con_db.database.query(query, (error, result) => {
    if (error) {
      // console.log(error)
      callback({
        successful: false,
        message: "Error in query."
      })

    }
    else{

      callback(
        {
          successful: true,
          message: "successfully get all price rows",
          data: result
        }
      )
      
    }

    
  })

}

const addPriceRows = (rows, result, callback)=>{
  
    // let newRows = []
   


    // console.log(`result: ${JSON.stringify(result)}`)
    // console.log(`NEW ROWS: ${JSON.stringify(newRows)}`)
    for (let i in rows){
        rows[i].price_rows = []
        for (let ind in result){
          // console.log(` rows : ${rows[i].menu_id}`)
          // console.log(`result : ${result[ind].id}`)
            if (result[ind].id == rows[i].menu_id){
              // console.log('true')
              rows[i].price_rows.push({
                    "price": result[ind].price,
                    "size": result[ind].size,
                    "size_id": result[ind].size_id
                })
            }
        }

        // newRows[i].price_rows = priceRows
        // priceRows = []
    }


    callback(rows)
}

const computeTotal = (rows, callback)=>{

  let totalAmount = 0
  let totalCount = 0
    for (let i in rows){
      totalAmount += rows[i].quantity * rows[i].price
      totalCount += rows[i].quantity
    }

    callback(totalAmount, totalCount)
}

module.exports = {
  addToCart,
  updateCartItem,
  updateItemQty,
  deleteItem,
  viewCart,
  computeTotal,
  viewMenuCart,
  viewOrderCart
}
