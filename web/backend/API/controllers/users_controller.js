const con_db = require('../models/con_db')

const guest = (req, res, next)=>{
    let firstName = req.body.first_name
    let lastName = req.body.last_name
    let emailAdd = req.body.email_add
    let contactNo = req.body.contact_no
    let address = req.body.address

    let User = {
        first_name: firstName,
        last_name: lastName,
        email_add: emailAdd,
        contact_no: contactNo,
        address: address
    }

    let query = `INSERT INTO users_tbl SET ?`

    con_db.database.query(query, User, (error, rows, result)=>{                                                                                                                                          
        if (error){
            res.status(500).json({
                successful: false,
                message: "Error in query."
            })
        }
        else{
            res.status(200).json({
                successful: true,
                message: "Successfully registered a guest!"
            })
        }
    })
}

module.exports = {
    guest
}
                                          