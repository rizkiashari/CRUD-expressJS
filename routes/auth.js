const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const dbConnection = require('../lib/db');
const {authCheck} = require("../middleware/auth");
const { log } = require('debug');

router.get("/", (req, res) => {
  res.render("home/home");
})

router.get("/login", (req, res) => {
  const isUser = true;
  if (isUser) {
    res.render("auth/login", {
      email: "",
      password: "",
    });
  } else {
    res.send("Gagal Login");
  }
  
});

router.post("/auth-login", (req, res) => {
  let { email, password } = req.body;

  if (!email.length || !password.length) {
    req.flash("error", "Silahkan isi semua data!!!");
    res.render("auth/login", {
       email,
    });
  }

  dbConnection.query(`SELECT * FROM user WHERE email = ?`, email, (error, data) => {
    if (error) throw error;
    console.log(data);
    if (!data.length) {
      req.flash("error", "Email anda salah");
      res.render("auth/login", { email ,});
    }
    else {
      bcrypt.compare(password, data[0].password, (err, result) => {
        if (err) throw err;

        if (!result) {
          console.log(result);
          req.flash("error", "Password salah");
          res.render("auth/login", {
            email
          });
        } else {
          req.session.idUser = data[0].idUser;
          res.redirect("/schedule");
        }
      });
    }
  })
});

router.get("/register", (req, res) => {
  res.render("auth/register", {
    title: "Sign Up Form",
    name: "",
    email: "",
    telp: "",
    password: "",
    address: "",
  });
});

router.post("/auth-register", async (req, res) => {
  const { name, password, email, telp, address } = req.body;
  
  let error = false;

  if (!name.length || !password.length || !email.length || !telp.length || !address.length) {
    error = true;
    req.flash("error", "Silahkan isi semua data!!!");
    res.render("auth/register", {
      name, password, email, telp, address
    });
  }

  if (!error) {
    const saltRounds = 12;
    const formData = {
      name,
      password : await bcrypt.hash(password, saltRounds),
      email,
      telp,
      address,
    };
    dbConnection.query("INSERT INTO user SET ?", formData, (error, data) => {
      if (error) {
        req.flash("error", error);
      } else {
        req.flash("success", `Welcome ${name} to Sche App`);
        req.session.idUser = data.insertId;
        res.redirect("/schedule");
      }
    });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  })
});

router.get("/profile", authCheck, (req, res) => {
  dbConnection.query(`SELECT * FROM user WHERE idUser= ${req.session.idUser}`, (error, data) => {
    if (error) {
      console.log(error);
      req.flash("error", error);
    }
    else {
      res.render("auth/profile", {
        data: data[0],
      })
    }
  })
});

module.exports = router;