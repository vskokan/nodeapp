const express = require("express");
const cors = require('cors')
const app = express();
var bodyParser = require('body-parser');
var corsOptions = {
  origin: "*"
};




//var events = require('events').EventEmitter.defaultMaxListeners = 15;

app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(express.static(__dirname))

require("./routes/fish-routes")(app);
require("./routes/user-routes")(app);
require("./routes/bait-routes")(app);
require("./routes/method-routes")(app);
// require("./routes/waterbody-routes")(app);
require("./routes/review-routes")(app);
require("./routes/fact-routes")(app);
require("./routes/fullReview-routes")(app);

app.listen(3000);