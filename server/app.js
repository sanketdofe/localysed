const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const Sequelize = require('sequelize');
// const sequelize = new Sequelize('localysed', 'postgres', '123', {
//   host: 'localhost',
//   dialect: 'postgres',
// });
const app = express();

app.use(express.json());
app.use(bodyParser.json({
  extended: false
}));
app.use(cors());
clientport = "localhost:3000";

////////////////////////////////React App//////////////////////////////
app.get("/", (req, res) => {
    res.redirect(clientport);
});


/////////////////////////////Search page////////////////////////////////
let mainregion;
app.post("/api/homesearch", (req, res) => {
  //console.log(req.body);
  mainregion = req.body.field;
  res.json("server got the data");
});


//////////////////////////////Form Data/////////////////////////////////
app.post("/api/formdata", (req, res) => {
  console.log(req.body);
  res.json("server got the data");
});

//////////////////////////////Port Setup////////////////////////////////
app.listen(process.env.PORT || "5000", function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Server is up on port 5000");
    }
  });