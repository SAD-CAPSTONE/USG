var morgan = require('morgan');
var path = require('path');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var session = require('express-session');
var fileUpload = require('express-fileupload');

module.exports = app => {

    app.set('port', process.argv[2] || process.env.PORT || 3000);
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'ejs');
    app.set('views', path.join(path.dirname(__dirname), 'modules'));
    app.use(morgan('dev'));
    app.use(serveStatic(path.join(path.dirname(path.dirname(__dirname)), 'public')));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(session({ secret: '1D0XahxsMpDyeYwcTsbt', resave: true, saveUninitialized: true }));
    app.use(fileUpload());

}
