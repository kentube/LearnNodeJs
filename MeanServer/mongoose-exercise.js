var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db = mongoose.connection;
var dbUrl = 'mongodb://127.0.0.1:27017/test';

var TeamSchema = new Schema({
	name: {type: String, required: true}
});
var Team = mongoose.model('Team', TeamSchema);

var EmployeeSchema = new Schema({
	name: {first: {type: String, required: true}, last: {type: String, required: true}},
	team: {type: Schema.Types.ObjectId, ref: 'Team'},
	image: {type: String, default: 'image/user.png'},
	address: {line: {type: [String]}, postal: {type: String}},
});
var Employee = mongoose.model('Employee', EmployeeSchema);

/*
var team = new Team({name: 'Product Development'});
team.save(function (error, data) {
	if (error) {console.log(error);}
	else {console.dir(data);}
	db.close();
	process.exit();
});

Team.create([
	{name: 'Management'},
	{name: 'Dev Ops'},
	{name: 'Accunting'}
], 
function(error, mgmt, devops, acct) {
	if (error) {console.log(error);}
	else {
		console.dir(mgmt);
		console.dir(devops);
		console.dir(acct);
		db.close();
		process.exit();
	}
}
);
*/

function insertTeams (callback) {
	Team.create([
		{name: 'Product Development'},
		{name: 'Dev Ops'},
		{name: 'Accunting'}
	], 
	function(error, teams, pd, devops, acct) {
		if (error) {callback(error);}
		else {
			console.info('teams successfully added')
			callback(null, teams, pd, devops, acct);
		}
	});
}

function insertEmployees(teams, pd, devops, acct, callback) {
	console.dir(teams);
	pd_id = teams[0]._id;
	devops_id = teams[1]._id;
	acct_id = teams[2]._id;
	Employee.create([
		{name: {first: 'John', last: 'Adams'}, team: pd_id, 
				address: {lines: ['2 Lincoln Memorial Cir NW'], zip: 20037}},
		{name: {first: 'Thomas', last: 'Jefferson'}, team: devops_id, 
				address: {line: ['1600 Pennsylvania Avenue', 'White House'], zip: 20500}},
		{name: {first: 'James', last: 'Madison'}, team: acct_id, 
				address: {lines: ['2 15th St NW', 'PO Box 8675309'], zip: 20007}},
		{name: {first: 'James', last: 'Monroe'}, team: acct_id, 
				address: {lines: ['1850 West Basin Dr SW', 'Suite 210'], zip: 20242}}
	],
	function (error, johnadams) {
		if (error) {return callback(error);}
		else {
			console.info('employees successfully added');
			callback(null, {
				team: pd,
				employee: johnadams
			});
		};
	}
	);
}

function retrieveEmployee(data, callback) {
	Employee
		.findOne({_id: data.employee._id})
		.populate('team')
		.exec(function (error, result) {
			if (error) { return callback(error); }
			else {
				console.log('*** Single Employee Result ***');
				console.dir(result);
				callback(null, data);
			}
		});
}

function retrieveEmployees(data, callback) {
	Employee.find({'name.first': /J/i}, function(error, results) {
		if (error) { return callback(error); }
		else {
			console.log('*** Multiple Employees Result ***');
			console.dir(results);
			callback(null, data);
		}
	});
}

function updateEmployee(first, last, data, callback) {
	console.log('*** Changing names ***');
	console.dir(data.employee);

	var employee = data.employee[0];
	employee.name.first = first;
	employee.name.last = last;

	employee.save(function (error, result) {
		if (error) { return callback(error); }
		else {
			console.log('*** Changed name to Andrew Jackson ***');
			console.log(result);
			callback(null, data);
		}
	});
}

db.on('error', function() {
	console.log('There was an error communicating with the database');
});
mongoose.connect(dbUrl, function(err) {
	if (err) {return console.log('There was a problem connecting to the database!' + err);}
	console.log('connected');
	
	insertTeams(function(err, teams, pd, devops, acct) {
		if (err) {return console.log(err);}
		insertEmployees(teams, pd, devops, acct, function(err, result) {
			retrieveEmployee(result, function(err, result) {
				retrieveEmployees(result, function(err, result) {
					updateEmployee('Andrew', 'Jackson', result, function(err, result) {
						if (err) { console.error(err); }
						else { console.info('database activity complete'); }

						db.close();
						process.exit();
					});
				});
			});
		});
	});
});
