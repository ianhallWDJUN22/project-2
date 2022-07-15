const isLoggedIn = (req, res, next) => {

    if(!req.session.currentUser){
        res.render('auth/login.hbs', { errorMessage: 'Some features are only available when logged in!'})
        return;
    }

    next();
}

const isLoggedOut = (req, res, next) => {
    
    if(req.session.currentUser) {
        res.redirect('/user-profile');
        return;
    }
   
    next();

}

module.exports = {
    isLoggedIn,
    isLoggedOut
}