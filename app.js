const express = require("express");
const cors = require('cors')
const app = express();
//const client = require('./db')
var bodyParser = require('body-parser');
var corsOptions = {
  origin: "*"
};
app.use(bodyParser.json());
app.use(cors(corsOptions));

require("./routes/fish-routes")(app);
require("./routes/user-routes")(app);
require("./routes/bait-routes")(app);
require("./routes/method-routes")(app);
require("./routes/waterbody-routes")(app);
require("./routes/review-routes")(app);
require("./routes/fact-routes")(app);
require("./routes/fullReview-routes")(app);
// app.get('/fishes', function (req, res, next) {
   
//       client.query('SELECT * FROM fishes;', [], function (err, result) {
//         if (err) {
//           return next(err)
//         }
//         res.json(result.rows)
//       })
//     })

// app.post('/fishes', function(req, res, next) {
    
//     const fish = {
//         id: req.body.id,
//         name: req.body.name,
//         photoLink: req.body.photoLink,
//         description: req.body.description
//       }

//      client.query('INSERT INTO fishes (id, name, photoLink, description) VALUES ($1, $2, $3, $4);', [fish.id, fish.name, fish.photoLink, fish.description], function (err, result) {
//         if (err) {
//             return next(err)
//           }
          
//           res.send(result)
//         })
        
// })


app.listen(3000);