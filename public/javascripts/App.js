//App.js

var app = angular.module("foodApp", []);

app.controller("mainController", function($scope, $http) {
	
	
	$scope.results = [];
	$scope.newResult = {location_name: "", number: "", logo: "", address: "", url: ""};
	$scope.searchTerm = '';
	$scope.loc = "";
	$scope.search = function() {
        $scope.results = [];
		$scope.data = {search: $scope.searchTerm, loc: $scope.loc}
		$http.post('http://localhost:3000/', $scope.data).success(function(data) {
			restaurants = data;
			for (var i = 0; i < restaurants.length; i++) {
				var curr = $scope.eatStreetResult(restaurants[i]);
			}
			console.log($scope.results);
		}).error(function(data) {
			console.log("Error: Bad call to server");
		});
	
	};

	$scope.eatStreetResult = function( restaurant ) {
		$scope.results.push($scope.thisRestaurant);
		$scope.thisRestaurant = {location_name: restaurant.name, number: restaurant.phone, logo: restaurant.logoUrl, address: restaurant.streetAddress + ", " + restaurant.city + ", " + restaurant.state + ".", url: restaurant.url};
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
