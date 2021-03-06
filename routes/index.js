var express = require('express');
var router = express.Router();
var passport = require('passport');
var flash = require('connect-flash');

require('../server/titlecase');
function getUnixTime() { return Math.floor(Date.now() / 1000); }
function checkRedirect(res, req) { res.redirect('/'); }

var mysql = require('mysql');
var dbconfig = require('../server/database');
var connection = mysql.createConnection(dbconfig.connection);

function connectionQuery() {
    connection.query('USE ' + dbconfig.database, function (error, results, fields) {
        if (error) {
            console.log("ERROR = ", error);
            return;
        }
        console.log("[" + new Date() + '] Connected to MySQL as ' + connection.threadId);
    });
}


/* GET home page. */
router.get('/', function (req, res, next) {
    if (req.user) {
        res.redirect('/home');
    } else {
        res.render('index', {title: 'Rêve Academy Application'});
    }
});

router.get('/home', function (req, res, next) {
    res.render('home', {title: 'Home', user: req.user});
});

router.get('/getUser', function (req, res) {
    res.json({user: req.user});
});

//SKILLS ROUTES
router.get('/communication', function (req, res, next) {
    if (!req.user) res.redirect('/');
    res.render('communication', {title: 'Communication', user: req.user});
});
router.get('/equitable', function (req, res, next) {
    if (!req.user) res.redirect('/');
    res.render('equitable', {title: 'Equitable', user: req.user});
});
router.get('/equitable_intern', function (req, res, next) {
    if (!req.user) res.redirect('/');
    res.render('equitable_intern', {title: 'Equitable', user: req.user});
});
router.get('/engagement_intern', function (req, res, next) {
    if (!req.user) res.redirect('/');
    res.render('engagement_intern', {title: 'Engagement Intern', user: req.user});
});
router.get('/progress_monitoring_intern', function (req, res, next) {
    if (!req.user) res.redirect('/');
    res.render('progress_monitoring_intern', {title: 'Progress Monitoring Intern', user: req.user});
});
router.get('/supportive_learning_intern', function (req, res, next) {
    if (!req.user) res.redirect('/');
    res.render('supportive_learning_intern', {title: 'Supportive Learning Intern', user: req.user});
});
router.get('/responsibility_intern', function (req, res, next) {
    if (!req.user) res.redirect('/');
    res.render('responsibility_intern', {title: 'Responsibility Intern', user: req.user});
});
router.get('/progress_monitoring', function (req, res, next) {
    if (!req.user) res.redirect('/');
    res.render('progress_monitoring', {title: 'Progress Monitoring', user: req.user});
});
router.get('/enthusiasm', function (req, res, next) {
    if (!req.user) res.redirect('/');
    res.render('enthusiasm', {title: 'Enthusiasm', user: req.user});
});
router.get('/teamwork', function (req, res, next) {
    if (!req.user) res.redirect('/');
    res.render('teamwork', {title: 'Teamwork', user: req.user});
});
router.get('/problem_solving', function (req, res, next) {
    if (!req.user) res.redirect('/');
    res.render('problem_solving', {title: 'Problem Solving', user: req.user});
});
router.get('/professionalism', function (req, res, next) {
    if (!req.user) res.redirect('/');
    res.render('professionalism', {title: 'Professionalism', user: req.user});
});
router.get('/engagement', function (req, res, next) {
    if (!req.user) res.redirect('/');
    res.render('engagement', {title: 'Engagement', user: req.user});
});
router.get('/supportive_learning', function (req, res, next) {
    if (!req.user) res.redirect('/');
    res.render('supportive_learning', {title: 'Supportive Learning', user: req.user});
});
router.get('/responsibility', function (req, res, next) {
    if (!req.user) res.redirect('/');
    res.render('responsibility', {title: 'Responsibility', user: req.user});
});
router.get('/observation', function (req, res, next) {
    if (!req.user) res.redirect('/');
    res.render('observation', {title: 'Observation', user: req.user});
});


// SKILLS POST ROUTES

router.post('/addObs', function (req, res) {
    //console.log(req.body);
    if (!req.user) res.redirect('/');
    connectionQuery();

    for (var i = 0; i < req.body.length; i++) {

        var newObservationMysql = {
            StudentID: req.body[i].StudentID,
            ObsType: req.body[i].ObsType,
            ObsValue: req.body[i].ObsValue,
            DateCreated: getUnixTime()
        };

        //console.log(newObservationMysql);

        var insertQuery = "INSERT INTO StudentObs ( StudentID, ObsType, ObsValue, DateCreated ) values (?,?,?,?)";

        connection.query(insertQuery, [newObservationMysql.StudentID, newObservationMysql.ObsType, newObservationMysql.ObsValue, newObservationMysql.DateCreated], function (err, rows) {

            if (err) {
                console.log("INSERT ERROR = ", err);
                return;
            }
            //console.log("INSERTED NEW Observation = ", rows);

        });
    }

    res.sendStatus(200);

});

//post intern Obs data
router.post('/addInternObs', function (req, res) {
    //console.log(req.body);
    if (!req.user) res.redirect('/');
    connectionQuery();

    for (var i = 0; i < req.body.length; i++) {

        var newObservationMysql = {
            BeingObservedID: req.body[i].BeingObservedID,
            ObsType: req.body[i].ObsType,
            ObsValue: req.body[i].ObsValue,
            DateCreated: getUnixTime()
        };

        //console.log(newObservationMysql);

        var insertQuery = "INSERT INTO InternObs ( UserID, BeingObservedID, ObsType, ObsValue, DateCreated ) values (?,?,?,?,?)";

        connection.query(insertQuery, [req.user.UserID, newObservationMysql.BeingObservedID, newObservationMysql.ObsType, newObservationMysql.ObsValue, newObservationMysql.DateCreated], function (err, rows) {

            if (err) {
                console.log("INSERT ERROR = ", err);
                return;
            }
            //console.log("INSERTED NEW Observation = ", rows);

        });
    }

    res.sendStatus(200);

});

// post slider data
router.post('/addObsSlider', function (req, res) {
    //console.log(req.body);
    if (!req.user) res.redirect('/');
    connectionQuery();

    for (property in req.body) {

        // assemble query object for each obs type submitted
        var newObservationMysql = {};
        newObservationMysql.StudentID = req.body.StudentID;
        newObservationMysql.DateCreated = getUnixTime();

        if (property == "Communication") {
            newObservationMysql.ObsType = 'Communication';
            newObservationMysql.ObsValue = req.body.Communication;
        }
        if (property == "Enthusiasm") {
            newObservationMysql.ObsType = 'Enthusiasm';
            newObservationMysql.ObsValue = req.body.Enthusiasm;
        }
        if (property == "Teamwork") {
            newObservationMysql.ObsType = 'Teamwork';
            newObservationMysql.ObsValue = req.body.Teamwork;
        }
        if (property == "ProblemSolving") {
            newObservationMysql.ObsType = 'Problem Solving';
            newObservationMysql.ObsValue = req.body.ProblemSolving;
        }
        if (property == "Professionalism") {
            newObservationMysql.ObsType = 'Professionalism';
            newObservationMysql.ObsValue = req.body.Professionalism;
        }

        //Do NOT insert data if the current property is StudentID
        if (property != "StudentID") {
            var insertQuery = "INSERT INTO StudentObs ( StudentID, ObsType, ObsValue, DateCreated ) values (?,?,?,?)";
            connection.query(insertQuery, [newObservationMysql.StudentID, newObservationMysql.ObsType, newObservationMysql.ObsValue, newObservationMysql.DateCreated], function (err, rows) {
                if (err) {
                    console.log("INSERT ERROR = ", err);
                    return;
                }
                //console.log("INSERTED NEW Observation = ", rows);
            });
        }

    }

    res.sendStatus(200);
});

//POST INTERN SLIDER DATA
router.post('/addInternObsSlider', function (req, res) {
    //console.log(req.body);
    if (!req.user) res.redirect('/');
    connectionQuery();

    for (property in req.body) {

        // assemble query object for each obs type submitted
        var newObservationMysql = {};
        newObservationMysql.BeingObservedID = req.body.BeingObservedID;
        newObservationMysql.DateCreated = getUnixTime();

        if (property == "Communication") {
            newObservationMysql.ObsType = 'Communication';
            newObservationMysql.ObsValue = req.body.Communication;
        }
        if (property == "Enthusiasm") {
            newObservationMysql.ObsType = 'Enthusiasm';
            newObservationMysql.ObsValue = req.body.Enthusiasm;
        }
        if (property == "Teamwork") {
            newObservationMysql.ObsType = 'Teamwork';
            newObservationMysql.ObsValue = req.body.Teamwork;
        }
        if (property == "ProblemSolving") {
            newObservationMysql.ObsType = 'Problem Solving';
            newObservationMysql.ObsValue = req.body.ProblemSolving;
        }
        if (property == "Professionalism") {
            newObservationMysql.ObsType = 'Professionalism';
            newObservationMysql.ObsValue = req.body.Professionalism;
        }

        //Do NOT insert data if the current property is StudentID
        if (property != "BeingObservedID") {
            var insertQuery = "INSERT INTO InternObs ( UserID, BeingObservedID, ObsType, ObsValue, DateCreated ) values (?,?,?,?,?)";
            connection.query(insertQuery, [req.user.UserID, newObservationMysql.BeingObservedID, newObservationMysql.ObsType, newObservationMysql.ObsValue, newObservationMysql.DateCreated], function (err, rows) {
                if (err) {
                    console.log("INSERT ERROR = ", err);
                    return;
                }
                //console.log("INSERTED NEW Observation = ", rows);
            });
        }

    }

    res.sendStatus(200);
});

// VIEW DATA ROUTES

router.get('/admin_view_data', function (req, res, next) {
    if (!req.user) res.redirect('/');
    res.render('admin/admin_view_data', {title: 'View Data', user: req.user});
});

router.get('/teacher_view_data', function (req, res, next) {
    if (!req.user) res.redirect('/');
    res.render('teacher/teacher_view_data', {title: 'View Data', user: req.user});
});

router.get('/intern_view_data', function (req, res, next) {
    if (!req.user) res.redirect('/');
    res.render('intern_view_data', {title: 'View Data', user: req.user});
});


router.get('/getStudentData/:StudentID', function (req, res) {
    if (!req.user) res.redirect('/');
    connectionQuery();

    var selectQuery = "SELECT ObsType, ObsValue, DateCreated FROM StudentObs WHERE StudentID = " + req.params.StudentID + " ORDER BY DateCreated";
    connection.query(selectQuery, function (err, results) {
        if (err) console.log("SELECT ERROR = ", err);
        res.json(results);
    });
});

router.get('/getInternData/:UserID', function (req, res) {
    if (!req.user) res.redirect('/');
    connectionQuery();

    var selectQuery = "SELECT ObsType, ObsValue, DateCreated FROM InternObs WHERE BeingObservedID = " + req.params.UserID + " ORDER BY DateCreated";
    connection.query(selectQuery, function (err, results) {
        if (err) console.log("SELECT ERROR = ", err);
        res.json(results);
    });
});

router.get('/getClassAverages/:ClassID/:ObsType', function(req, res) {
    if (!req.user) res.redirect('/');
    connectionQuery();
    var selectQuery = "SELECT ObsType, ROUND(AVG(ObsValue), 1) AS Average, FROM_UNIXTIME(StudentObs.DateCreated, '%m/%d/%Y') AS Date FROM Reve.StudentObs WHERE ObsType = '" + decodeURIComponent(req.params.ObsType) + "' AND StudentObs.StudentID IN (SELECT Students.StudentID FROM Students WHERE ClassID = " + req.params.ClassID + ") GROUP BY Date ORDER BY Date";
    connection.query(selectQuery, function (err, results) {
        if (err) console.log("SELECT ERROR = ", err);
        res.json(results);
    });
});

//TEACHER'S ROUTES

//get classes route for teacher logged in
router.get('/getClasses', function (req, res) {
    //console.log(req.user);
    if (!req.user) res.redirect('/');
    if (req.user.UserType == 0 || req.user.UserType == 1) {
        connectionQuery();

        var selectQuery;
        if (req.user.UserType == 0) selectQuery = "SELECT Classes.ClassID, Classes.ClassName, Classes.DateStart, Users.FirstName, Users.LastName FROM Classes, Users WHERE Classes.UserID = Users.UserID ORDER BY Users.LastName;";
        if (req.user.UserType == 1) selectQuery = "SELECT ClassID, ClassName, DateStart FROM Classes WHERE UserID = " + req.user.UserID;

        connection.query(selectQuery, function (err, results) {
            if (err) console.log("SELECT ERROR = ", err);
            res.json(results);
        });
    }
});

//get classes route for teacher selected in view data
router.get('/getClasses/:UserID', function (req, res) {
    //console.log(req.user);
    if (!req.user) res.redirect('/');
    if (req.user.UserType == 0 || req.user.UserType == 1) {
        connectionQuery();

        var selectQuery = "SELECT ClassID, ClassName, DateStart FROM Classes WHERE UserID = " + req.params.UserID;
        connection.query(selectQuery, function (err, results) {
            if (err) console.log("SELECT ERROR = ", err);
            res.json(results);
        });
    }
});


//get students route
router.get('/getStudents/:ClassID', function (req, res) {
    //console.log(req.user);
    if (!req.user) res.redirect('/');
    if (req.user.UserType == 0 || req.user.UserType == 1) {

        connectionQuery();

        var selectQuery = "SELECT StudentID, FirstName, LastName FROM Students WHERE ClassID = " + req.params.ClassID;

        connection.query(selectQuery, function (err, results) {
            if (err) console.log("SELECT ERROR = ", err);
            res.json(results);
        });

    }

});

//get interns route
router.get('/getInterns', function (req, res) {
    //console.log(req.user);
    if (!req.user) res.redirect('/');
    if (req.user.UserType == 0 || req.user.UserType == 2) {

        connectionQuery();
        var selectQuery;
        if (req.user.UserType == 0) {
            selectQuery = "SELECT UserID, FirstName, LastName FROM Users WHERE UserType = " + 2;
        } else {
            selectQuery = "SELECT UserID, FirstName, LastName FROM Users WHERE UserID = " + req.user.UserID + " UNION SELECT UserID, FirstName, LastName FROM Users WHERE UserType = " + 2;
        }
        connection.query(selectQuery, function (err, results) {
            if (err) console.log("SELECT ERROR = ", err);
            res.json(results);
        });

    }

});

//get one intern route
router.get('/getOneIntern', function (req, res) {
    if (!req.user) res.redirect('/');
    connectionQuery();

    var selectQuery = "SELECT ObsType, ObsValue, DateCreated FROM InternObs WHERE UserID = " + req.user.UserID + " AND BeingObservedID = " + req.user.UserID + " ORDER BY DateCreated";

    connection.query(selectQuery, function (err, results) {
        if (err) console.log("SELECT ERROR = ", err);
        res.json(results);
    });
});

//POST students to database
router.post('/addStudent', function (req, res) {
    if (!req.user) res.redirect('/');
    connectionQuery();
    //console.log(req.user);

    var newStudentMysql = {
        ClassID: req.body.ClassID,
        FirstName: req.body.FirstName.toTitleCase(),
        LastName: req.body.LastName.toTitleCase(),
        DateCreated: getUnixTime()
    };

    var insertQuery = "INSERT INTO Students ( ClassID, FirstName, LastName, DateCreated ) values (?,?,?,?)";

    connection.query(insertQuery, [newStudentMysql.ClassID, newStudentMysql.FirstName, newStudentMysql.LastName, newStudentMysql.DateCreated], function (err, rows) {

        if (err) {
            console.log("INSERT ERROR = ", err);
            return;
        }
        //console.log("INSERTED NEW Student = ", rows);

    });

    res.sendStatus(200);

});

// get teachers
router.get('/getTeachers', function (req, res) {
    //console.log(req.user);
    if (!req.user) res.redirect('/');
    if (req.user.UserType == 0 || req.user.UserType == 1) {
        connectionQuery();

        var selectQuery = "SELECT UserID, FirstName, LastName FROM Users WHERE UserType = 1";

        connection.query(selectQuery, function (err, results) {
            if (err) console.log("SELECT ERROR = ", err);
            res.json(results);
        });
    }
});

router.get('/add_student', function (req, res, next) {
    if (!req.user) res.redirect('/');
    res.render('teacher/add_student', {title: 'Add Student', user: req.user});
});

router.get('/add_class', function (req, res, next) {
    if (!req.user) res.redirect('/');
    res.render('teacher/add_class', {title: 'Add Class', user: req.user});
});

// add class to DB
router.post('/add_class', function (req, res) {
    if (!req.user) res.redirect('/');
    connectionQuery();
    //console.log(req.user);

    var newClassMysql = {
        UserID: req.user.UserID,
        ClassName: req.body.ClassName,
        DateStart: req.body.DateStart,
        DateCreated: getUnixTime()
    };

    var insertQuery = "INSERT INTO Classes ( UserID, ClassName, DateStart, DateCreated ) values (?,?,?,?)";

    connection.query(insertQuery, [newClassMysql.UserID, newClassMysql.ClassName, newClassMysql.DateStart, newClassMysql.DateCreated], function (err, rows) {
        if (err) {
            console.log("INSERT ERROR = ", err);
            return;
        }
        //console.log("INSERTED NEW CLASS = ", rows);
    });

    res.sendStatus(200);

});

router.get('/teacher_view_data', function (req, res, next) {
    if (!req.user) res.redirect('/');
    res.render('teacher/teacher_view_data', {title: 'Teacher View Data', user: req.user});
});

// AUTH ROUTES
router.get('/login', function (req, res, next) {
    res.render('login', {title: 'Login Page', message: req.flash('loginMessage')});
});

router.get('/register', function (req, res, next) {
    res.render('register', {title: 'Register', message: req.flash('registerMessage')});
});

// login route
router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/home', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the login page if there is an error
    failureFlash: true // allow flash messages
}), function (req, res) {
    //console.log("logged in!");

    if (req.body.remember) {
        req.session.cookie.maxAge = 1000 * 60 * 3;
    } else {
        req.session.cookie.expires = false;
    }
    res.redirect('/');
});

// register account route
router.post('/register', passport.authenticate('local-signup', {
    successRedirect: '/home', // redirect to the secure profile section
    failureRedirect: '/register', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
}));

// logout
router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});


// get users for user view page
router.get('/admin', function(req, res) {
    if (!req.user) res.redirect('/');
    if (req.user.UserType == 0) {
        res.render('admin/admin', {title: 'Administration', user: req.user});
    } else {
        res.redirect('/');
    }
});

router.post('/deleteUser', function(req, res) {
    if (!req.user) res.redirect('/');
    if (req.user.UserType == 0) {

        connectionQuery();
        connection.query("DELETE FROM Users WHERE UserID = ?", [req.body.UserID], function (err, rows) {

            if (err) {
                console.log("DELETE ERROR = ", err);
                return;
            }
            //console.log("DELETE USER = ", rows);

        });
    }

    res.sendStatus(200);
});

router.get('/getAuthCodes', function(req, res) {
    if (!req.user) res.redirect('/');
    if (req.user.UserType == 0) {
        connectionQuery();
        connection.query("SELECT InternCode, TeacherCode, AdminCode FROM Settings", function (err, results) {
            if (err) console.log("SELECT ERROR = ", err);
            //console.log(results[0].InternCode);
            res.json(results);
        });
    }
});

router.post('/setAuthCodes', function(req, res) {
    if (!req.user) res.redirect('/');

    if (req.user.UserType == 0) {
        connectionQuery();
        connection.query("DELETE FROM Settings");

        var newCodesMysql = {
            InternCode : req.body.InternCode,
            TeacherCode : req.body.TeacherCode,
            AdminCode : req.body.AdminCode
        };

        var insertQuery = "INSERT INTO Settings ( InternCode, TeacherCode, AdminCode ) VALUES (?,?,?)";

        connection.query(insertQuery, [newCodesMysql.InternCode, newCodesMysql.TeacherCode, newCodesMysql.AdminCode], function (err, rows) {
            if (err) return;
            //console.log("INSERTED NEW CODES = ", rows);
        });
    }
});

// redirect all unknown routes to home page
router.get('/*', function(req, res) { res.redirect('/'); });

module.exports = router;