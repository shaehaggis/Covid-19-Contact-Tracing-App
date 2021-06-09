var express = require('express');
var router = express.Router();

const CLIENT_ID = '446524906437-lhb7qotm0adcd8j891vm50ol8t1p0u5h.apps.googleusercontent.com';

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);
/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });



router.post('/login', function(req, res, next) {
  var typeLogin=req.body.type;
    var user=0;
    var venMan=0;
    var HO=0;
    if(typeLogin=="venuemanager")
      {
        venMan=1;
      }
      else if(typeLogin=="healthofficial")
      {
        HO=1;
      }
  if( 'user' in req.body &&
        'pass' in req.body) {
  req.pool.getConnection(function(err,connection)
  {
      if(err)
      {
        console.log(err);
          res.sendStatus(500);
          return;
      }
      var email=req.body.user;
      var pass=req.body.pass;
      var isHOorVenman=0;

      var query=`SELECT userID, given_name,isVenueManager,isHealthOfficial  FROM users WHERE email= ? AND  password=SHA2(?,256) AND isUser=?;`;
      if(typeLogin=="venuemanager")
      {
        isHOorVenman=1;
        query=`SELECT userID, given_name,isVenueManager,isHealthOfficial FROM users WHERE email= ? AND  password=SHA2(?,256) AND isVenueManager=?`;
      }
      else if(typeLogin=="healthofficial")
      {
        isHOorVenman=1;
        query=`SELECT userID, given_name,isVenueManager,isHealthOfficial FROM users WHERE email= ? AND  password=SHA2(?,256) AND isHealthOfficial=?`;

      }


      connection.query(query,[email,pass,isHOorVenman],function(err,rows,fields)
      {
          connection.release();
          if(err)
          {
              console.log(err);
              res.sendStatus(500);
              return;
          }
            // res.send(req.session.user);
            if(rows.length===0)
            {
                res.sendStatus(401);
                return;
            }
            req.session.user = rows;
            console.log("logged in");
            res.json(rows);


              });
          });
        }

        else if( 'token' in req.body ) {

        async function verify() {
          const ticket = await client.verifyIdToken({
              idToken: req.body.token,
              audience: CLIENT_ID,
          });
          const payload = ticket.getPayload();
          req.pool.getConnection( function(err,connection) {
                if (err) {
                    console.log(err);
                    res.sendStatus(500);
                    return;
                }
                var query = `SELECT userID, given_name,isVenueManager,isHealthOfficial
                                FROM users WHERE email = ? AND isUser=? AND  isVenueManager=? AND isHealthOfficial=?;`;
                connection.query(query,[payload['email'],user,venMan,HO], function(err, rows, fields) {
                  connection.release(); // release connection
                  if (err) {
                    console.log(err);
                    res.sendStatus(500);
                    return;
                  }
                  if(rows.length > 0){
                      req.session.user = rows[0];
                      res.json(rows);
                      console.log(rows);
                  } else {

                      res.sendStatus(401);
                  }
                });
            });
        }
        verify().catch(function(){res.sendStatus(401);});

    } else {
        res.sendStatus(400);
    }

});

router.post('/logout', function(req, res, next) {

    delete req.session.user;
    res.sendStatus(200);

});

router.post('/signup', function(req, res, next) {
  req.pool.getConnection(function(err,connection)
  {

      if(err)
      {
        console.log(err);
          res.sendStatus(500);
          return;
      }
      var first_name=req.body.first_name;
      var last_name=req.body.last_name;
      var dob=req.body.dob;
      var phone_num=req.body.phone_num;
      var email=req.body.email;
      var streetnum=req.body.streetnum;
      var streetname=req.body.streetname;
      var suburb=req.body.suburb;
      var postcode=req.body.postcode;
      var state=req.body.state;
      var password=req.body.password;
      var venman=req.body.venMan;
      var HO=0;


      var query=`INSERT INTO users
                 (given_name,surname,street_number,street_name,surburb,state,postcode,
                 contact_number,date_of_birth,email,password,isVenueManager,isHealthOfficial,isUser)
                 VALUES (?,?,?,?,?,?,?,?,?,?,SHA2(?,256),?,?,0);`;
      connection.query(query,[first_name,last_name,streetnum,streetname,suburb,state,postcode,phone_num,dob,email,password,venman,HO],function(err,rows,fields)
      {
          connection.release();
          if(err)
          {
              console.log(err);
              res.sendStatus(500);
              return;
          }
          // req.session.user = first_name;
          console.log("logged in");
          // res.json(rows);
          res.end();
      });
  });
});

router.use(function(req, res, next) {
    if('user' in req.session){
      console.log(req.session.user);
        next();
    } else {
        res.sendStatus(401);
    }
});

router.post('/checkuser', function(req, res, next) {
  res.send('respond with a resource');
});



module.exports = router;
