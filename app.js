const express = require("express");
const bodyParser = require("body-parser");
const expressLayouts = require("express-ejs-layouts");
const app = express();

// use ejs and express layouts
app.set("view engine", "ejs");
app.use(expressLayouts);

// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// route our app
const router = require("./app/routes");
app.use("/", router);

// set static files (css and images, etc) location
app.use(express.static(`${__dirname}/site`));

app.listen("3000", () => console.log("Server listening at port", "3000"));
