// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/myapp');

var Question     = require('./app/models/question');
//our answer model is being imported
var Answer     = require('./app/models/answer');

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// more routes for our API will happen here
// on routes that end in /bears
// ----------------------------------------------------
router.route('/questions')

    // create a bear (accessed at POST http://localhost:8080/api/bears)
    .post(function(req, res) {

        var question = new Question();      // create a new instance of the Bear model
        question.questionText = req.body.text;  // set the bears name (comes from the request)
        //question.qid= req.body.qid; //text is just a silly placeholder for whetever you call it in the postman
        // save the bear and check for errors
        question.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Question created!' });
        });

    })

    // get all the bears (accessed at GET http://localhost:8080/api/bears)
    .get(function(req, res) {
        Question.find(function(err, questions) {
            if (err)
                res.send(err);

            res.json(questions);
        });
    });



    // on routes that end in /bears/:bear_id
// ----------------------------------------------------
router.route('/questions/:q_id')

    // get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
    .get(function(req, res) {
        Question.findById(req.params.q_id, function(err, question) {
            if (err)
                res.send(err);
            res.json(question);
        });
    })


    // update the bear with this id (accessed at PUT http://localhost:8080/api/bears/:bear_id)
  .put(function(req, res) {

      // use our bear model to find the bear we want
      Question.findById(req.params.q_id, function(err, question) {

          if (err)
              res.send(err);

          question.questionText = req.body.text;  // update the bears info

          // save the bear
          question.save(function(err) {
              if (err)
                  res.send(err);

              res.json({ message: 'Question updated!' });
          });

      });
  })


  // delete the bear with this id (accessed at DELETE http://localhost:8080/api/bears/:bear_id)
    .delete(function(req, res) {
        Question.remove({
            _id: req.params.q_id
        }, function(err, question) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });


//OUR ANSWERS ROUTES - WHICH WILL RETURN ALL ANSWERS AND ALLOW US TO ADD AN ANSWER
// api/answers - is our route :?)
//lets start by - creating functionality to add a vote / answer
// more routes for our API will happen here
// on routes that end in /bears
// ----------------------------------------------------
router.route('/answers')

    // create a bear (accessed at POST http://localhost:8080/api/bears)
    .post(function(req, res) {

        var answer = new Answer();      // create a new instance of the Answer model
        answer.questionID = req.body.questionID;  // set the bears name (comes from the request)
        answer.response = req.body.response;
        answer.time = req.body.time;
        answer.date = req.body.date;
        //question.qid= req.body.qid; //text is just a silly placeholder for whetever you call it in the postman
        // save the bear and check for errors
        answer.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Answer Logged!' });
        });

    })

    // get all the bears (accessed at GET http://localhost:8080/api/bears)
    .get(function(req, res) {
        Answer.find(function(err, answers) {
            if (err)
                res.send(err);

            res.json(answers);
        });
    });




///QUERY TEST FUNCTIONS GO HERE

router.route('/query-ans')

    // create a bear (accessed at POST http://localhost:8080/api/bears)
    .post(function(req, res) {

        var answer = new Answer();      // create a new instance of the Answer model
        var selectedDate = req.body.selectedDate;  // set the bears name (comes from the request)
        // answer.response = req.body.response;
        // answer.time = req.body.time;
        // answer.date = req.body.date;
        //question.qid= req.body.qid; //text is just a silly placeholder for whetever you call it in the postman
        // save the bear and check for errors
        // answer.save(function(err) {
        //     if (err)
        //         res.send(err);
        //
        //     res.json({ message: 'Answer Logged!' });
        // });
        Answer.find({ date:selectedDate },function(err, answers) {
            if (err)
                res.send(err);

            res.json(answers);
        });

    })

    // get all the bears (accessed at GET http://localhost:8080/api/bears)
    .get(function(req, res) {
        // var date = req.body.selectedDate;
        // Answer.find({ date: "14/7/2016", time: 15.21 },function(err, answers) {
        Answer.find({ date: "15/7/2016", time: {$gte: 12 , $lte: 12.50 } },function(err, answers) {
            if (err)
                res.send(err);

            res.json(answers);
        });
    });


    //to query for final results - date and time
    router.route('/final-query')

        // create a bear (accessed at POST http://localhost:8080/api/bears)
        .post(function(req, res) {

            var answer = new Answer();      // create a new instance of the Answer model
            var selectedDate = req.body.selectedDate;  // set the bears name (comes from the request)
            var time = req.body.time;
            var offset = time + 1;
            // answer.response = req.body.response;
            // answer.time = req.body.time;
            // answer.date = req.body.date;
            //question.qid= req.body.qid; //text is just a silly placeholder for whetever you call it in the postman
            // save the bear and check for errors
            // answer.save(function(err) {
            //     if (err)
            //         res.send(err);
            //
            //     res.json({ message: 'Answer Logged!' });
            // });
            Answer.find({ date:selectedDate, time: {$gte: time , $lte: offset }  },function(err, answers) {
                if (err)
                    res.send(err);

                res.json(answers);
            });

        })

        // get all the bears (accessed at GET http://localhost:8080/api/bears)
        .get(function(req, res) {
            // var date = req.body.selectedDate;
            // Answer.find({ date: "14/7/2016", time: 15.21 },function(err, answers) {
            Answer.find({ date: "15/7/2016", time: {$gte: 12 , $lte: 12.50 } },function(err, answers) {
                if (err)
                    res.send(err);

                res.json(answers);
            });
        });


        //to get a single question by id

                //to get a single question by id
                //to query for final results - date and time
                router.route('/get-q')

                // create a bear (accessed at POST http://localhost:8080/api/bears)
                .post(function(req, res) {

                    var q_id = req.body.q_id;
                    Question.findById(q_id, function(err, question) {
                        if (err)
                            res.send(err);
                        if(question == null)
                        {
                          console.log('im null ooo');
                        }
                      else{ res.json(question.questionText);}
                    });

                })

                // get all the bears (accessed at GET http://localhost:8080/api/bears)
                .get(function(req, res) {
                    // var date = req.body.selectedDate;
                    // Answer.find({ date: "14/7/2016", time: 15.21 },function(err, answers) {
                    Answer.find({ date: "15/7/2016", time: {$gte: 12 , $lte: 12.50 } },function(err, answers) {
                        if (err)
                            res.send(err);

                        res.json(answers);
                    });
                });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
