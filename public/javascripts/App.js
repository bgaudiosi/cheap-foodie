//App.js

var app = angular.module("foodApp", []);

app.controller("mainController", function($scope, $http) {
	
	
	$scope.results = [];
	$scope.newResult = {location_name: "", text: "", distance: ""};
	$scope.searchTerm = '';
	$scope.loc = "";
	$scope.search = function() {
		$scope.data = {search: $scope.searchTerm, loc: $scope.loc}
		$http.post('http://localhost:4000/', $scope.data).success(function(data) {
			console.log(data);
		}).error(function(data) {
			console.log("no bueno");
		});
	};
	$scope.heya = "hola";
	$scope.result = function() {
		$scope.results.push($scope.newResult);
		$scope.newResult = {location_name:"", text: "", distance: ""};
	};
});

app.controller("authController", function($scope) {
	$scope.user = {username: "", password: ""};
	$scope.error_message = "";

	$scope.login = function() {
		$scope.error_message = "login request for " + $scope.user.username;
	}

	$scope.register = function() {
		
	}
});
