(function(a, window) {var app = angular.module(
    'app', 
    ['ngRoute', 'ngResource']
);

app.config(['$routeProvider', function($routeProvider) {

}]);

app.factory('EmployeeService', ['$resource', function($resource) {
    
}]);
app.controller('view', ['$scope', 'EmployeeService', function($scope, EmployeeService) {

}]);
} (angular, window));