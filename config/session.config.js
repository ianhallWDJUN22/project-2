const session = require('express-session');

const MongoStore = require('connect-mongo');

module.exports = (app) => {

    app.set('trust proxy', 1)

app.use(
    session({
        secret: 'Super Secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            sameSite: 'lax',
            path: '/',
            httpOnly: true,
            secure: false,
            maxAge: 6000000
        },
        store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost/lab-express-basic-auth'})

    }))

};