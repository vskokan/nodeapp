const { Pool } = require('pg')

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'fishing_test',
    password: '07112003',
    port: 5432,
})

// pool.query('SELECT NOW()', (err, res) => {
//   console.log(err, res)
//   pool.end()
// })

// const client = new Client({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'fishing',
//     password: '07112003',
//     port: 5432,
// })

// module.exports = {
//     query: function(text, values, cb) {
//        client.connect(function(err, client, done) {
//          client.query(text, values, function(err, result) {
//            //done();
//            cb(err, result)
//          })
//        });
//     }
//  }

// client.connect()

// client.query('SELECT NOW()', (err, res) => {
//   console.log(err, res)
//   client.end()
// })

module.exports = {
    query: (text, params, callback) => {
      return pool.query(text, params, callback)
    },
    close: () => {
        return pool.end(() => {
            console.log('pool has ended')
          })
    },
    connect: () => {
        return pool.connect((err, client, release) => {
            if (err) {
              return console.error('Error acquiring client', err.stack)
            }
            client.query('SELECT NOW()', (err, result) => {
              release()
              if (err) {
                return console.error('Error executing query', err.stack)
              }
              console.log(result.rows)
            })
          })
    }
  }