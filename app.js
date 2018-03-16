let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');

let config = require("./config");

// including routes files
let routes = require('./routes/route.js');
let auth = require('./routes/auth.js');

let app = express();
let server = require('http');

// database connection
let options = {
    keepAlive: 300000,
    connectTimeoutMS: 30000
};

mongoose.Promise = global.Promise;

let mongoURI = config.mongoURI;
mongoose.connect(mongoURI, options);

//Swagger UI
const swaggerUi = require('swagger-ui-express');

const swaggerDocument = require('./swagger.json');
// const swaggerDocument = require('./swagger.yaml');

let port = process.env.port || 8000;
let backend = server.createServer(app).listen(port);

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Database Connected!');
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/user',routes);
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument,options));

console.log("Express Server on port = " + port);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json(err);
});

module.exports = app;
