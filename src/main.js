//#region global imports
const DButils = require("./dataLayer/utils/DButils.js");
const axios = require("axios");
const bcrypt = require("bcryptjs");
require("dotenv").config();
//#endregion
//#region express configures
var express = require("express");
var path = require("path");
const session = require("client-sessions");
var logger = require("morgan");
var cors = require("cors");
var app = express();

Object.size = function(obj) {
    var size = 0,
        key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

app.use(logger("dev")); //logger
app.use(express.json()); // parse application/json
app.use(
    session({
        cookieName: "session", // the cookie key name
        secret: process.env.COOKIE_SECRET, //process.env.COOKIE_SECRET, // the encryption key
        duration: 24 * 60 * 60 * 1000, // expired after 24 hours
        activeDuration: 1000 * 60 * 5, // if expiresIn < activeDuration,
        cookie: {
            httpOnly: false,
        },
        lastSearch: null,
        lastResponse: null,
    })
);
app.use(express.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, "public"))); //To serve static files such as images, CSS files, and JavaScript files

// middleware to serve all the needed static files under the dist directory - loaded from the index.html file
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("dist"));

const corsConfig = {
    origin: true,
    credentials: true,
};

app.use(cors(corsConfig));
app.options("*", cors(corsConfig));

const port = process.env.PORT;

const auth = require("./serviceLayer/routes/auth");
const matches = require("./serviceLayer/routes/matches");
const referees = require("./serviceLayer/routes/referees");
const unionRep = require("./serviceLayer/routes/unionRep");

//#endregion

//#region cookie middleware
app.use(function(req, res, next) {
    if (req.session && req.session.user_id) {
        DButils.execQuery("SELECT userId FROM users")
            .then((users) => {
                if (users.find((x) => x.user_id === req.session.user_id)) {
                    req.user_id = req.session.user_id;
                }
                next();
            })
            .catch((error) => next());
    } else {
        next();
    }
});
//#endregion

// ----> For cheking that our server is alive
app.get("/alive", (req, res) => res.send("I'm alive"));
// Routings
app.use("/matches", matches);
app.use("/referees", referees);
app.use("/unionRep", unionRep);

app.use(auth);

app.use(function(err, req, res, next) {
    console.error(err);
    res.status(err.status || 500).send(err.message);
});

const server = app.listen(port, () => {
    console.log(`Server listen on port ${port}`);
});