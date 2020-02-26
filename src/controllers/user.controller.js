const usersCtrl = {}

const passport = require('passport')

const User = require('../models/User')

usersCtrl.renderSignUpForm = (req, res, next) => {
    res.render('users/signup')
}

usersCtrl.signup = async (req, res, next) => {
    const errors = []
    const {name, email, password, confirm_password} = req.body
    if (password != confirm_password) {
        errors.push({text: 'Passwords do not match'})
    }
    if (password.length < 4) {
        errors.push({text: 'Passwords must be at least 4 characters.'})
    }
    if (errors.length > 0) {
        res.render('/', {
            errors,
            name,
            email,
            password,
            confirm_password
        })
    } else {
        const emailUser = await User.findOne({email: email})
        if (emailUser) {
            req.flash('error_msg', 'The email is already in use.')
            res.redirect('/')
        } else {
            const newUser = new User({name, email, password})
            newUser.password = await newUser.encryptPassword(password)
            await newUser.save()
            req.flash('success_msg', 'You are registered')
            res.redirect('/')
        }
    }
}

usersCtrl.renderSigninForm = (req, res, next) => {
    res.render('/')
}

usersCtrl.signin = passport.authenticate('local', {
    failureRedirect: '/',
    successRedirect: '/notes',
    failureFlash: true
})

usersCtrl.logout = (req, res, next) => {
    req.logout()
    req.flash('success_msg', 'You are logged out now.')
    res.redirect('/')
}

module.exports = usersCtrl