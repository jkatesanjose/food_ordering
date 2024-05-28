const mysql = require('mysql')

const database = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "food_ordering"
})

const connectDB = ()=>{
    database.connect((error)=>{
        if (error){
            console.log("Error connecting to database.")
        }
        else{
            console.log("Successfully connected to database!")
        }
    })
}

module.exports = {
    database,
    connectDB
}