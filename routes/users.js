var express = require('express');
var router = express.Router();


/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.post('/login', function(req, res, next) {
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
      var typeLogin=req.body.type;
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
            req.session.user = rows[0];
            console.log("logged in");
            res.json(rows);
      });
  });

});

router.post('/logout', function(req, res, next) {

    delete req.session.user;
    res.send();

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
          req.session.user = first_name;
          console.log("logged in");
          res.json(rows);
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

router.get('/checkInsUser', function(req, res, next)
{
    var vnameBool = true;
    var streetNumberBool = true;
    var streetNameBool = true;
    var suburbBool = true;
    var postcodeBool = true;
    var stateBool = true;
    var checkinDateBool = true;
    var startTimeBool = true;
    var endTimeBool = true;

    if (req.query.vname === undefined){
        vnameBool = false;
    }
    if (req.query.stNum === undefined){
        streetNumberBool = false;
    }
    if (req.query.stName === undefined){
        streetNameBool = false;
    }
    if (req.query.suburb === undefined){
        suburbBool = false;
    }
    if (req.query.postcode === undefined){
        postcodeBool = false;
    }
    if (req.query.state === undefined){
        stateBool = false;
    }
    if (req.query.date === undefined){
        checkinDateBool = false;
    }
    if (req.query.sTime === undefined){
        startTimeBool = false;
    }
    if (req.query.eTime === undefined){
        endTimeBool = false;
    }

    req.pool.getConnection(function (err, connection)
    {
        if (err)
        {
            res.sendStatus(500);
            return;
        }


        if (vnameBool === true && streetNumberBool === true && streetNameBool === true && suburbBool === true && postcodeBool === true && stateBool === true && checkinDateBool === true && startTimeBool === true && endTimeBool === true)
        {
            console.log("scenario 1");
            vname = req.query.vname;
            streetNumber = req.query.stNum;
            streetName = req.query.stName;
            suburb = req.query.suburb;
            postcode = req.query.postcode;
            state = req.query.state;
            checkinDate = req.query.date;
            startTime = req.query.sTime + ":00";
            endTime = req.query.eTime + ":00";

            let userObject = req.session.user;
            let userID = userObject.userID;

            let query = `SELECT venue.venue_name, venue.street_number, venue.street_name, venue.suburb, venue.state, venue.postcode, venue.contact_number, checkins.checkindate, checkins.checkintime
                    FROM users
                    INNER JOIN checkins
                    ON users.userID = checkins.userID
                    INNER JOIN venue
                    ON checkins.venueID = venue.venueID
                    WHERE (users.userID = ?
                    AND venue.venue_name = ?
                    AND venue.street_number = ?
                    AND venue.street_name = ?
                    AND venue.suburb = ?
                    AND venue.state = ?
                    AND venue.postcode = ?
                    AND checkins.checkindate = ?
                    AND checkins.checkintime BETWEEN ? AND ?)`;


            connection.query(query,[userID, vname, streetNumber, streetName, suburb, state, postcode, checkinDate, startTime, endTime], function (err, rows, fields)
            {
                connection.release();
                if (err)
                {
                    res.sendStatus(500);
                    return;
                }

                console.log(rows);
                res.json(rows);
                res.end();
            });
        }

        if (vnameBool === true && streetNumberBool === false && streetNameBool === false && suburbBool === false && postcodeBool === false && stateBool === false && checkinDateBool === false && startTimeBool === false && endTimeBool === false)
        {
            console.log("scenario 2");
            let vname = req.query.vname;

            let userObject = req.session.user;
            let userID = userObject.userID;

            let query = `SELECT venue.venue_name, venue.street_number, venue.street_name, venue.suburb, venue.state, venue.postcode, venue.contact_number, checkins.checkindate, checkins.checkintime
                    FROM users
                    INNER JOIN checkins
                    ON users.userID = checkins.userID
                    INNER JOIN venue
                    ON checkins.venueID = venue.venueID
                    WHERE (users.userID = ?
                    AND venue.venue_name = ?)`;


            connection.query(query,[userID, vname], function (err, rows, fields)
            {
                connection.release();
                if (err)
                {
                    res.sendStatus(500);
                    return;
                }

                console.log(rows);
                res.json(rows);
                res.end();
            });
        }

        if (vnameBool === true && streetNumberBool === false && streetNameBool === false && suburbBool === false && postcodeBool === false && stateBool === false && checkinDateBool === true && startTimeBool === false && endTimeBool === false)
        {
            console.log("scenario 3");
            let vname = req.query.vname;
            let checkinDate = req.query.date;

            let userObject = req.session.user;
            let userID = userObject.userID;

            let query = `SELECT venue.venue_name, checkins.checkindate
                    FROM users
                    INNER JOIN checkins
                    ON users.userID = checkins.userID
                    INNER JOIN venue
                    ON checkins.venueID = venue.venueID
                    WHERE (users.userID = ?
                    AND venue.venue_name = ?
                    AND checkins.checkindate = ?)`;


            connection.query(query,[userID, vname, checkinDate], function (err, rows, fields)
            {
                connection.release();
                if (err)
                {
                    res.sendStatus(500);
                    return;
                }

                console.log(rows);
                res.json(rows);
                res.end();
            });
        }

        if (vnameBool === true && streetNumberBool === false && streetNameBool === false && suburbBool === false && postcodeBool === false && stateBool === false && checkinDateBool === true && startTimeBool === true && endTimeBool === true)
        {
            console.log("scenario 4");
            let vname = req.query.vname;
            let checkinDate = req.query.date;
            let startTime = req.query.sTime;
            startTime += ":00";
            let endTime = req.query.eTime;
            endTime += ":00";

            let userObject = req.session.user;
            let userID = userObject.userID;

            let query = `SELECT venue.venue_name, venue.street_number, venue.street_name, venue.suburb, venue.state, venue.postcode, venue.contact_number, checkins.checkindate, checkins.checkintime
                    FROM users
                    INNER JOIN checkins
                    ON users.userID = checkins.userID
                    INNER JOIN venue
                    ON checkins.venueID = venue.venueID
                    WHERE (users.userID = ?
                    AND venue.venue_name = ?
                    AND checkins.checkindate = ?
                    AND checkins.checkintime BETWEEN ? AND ?)`;


            connection.query(query,[userID, vname, checkinDate, startTime, endTime], function (err, rows, fields)
            {
                connection.release();
                if (err)
                {
                    res.sendStatus(500);
                    return;
                }

                console.log(rows);
                res.json(rows);
                res.end();
            });
        }

        if (vnameBool === false && streetNumberBool === false && streetNameBool === false && suburbBool === false && postcodeBool === false && stateBool === false && checkinDateBool === true && startTimeBool === false && endTimeBool === false)
        {
            console.log("scenario 5");
            let checkinDate = req.query.date;

            let userObject = req.session.user;
            let userID = userObject.userID;

            let query = `SELECT venue.venue_name, venue.street_number, venue.street_name, venue.suburb, venue.state, venue.postcode, venue.contact_number, checkins.checkindate, checkins.checkintime
                    FROM users
                    INNER JOIN checkins
                    ON users.userID = checkins.userID
                    INNER JOIN venue
                    ON checkins.venueID = venue.venueID
                    WHERE (users.userID = ?
                    AND checkins.checkindate = ?)`;


            connection.query(query,[userID, checkinDate], function (err, rows, fields)
            {
                connection.release();
                if (err)
                {
                    res.sendStatus(500);
                    return;
                }

                console.log(rows);
                res.json(rows);
                res.end();
            });
        }

        if (vnameBool === false && streetNumberBool === true && streetNameBool === true && suburbBool === false && postcodeBool === false && stateBool === false && checkinDateBool === false && startTimeBool === false && endTimeBool === false)
        {
            console.log("scenario 6");
            let streetNumber = req.query.stNum;
            let streetName = req.query.stName;

            let userObject = req.session.user;
            let userID = userObject.userID;

            let query = `SELECT venue.venue_name, venue.street_number, venue.street_name, venue.suburb, venue.state, venue.postcode, venue.contact_number, checkins.checkindate, checkins.checkintime
                    FROM users
                    INNER JOIN checkins
                    ON users.userID = checkins.userID
                    INNER JOIN venue
                    ON checkins.venueID = venue.venueID
                    WHERE (users.userID = ?
                    AND venue.street_number = ?
                    AND venue.street_name = ?)`;


            connection.query(query,[userID, streetNumber, streetName], function (err, rows, fields)
            {
                connection.release();
                if (err)
                {
                    res.sendStatus(500);
                    return;
                }

                console.log(rows);
                res.json(rows);
                res.end();
            });
        }

        if (vnameBool === false && streetNumberBool === false && streetNameBool === true && suburbBool === false && postcodeBool === false && stateBool === false && checkinDateBool === false && startTimeBool === false && endTimeBool === false)
        {
            console.log("scenario 7");
            let streetName = req.query.stName;

            let userObject = req.session.user;
            let userID = userObject.userID;

            let query = `SELECT venue.venue_name, venue.street_number, venue.street_name, venue.suburb, venue.state, venue.postcode, venue.contact_number, checkins.checkindate, checkins.checkintime
                    FROM users
                    INNER JOIN checkins
                    ON users.userID = checkins.userID
                    INNER JOIN venue
                    ON checkins.venueID = venue.venueID
                    WHERE (users.userID = ?
                    AND venue.street_name = ?)`;


            connection.query(query,[userID, streetName], function (err, rows, fields)
            {
                connection.release();
                if (err)
                {
                    res.sendStatus(500);
                    return;
                }

                console.log(rows);
                res.json(rows);
                res.end();
            });
        }

        if (vnameBool === false && streetNumberBool === false && streetNameBool === true && suburbBool === true && postcodeBool === false && stateBool === false && checkinDateBool === false && startTimeBool === false && endTimeBool === false)
        {
            console.log("scenario 8");
            let streetName = req.query.stName;
            let suburb = req.query.suburb;

            let userObject = req.session.user;
            let userID = userObject.userID;

            let query = `SELECT venue.venue_name, venue.street_number, venue.street_name, venue.suburb, venue.state, venue.postcode, venue.contact_number, checkins.checkindate, checkins.checkintime
                    FROM users
                    INNER JOIN checkins
                    ON users.userID = checkins.userID
                    INNER JOIN venue
                    ON checkins.venueID = venue.venueID
                    WHERE (users.userID = ?
                    AND venue.street_name = ?
                    AND venue.suburb = ?)`;


            connection.query(query,[userID, streetName, suburb], function (err, rows, fields)
            {
                connection.release();
                if (err)
                {
                    res.sendStatus(500);
                    return;
                }

                console.log(rows);
                res.json(rows);
                res.end();
            });
        }

        if (vnameBool === false && streetNumberBool === false && streetNameBool === true && suburbBool === false && postcodeBool === true && stateBool === false && checkinDateBool === false && startTimeBool === false && endTimeBool === false)
        {
            console.log("scenario 9");
            let streetName = req.query.stName;
            let postcode = req.query.postcode;

            let userObject = req.session.user;
            let userID = userObject.userID;

            let query = `SELECT venue.venue_name, venue.street_number, venue.street_name, venue.suburb, venue.state, venue.postcode, venue.contact_number, checkins.checkindate, checkins.checkintime
                    FROM users
                    INNER JOIN checkins
                    ON users.userID = checkins.userID
                    INNER JOIN venue
                    ON checkins.venueID = venue.venueID
                    WHERE (users.userID = ?
                    AND venue.street_name = ?
                    AND venue.postcode = ?)`;


            connection.query(query,[userID, streetName, postcode], function (err, rows, fields)
            {
                connection.release();
                if (err)
                {
                    res.sendStatus(500);
                    return;
                }

                console.log(rows);
                res.json(rows);
                res.end();
            });
        }

        if (vnameBool === false && streetNumberBool === false && streetNameBool === false && suburbBool === false && postcodeBool === true && stateBool === false && checkinDateBool === false && startTimeBool === false && endTimeBool === false)
        {
            console.log("scenario 10");
            let postcode = req.query.postcode;

            let userObject = req.session.user;
            let userID = userObject.userID;

            let query = `SELECT venue.venue_name, venue.street_number, venue.street_name, venue.suburb, venue.state, venue.postcode, venue.contact_number, checkins.checkindate, checkins.checkintime
                    FROM users
                    INNER JOIN checkins
                    ON users.userID = checkins.userID
                    INNER JOIN venue
                    ON checkins.venueID = venue.venueID
                    WHERE (users.userID = ?
                    AND venue.postcode = ?)`;


            connection.query(query,[userID, postcode], function (err, rows, fields)
            {
                connection.release();
                if (err)
                {
                    res.sendStatus(500);
                    return;
                }

                console.log(rows);
                res.json(rows);
                res.end();
            });
        }

        if (vnameBool === false && streetNumberBool === false && streetNameBool === false && suburbBool === false && postcodeBool === false && stateBool === true && checkinDateBool === false && startTimeBool === false && endTimeBool === false)
        {
            console.log("scenario 11");
            let state = req.query.state;

            let userObject = req.session.user;
            let userID = userObject.userID;

            let query = `SELECT venue.venue_name, venue.street_number, venue.street_name, venue.suburb, venue.state, venue.postcode, venue.contact_number, checkins.checkindate, checkins.checkintime
                    FROM users
                    INNER JOIN checkins
                    ON users.userID = checkins.userID
                    INNER JOIN venue
                    ON checkins.venueID = venue.venueID
                    WHERE (users.userID = ?
                    AND venue.state = ?)`;


            connection.query(query,[userID, state], function (err, rows, fields)
            {
                connection.release();
                if (err)
                {
                    res.sendStatus(500);
                    return;
                }

                console.log(rows);
                res.json(rows);
                res.end();
            });
        }

        if (vnameBool === false && streetNumberBool === false && streetNameBool === false && suburbBool === false && postcodeBool === false && stateBool === true && checkinDateBool === true && startTimeBool === false && endTimeBool === false)
        {
            console.log("scenario 12");
            let state = req.query.state;
            let checkinDate = req.query.date;

            let userObject = req.session.user;
            let userID = userObject.userID;

            let query = `SELECT venue.venue_name, venue.street_number, venue.street_name, venue.suburb, venue.state, venue.postcode, venue.contact_number, checkins.checkindate, checkins.checkintime
                    FROM users
                    INNER JOIN checkins
                    ON users.userID = checkins.userID
                    INNER JOIN venue
                    ON checkins.venueID = venue.venueID
                    WHERE (users.userID = ?
                    AND venue.state = ?
                    AND checkins.checkindate = ?)`;


            connection.query(query,[userID, state, checkinDate], function (err, rows, fields)
            {
                connection.release();
                if (err)
                {
                    res.sendStatus(500);
                    return;
                }

                console.log(rows);
                res.json(rows);
                res.end();
            });
        }

        if (vnameBool === false && streetNumberBool === false && streetNameBool === false && suburbBool === false && postcodeBool === true && stateBool === false && checkinDateBool === true && startTimeBool === true && endTimeBool === true)
        {
            let postcode = req.query.postcode;
            let checkinDate = req.query.date;
            let startTime = req.query.sTime;
            startTime += ":00";
            let endTime = req.query.eTime;
            endTime += ":00";

            let userObject = req.session.user;
            let userID = userObject.userID;

            let query = `SELECT venue.venue_name, venue.street_number, venue.street_name, venue.suburb, venue.state, venue.postcode, venue.contact_number, checkins.checkindate, checkins.checkintime
                    FROM users
                    INNER JOIN checkins
                    ON users.userID = checkins.userID
                    INNER JOIN venue
                    ON checkins.venueID = venue.venueID
                    WHERE (users.userID = ?
                    AND venue.postcode = ?
                    AND checkins.checkindate = ?
                    AND checkins.checkintime BETWEEN ? AND ?)`;


            connection.query(query,[userID, vname, checkinDate, startTime, endTime], function (err, rows, fields)
            {
                connection.release();
                if (err)
                {
                    res.sendStatus(500);
                    return;
                }

                console.log(rows);
                res.json(rows);
                res.end();
            });
        }
    });
});

module.exports = router;
