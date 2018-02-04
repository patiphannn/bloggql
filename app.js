import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import graphqlHTTP from 'express-graphql';
import mongoose from 'mongoose';
import passport from 'passport';

import index from './routes/index';
// import users from './routes/users';

import schema from './graphql/schema';

var app = express();
const dev = process.env.NODE_ENV === 'development';

// Connect to MongoDB
mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://localhost:27017/blog',
  {
    promiseLibrary: global.Promise
  }
);
var db = mongoose.connection
db.on('error', function(err) {
  console.error(`MongoDB connection error: ${err}`);
  process.exit(-1); // eslint-disable-line no-process-exit
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
// app.use('/users', users);

// app.use(
//   '/graphql',
//   graphqlHTTP((req, res) => ({
//     schema,
//     rootValue: {req, res, next},
//     graphiql: dev,
//   })
// ));

app.use(
  '/graphql',
  graphqlHTTP((req, res) => {
    return new Promise((resolve, reject) => {
       const next = (/*context, info = {}*/) => {
           resolve({
               schema,
               graphiql: dev
           });
       };

       next();
   });
  })
);

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
  res.render('error');
});

module.exports = app;
