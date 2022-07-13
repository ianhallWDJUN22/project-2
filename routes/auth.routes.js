const router = require('express').Router();
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const User = require('../models/User.model');

const { isLoggedIn, isLoggedOut } = require('../middlewares/auth.middleware');


// router.get('/user-profile', isLoggedIn, (req, res, next) => {
//     res.render("user/user-profile.hbs", { user: req.session.currentUser});
// })

router.get("/signup", isLoggedOut, (req, res, next) => {
    res.render("auth/signup.hbs");
})

router.post('/signup', (req, res, next) => {
    
    const { email, username, password} = req.body;
    console.log('form data', req.body)
    
    if (email === '' || password === '' || username === '') {
        res.render('auth/signup', {
            errorMessage: 'Must enter a valid email, username, and password to create account.'
        })
        return;
     }
     User.findOne({ email })
        .then(foundUser => {
            if(foundUser) {
            res.render('auth/signup.hbs', { errorMessage: 'An account is already attached to this email.' })
            } 
            return;
        })

     User.findOne({ username })
        .then(foundUser => {
            if(foundUser) {
                res.render('auth/signup.hbs', { errorMessage: 'This username already exists, please choose a different username and try again.' })
            }
            return;
        })

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => {
           return bcryptjs.hash(password, salt);
        })
        .then(hashedPassword => {
            return User.create({
                email,
                username,
                password: hashedPassword
            })
        })
        .then(createdUser => {
            console.log('Newly created user:', createdUser)
            res.redirect('/')
            
        })
        
        .catch(err => {
            console.log(err)
            next(err)
        })

    })

router.get("/login", isLoggedOut, (req, res, next) => {
    res.render("auth/login.hbs");
})

router.post('/login', isLoggedOut, (req, res, next) =>{
    const {email, password } = req.body;
    if (email === '' || password === '') {
        res.render('auth/login', {
            errorMessage: 'Must enter both email and password to login.'
        })
        return;
    }

    let myUser;
    User.findOne({ email })
        .then(foundUser => {
            console.log('Found User:', foundUser);
       
            myUser = foundUser;
            if(foundUser === null) {
            res.render('auth/login.hbs', { errorMessage: 'Incorrect email or password.' })
        } else {
        return bcryptjs.compare(password, foundUser.password)
        }

        }) 
        .then(isValidPassword => {
            if(isValidPassword){
               console.log(req.session)
                req.session.currentUser = myUser;
                res.redirect('/user-profile')
            } else {
            res.render('auth/login.hbs', { errorMessage: 'Incorrect email or password.' })
            }
        })
        .catch(error => next(error));
});



module.exports = router;