const express = require("express");
const app = express();

app.listen(5000, console.log("app listening on port 5000"));
app.use(express.static(__dirname + "/views/LoginPage"));
app.use(express.static(__dirname + "/views/loginSignupResponse"));
app.use(express.static(__dirname + "/views/home"));
app.use(express.static(__dirname + "/views/character"));
app.use(express.json());
app.set("view engine", "ejs");

class User {
  constructor(username, email, password) {
    this.username = username.trim();
    this.email = email.trim();
    this.password = password.trim();
  }
}

let users = [];
users.push(new User("mouad", "mouad.berrami@gmail.com", "berrami"));
app.get("/login", (req, res) => {
  return res.sendFile(__dirname + "/views/LoginPage/login.html");
});

app.get("/loginInfo", (req, res) => {
  let data = req.query;
  let userExists = users.findIndex(
    (obj) =>
      obj.username == data.username.trim() &&
      obj.password == data.password.trim()
  );
  console.log(userExists);
  return res.render("loginSignupResponse/response.ejs", {
    username: data.username,
    login: userExists != -1,
    type: "login",
  });
});

app.get("/signupInfo", (req, res) => {
  let data = req.query;

  let lookup = users.findIndex((obj) => obj.username == data.username.trim());
  if (lookup == -1) {
    let newUsr = new User(data.username, data.email, data.password);
    users.push(newUsr);
  }
  return res.render("loginSignupResponse/response.ejs", {
    username: data.username,
    login: lookup == -1,
    type: "signup",
  });
});
app.get("/homepage", (req, res) => {
  return res.sendFile(__dirname + "/views/home/homepage.html");
});

app.get("/character", async (req, res) => {
  let id = req.query.id;

  let characterPromise = await fetch(
    `https://rickandmortyapi.com/api/character/${id}`
  );

  let characterData = await characterPromise.json();

  try {
    res.render("character/character.ejs", characterData);
  } catch (error) {
    res.redirect("http://localhost:5000/homepage");
  }
  return;
});
