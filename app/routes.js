const express = require("express");
const fetch = require("node-fetch");
const btoa = require("btoa");
const bodyParser = require("body-parser");
const request = require("request");
var router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

const CLIENT_ID = "";
const CLIENT_SECRET = "";
const redirect = encodeURIComponent("http://localhost:3000/callback");

router.get("/", (req, res) => {
  res.render("login");
});

router.get("/login", (req, res) => {
  res.redirect(`https://discordapp.com/oauth2/authorize?client_id=${CLIENT_ID}&scope=identify&response_type=code&redirect_uri=${redirect}`);
});
const catchAsyncErrors = fn =>
  (req, res, next) => {
    const routePromise = fn(req, res, next);
    if (routePromise.catch) {
      routePromise.catch(err => next(err));
    }
  }
  ;
const tokens = [];
router.get("/callback", catchAsyncErrors(async (req, res) => {
  if (!req.query.code) throw new Error("NoCodeProvided");
  const { code } = req.query;
  const creds = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
  const response = await fetch(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirect}`,
    {
      method: "POST",
      headers: { Authorization: `Basic ${creds}` }
    });
  const json = await response.json();
  console.log(json);
  tokens.push(json.access_token);
  res.redirect(`/user/${json.access_token}`);
  console.log(tokens);
}));

router.get("/user/:token", (req, res) => {
  // console.log(req.params);
  var options = {
    method: "GET",
    url: "https://discordapp.com/api/v6/users/@me",
    headers:
    { authorization: `Bearer ${req.params.token}` }
  };
  request(options, (error, response, body) => {
    if (error) throw new Error(error);
    const data = JSON.parse(body);
    console.log(data);
    res.render("user", { name: data.username, discrirm: data.discriminator, mfa: data.mfa_enabled, id: data.id });
  });
});

module.exports = router;
