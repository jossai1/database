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

var port = process.env.PORT || 8095;        // set our port

var mongoose = require('mongoose');
//not working on ssh so changing to below mongoose.connect('mongodb://localhost/myapp'); //'myapp' is the name of the db, that will be created if it doesnt already exist
//mongoose.connect('mongodb://127.0.0.1/myapp');
mongoose.connect('mongodb://jossai1:ella2469@ds029715.mlab.com:29715/surveydb');



//models
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
// on routes that end in /questions
//api for accesing questions
// ----------------------------------------------------
router.route('/questions')

    // create a bear (accessed at POST http://localhost:8080/api/bears)
    .post(function(req, res) {

        var question = new Question();      // create a new instance of the Bear model
        question.questionText = req.body.questionText;  // set the bears name (comes from the request)
        //question.qid= req.body.qid; //text is just a silly placeholder for whetever you call it in the postman
        // save the bear and check for errors
        question.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Question created!' });
        });
    })

    // get all the bears (accessed at GET http://localhost:8080/api/questions)
    .get(function(req, res) {
        Question.find(function(err, questions) {
            if (err)
                res.send(err);

            res.json(questions);
        });
    });

// on routes that end in /questions/:q_id
//for ourselves if we want to access a bear through it's id in the URL
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


    //this is if we want to update a question's text
    // update the bear with this id (accessed at PUT http://localhost:8080/api/questions/:q_id)
  .put(function(req, res) {

      // use our question model to find the question we want
      Question.findById(req.params.q_id, function(err, question) {

          if (err)
              res.send(err);

          question.questionText = req.body.text;  // update the question info

          // save the question
          question.save(function(err) {
              if (err)
                  res.send(err);

              res.json({ message: 'Question updated!' });
          });

      });
  })

  //if we want to delete a question
  // delete the bear with this id (accessed at DELETE http://localhost:8080/api/questions/:q_id)
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
// api/answers - is our route :)
//lets start by - creating functionality to add a vote / answer
// more routes for our API will happen here
// on routes that end in /answers
// ----------------------------------------------------
router.route('/answers')

    // create a bear (accessed at POST http://localhost:8080/api/answers)
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

    //get all the answers in teh db
    // get all the bears (accessed at GET http://localhost:8080/api/answers)
    .get(function(req, res) {
        Answer.find(function(err, answers) {
            if (err)
                res.send(err);

            res.json(answers);
        });
    });



///QUERY TEST FUNCTIONS GO HERE
// a query api to query our ansers by date
router.route('/query-ans')

    // create a bear (accessed at POST http://localhost:8080/api/answers)
    //returns all questions recorded on the selected ddate
    .post(function(req, res) {

        var answer = new Answer();      // create a new instance of the Answer model
        var selectedDate = req.body.selectedDate;  // set the answer's date  (comes from the request)
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

    //  a test function that  gets answers logged at a specific date and bewtween certain times
    //get all the bears (accessed at GET http://localhost:8080/api/bears)
    .get(function(req, res) {

        Answer.find({ date: "15/7/2016", time: {$gte: 12 , $lte: 12.50 } },function(err, answers) {
            if (err)
                res.send(err);

            res.json(answers);
        });
    });


    //to query for final results - date and time - as params
    router.route('/final-query')

        // create a bear (accessed at POST http://localhost:8080/api/bears)
        .post(function(req, res) {

            var answer = new Answer();      // create a new instance of the Answer model
            var selectedDate = req.body.selectedDate;  // set the bears name (comes from the request)
            var time = req.body.time;
            var offset = time + 1;

            Answer.find({ date:selectedDate, time: {$gte: time , $lte: offset }  },function(err, answers) {
                if (err)
                    res.send(err);

                res.json(answers);
            });

        });



        //to get a single question by id
        //takes an id in the body, searches for question that matches and returns the question's text
        router.route('/get-q')

        // create a bear (accessed at POST http://localhost:8080/api/bears)
        .post(function(req, res) {

            var q_id = req.body.q_id;
            Question.findById(q_id, function(err, question) {
                if (err)
                    res.send(err);
                //handeling null values, so that we will not be passing null values to other methods
                if(question == null)
                {
                  console.log('im null ooo'); //just letting me know
                }
              else{ res.json(question);}
            });

        });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
