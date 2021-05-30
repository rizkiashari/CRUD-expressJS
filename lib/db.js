const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: null,
  database: "scheduleapp",
});

connection.connect((error) => {
  if (error) {
    console.log(error);
  }
  else {
    console.log("Connected...");
  }
})

module.exports = connection;