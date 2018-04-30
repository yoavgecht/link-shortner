const express = require("express");
const cors = require('cors');
const app = express();
const path = require("path");
const keys = require('../keys');
const mongoose = require('mongoose');
const dbUrl = process.env.MONGOLAB_CYAN_URI || `mongodb://localhost:27017/${keys.localDbName}`;
const port = process.env.PORT || 8080;
const bodyParser = require("body-parser");
const router = require("./routes/routes");


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../build")));

mongoose.connect(dbUrl);

mongoose.connection.on('open', () => {
   console.log(`MongoDB connected: ${mongoose.connection.db.databaseName}`);
});

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB error: ${err}`);
});

app.use('/', router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
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
  res.json({ message: 'An Error Occurred', error: err });
});

app.listen(port);
console.log("listening on " + port);
