const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');
const cookieSession = require('cookie-session');
const keys = require('../../config/keys');
const passport = require('passport');
const flash = require('express-flash');
const fileUpload = require('express-fileupload');

module.exports = app => {

    app.set('port', process.argv[2] || process.env.PORT || 3000);
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'ejs');
    app.set('views', path.join(path.dirname(__dirname), 'modules'));
    app.use(morgan('dev'));
    app.use(serveStatic(path.join(path.dirname(path.dirname(__dirname)), 'public')));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieSession({
      name: 'session',
      maxAge: 24 * 60 * 60 * 1000,
      keys: [keys.session.cookieKey]
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());
    app.use(fileUpload());

}
