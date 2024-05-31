require("dotenv").config()
const mysql = require("mysql")

const db = new mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});
db.connect((error)=>{
    if(error){
    console.log("error connecting to database");
    return;
}
    console.log("connected to the database successfully")
})


module.exports = db