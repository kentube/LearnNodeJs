var express = require('express');
var app = express();

app.get('/teams/:teamName/employees/:employeeId', function(req, res, next) {
    console.log('teamName = ' + req.params.teamName);
    console.log('employeeId = ' + req.params.employeeId);
    res.send('path one');
});