var events = require('events').EventEmitter.defaultMaxListeners = 0;

const express = require("express");
const cors = require('cors')
const app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var routes = require('./au/au-routes.js');

var corsOptions = {
  origin: "http://localhost:8080",
  credentials: true
};


app.use(bodyParser.json());
app.use(cookieParser())
app.use(cors(corsOptions));
app.use(express.static(__dirname))
app.use('/api/au/', routes)

require("./routes/fish-routes")(app);
require("./routes/user-routes")(app);
require("./routes/bait-routes")(app);
require("./routes/method-routes")(app);
require("./routes/district-routes")(app);
require("./routes/place-routes")(app);
require("./routes/review-routes")(app);
require("./routes/fact-routes")(app);
require("./routes/fullReview-routes")(app);
require("./routes/fullReview2-routes")(app);
// require("./au/au-routes")(app);
//Test
app.listen(3000) //, '192.168.0.102');