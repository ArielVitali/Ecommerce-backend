const passport = require('passport');
const initializePassport = require('../passport.config');

const pasportConfig = (app) => {
    initializePassport();
app.use(passport.initialize());
app.use(passport.session());
}

module.exports = pasportConfig;