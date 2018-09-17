const fs = require('fs');
const path = require('path');

module.exports = app => {

    require('./core/boot')(app);
    let modulesDir = 'modules';

    fs.readdir(path.join(__dirname, modulesDir), (err, modules) => {
        if (err) throw err;

        modules.forEach(moduleDir => {
            let routes = require(`./${modulesDir}/${moduleDir}/routes`);
            Object.keys(routes).forEach(route => {
                app.use(`/${route}`, routes[route]);
            });
        });
        app.get('*', function(req, res){
          res.render('cust-0extras/views/messagePage',{message: 'Page does not exist.', messBtn: 'Home', messLink: '/home'});
        });
    });
}
