//App.js

var app = angular.module("foodApp", []);

app.controller("mainController", function($scope) {
	
	
	$scope.results = [];
	$scope.newResult = {location_name: "", text: "", distance: ""};
	$scope.searchTerm = '';
	$scope.search = function() {

		console.log($scope.searchTerm);
	}

	$scope.result = function() {
		$scope.posts.push($scope.newResult);
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
