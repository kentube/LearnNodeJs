var mongoose = require('mongoose');
var Employee = mongoose.model('Employee');

exports.getEmployees = getEmployees;
exports.getEmployee = getEmployee;

function getEmployees(callback) {
	Employee.find().sort('name.last').exec(callback);
}

function getEmployee(employeeId, callback) {
	Employee.findOne({
		id: employeeId
	}).populate('team').exec(callback);
}


var employeeDb = require('../database/employees');

function getEmployeesDb (callback) {
	setTimeout(function () {
		callback(null, employeeDb);
	}, 500);
}

function getEmployeeDb (employeeId, callback) {
	getEmployees(function (error, data) {
		if (error) {return callback(error);}
		var result = data.find(function(item) {
			return item.id = employeeId;
		});
		callback(null, result);
	});
}