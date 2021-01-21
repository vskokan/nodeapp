var events = require('events').EventEmitter.defaultMaxListeners = 0;

const express = require("express");
const cors = require('cors')
const app = express();
var bodyParser = require('body-parser');
var corsOptions = {
  origin: "*"
};


app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(express.static(__dirname))

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

app.listen(3000) //, '192.168.0.102');