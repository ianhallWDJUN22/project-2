
require("dotenv/config");


require("./db");


const express = require("express");


const hbs = require("hbs");

const app = express();


require('./config/session.config')(app);


require("./config")(app);


const projectName = "Dungeon Forge";

app.locals.appTitle = `${projectName}`;


const authRoutes = require('./routes/auth.routes');
app.use('/', authRoutes)


const index = require("./routes/index.routes");
app.use("/", index);


require("./error-handling")(app);

module.exports = app;
