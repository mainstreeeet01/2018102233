var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session')


app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


var users = new Array();
users[0] = ['test', '1234', false]
users[1] = ['admin', '1234', true]


app.get('/login/:userId/password/:password', function (req, res) {
	for (var i in users){
		console.log(req.params.userId, req.params.password);
		console.log(users[i][0], users[i][1]);
		if (req.params.userId == users[i][0] && req.params.password == users[i][1]) {
			req.session.userId = users[i][0];
			req.session.isAdmin = users[i][2];
			break;
		}
	}
	res.send("login");
});

app.get('/logout/:userId', function (req, res) {
	// Logout
	req.session.userId = null;
	req.session.isAdmin = null;
	res.send("LogOut");
	
});

var auth = function (req, res, next) {
	// Session Check
	if (req.session.userId != null && req.session.isAdmin == true) 
		next();
	else
		res.send("Error");
		
};

app.get('/user/:userId', auth, function (req, res) {
	// get User Information
	for (var i in users) {
		if (req.params.userId == users[i][0]) {
			res.send(users[i]);
		}
	}
});	

app.put('/user/:userId', auth, function (req, res) {
	// update User Information
	for (var i in users) {
		if (req.params.userId == users[i][0]) {
			users[i] = [req.body.id, req.body.password, req.body.isAdmin];
			res.send(users[i]);
		}
	}
});

app.post('/user', auth, function (req, res) {
	// create new User Information
	var new_user = [req.body.id, req.body.password, req.body.isAdmin];
	users.push(new_user);
	res.send(new_user);
});

app.delete('/user/:userId', auth, function (req, res) {
	// delete User Information
	for (var i in users) {
		if (req.params.userId == users[i][0]) {
			users[i] = null;
		}
	}
	res.send(users);
})
var server = app.listen(23023);

