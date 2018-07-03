var mysql = require('mysql');

/*
var myconn = mysql.createConnection('mysql://meanuser:meanpass@localhost:3306/mean1');
myconn.connect(function(error) {
    if (error) return console.error(error.message);
});
console.log('successfully connected!');
myconn.end();
*/

var pool = mysql.createPool({host: 'localhost', user: 'meanuser', password: 'meanpass', database: 'mean1',
    connectionLimit: 5, queueLimit: 33, waitForConnections: true,
    insecureAuth: true
 });

function CreateTable(callback) {
    pool.getConnection(function(error, myconn) {
        if (error) return console.error(error.message);

        var sql = 'Create Table Presidents (Id int unsigned not null auto_increment, Name varchar(100) not null, Terms int unsigned not null, primary key(Id));';
        myconn.query(sql, function(error, results) {
            myconn.release();

            if (error) return console.error(error.message);
            console.log('successfully created table!');
            callback();
        });
    });
}

function InsertTable(callback) {
    pool.getConnection(function(error, myconn) {
        if (error) return console.error(error.message);

        var sql = 'Insert Into Presidents (Name, Terms) Values '
        + '(\'Bill Clinton\', 2) ,'
        + '(\'George W Bush\', 2)';
        myconn.query(sql, function(error, results) {
            myconn.release();

            if (error) return console.error(error.message);
            console.log('successfully Inserted table!');
            callback();
        });
    });
}

function SelectTable(callback) {
    pool.getConnection(function(error, myconn) {
        if (error) return console.error(error.message);

        var sql = 'Select * From Presidents';
        myconn.query(sql, function(error, results) {
            myconn.release();

            if (error) return console.error(error.message);
            console.log('Results of SELECT:');
            console.log(JSON.stringify(results, null, 2));
            callback();
        });
    });
}

function DropTable(callback) {
    pool.getConnection(function(error, myconn) {
        if (error) return console.error(error.message);

        var sql = 'Drop Table If Exists Presidents';
        myconn.query(sql, function(error, results) {
            myconn.release();

            if (error) return console.error(error.message);
            console.log('Table dropped');
            callback();
        });
    });
}

CreateTable(function() {
    InsertTable(function(){
        SelectTable(function(){
            DropTable(function(){                
            });
        });
    });
});

//process.exit(0);