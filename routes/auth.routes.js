const express = require("express")
const router = express.Router()
const passport = require("passport")

const User = require("../models/user.model")

const bcrypt = require("bcryptjs")
const bcryptSalt = 10


//Sign up get
router.get("/registro", (req, res) => res.render("auth/signup"))

//Sign up post
router.post("/registro", (req, res, next) => {

    const { username, password } = req.body

    if (username.length === 0 || password.length === 0) {
        res.render("auth/signup", { errorMsg: "Rellena todos los campos" })
        return
    }

    User
        .findOne({ username })
        .then(user => {
            if (user) {
                res.render("auth/signup", { errorMsg: "La usuaria ya existe" })
                return
            }

            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            User
                .create({ username, password: hashPass })
                .then(() => res.redirect('/'))
                .catch(() => res.render("auth/signup", { errorMsg: "Hubo un error" }))
        })
        .catch(error => next(error))
})

//Login get
router.get('/inicio-sesion', (req, res) => res.render('auth/login'))

//Login post
router.post("/inicio-sesion", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/registro",
    failureFlash: true,
    passReqToCallback: true
}))

//Logout
router.get('/cerrar-sesion', (req, res) => {
    req.logout()
    res.redirect("/")
})
 

module.exports = router