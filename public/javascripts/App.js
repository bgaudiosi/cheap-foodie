//App.js

var app = angular.module("App", []);

app.controller("mainController", function($scope) {
	
	
	$scope.results = [];
	$scope.newResult = {location_name: "", text: "", distance: ""};
	
	$scope.search = function() [
		/* do sth */
	}

	$scope.result = function() {
		$scope.posts.push($scope.newResult);
		$scope.newPost = {location_name:"", text: "", distance: ""};
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
