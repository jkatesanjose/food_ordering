const con_db = require('../models/con_db')

const cart_controller = require('../controllers/cart_controller')

const viewAllMenu = (req, res, next) => {
    let query = `SELECT * FROM menu_tbl`;

    con_db.database.query(query, (error, rows) => {
        if (error) {
            res.status(500).json({
                successful: false,
                message: "Error in query."
            })
        } 
        else {
            res.status(200).json({
                successful: true,
                message: "Successfully viewed all menu items",
                menuItems: rows
            })
        }
    })
}

const viewMenuById = (req, res, next) => {
    const menuItemId = req.params.menuItemId;

    let query = 'SELECT * FROM menu_tbl WHERE id = ?';

    con_db.database.query(query, [menuItemId], (error, rows) => {
        if (error) {
            res.status(500).json({
                successful: false,
                message: "Error in query"
            })
        } 
        else {
            if (rows.length === 0) {
                res.status(404).json({
                    successful: false,
                    message: "Menu item not found",
                })
            } 
            else {
                res.status(200).json({
                    successful: true,
                    message: "Successfully viewed menu item",
                    menuItem: rows[0]
                })
            }
        }
    })
}

const viewMenuByPopularity = (req, res, next) => {
    let query = 'SELECT * FROM menu_tbl WHERE popularity = 1';

    con_db.database.query(query, (error, rows) => {
        if (error) {
            res.status(500).json({
                successful: false,
                message: "Error in query"
            })
        } 
        else {
            if (rows.length === 0) {
                res.status(404).json({
                    successful: false,
                    message: "Popular menu item not found",
                })
            } 
            else {
                res.status(200).json({
                    successful: true,
                    message: "Successfully viewed popular menu",
                    menuItem: rows
                })
            }
        }
    })
}

const viewMenuByCategory = (req, res, next) => {
    const category = req.params.category;
    const cartID = req.body.cart_id;

    let query = `SELECT menu_tbl.id, name, description, category, price, size, menu_pricesize.id as size_id, image FROM menu_tbl INNER JOIN menu_pricesize ON menu_pricesize.type = menu_tbl.pricesize`

    if (category != "all"){
        query += " WHERE category = ?"
    }

    query += ` ORDER BY menu_tbl.id`
    // let query = 'SELECT * FROM menu_tbl WHERE category = ?';

    con_db.database.query(query, [category], (error, rows) => {
        if (error) {

            console.log(error)
            res.status(500).json({
                successful: false,
                message: "Error in query"
            })
        } 
        else {
            
            if (rows.length === 0) {
                res.status(404).json({
                    successful: false,
                    message: "Menu category not found",
                })
            } 
            else {
                // console.log(rows)

                cart_controller.viewMenuCart(cartID, (result)=>{

                    if (result.successful == false){
                        res.status(500).json({
                            successful: false,
                            message: result.message
                        })
                    }
                    else{
                        createPriceObj(rows, result.cart_items, (newRows)=>{

                            // console.log(JSON.stringify(newRows))
                            res.status(200).json({
                                successful: true,
                                message: "Successfully viewed menu category",
                                cart_count: result.cart_count,
                                category: newRows
                            })
                        })
                    }
                })
                
                
            }
        }
    })
}

const createPriceObj = (rows, result, callback)=>{
    
    let idRows = []
    let newRows = []
    let priceRows = []
    let cartRows = []
    for (let ind=0;ind<rows.length;ind++){
        if (!(idRows.includes(rows[ind].id))){
            newRows.push({
                "id": rows[ind].id,
                "name": rows[ind].name,
                "description": rows[ind].description,
                "category": rows[ind].category,
                "image": rows[ind].image
            })

            idRows.push(rows[ind].id)
        }
        else{
            continue
        }

    }

    // console.log(`ROWS: ${JSON.stringify(rows)}`)
    // console.log(`NEW ROWS: ${JSON.stringify(newRows)}`)
    for (let i in newRows){
        for (let ind in rows){
            if (rows[ind].id == newRows[i].id){
                priceRows.push({
                    "price": rows[ind].price,
                    "size": rows[ind].size,
                    "size_id": rows[ind].size_id
                })
            }
        }

        newRows[i].price_rows = priceRows
        priceRows = []
    }

    for (let i in newRows){
        for (let ind in result){
            if (result[ind].menu_id == newRows[i].id){
                cartRows.push({
                    "total_amount": (result[ind].quantity*result[ind].price),
                    "quantity": result[ind].quantity,
                    "size_id": result[ind].menu_size,
                    "selected_size": result[ind].size
                })
            }
        }

        newRows[i].cart_rows = cartRows
        cartRows = []
    }

    callback(newRows)
}

module.exports = {
    viewAllMenu,
    viewMenuById,
    viewMenuByPopularity,
    viewMenuByCategory
}
                                      