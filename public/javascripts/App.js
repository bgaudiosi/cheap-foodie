//App.js

'use strict';

var app = angular
	.module('foodApp', ['ngRoute', 'ngCookies'])
	.config(['$routeProvider', '$locationProvider',
		
		function ($routeProvider, $locationProvider) {
			$routeProvider.when('/', {
				controller: 'searchController',
				templateUrl: 'search.html',
			})
			
			.when('/login', {
				controller: 'loginController',
				templateUrl: 'login.html',
			})
			
			.when('/searchResults',{
                controller: 'searchController',
				templateUrl: 'searchResults.html',
                  
            })
			
			.when('/restaurants/:restaurantId', {
				controller: 'restaurantController',
				templateUrl: 'restaurants.html',
			})
			
			.when('/profile', {
				controller: 'profileController',
				templateUrl: 'profile.html',
			})
			
			/*.otherwise({ redirectTo: '/' })*/;
	}])
	.run(['$rootScope', '$location', '$cookieStore', '$http',
		function run($rootScope, $location, $cookieStore, $http) {
			// keep user logged in after page refresh
			$rootScope.globals = $cookieStore.get('globals') || {};
			if ($rootScope.globals.currentUser) {
				$http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
			}
			$rootScope.$on('$locationChangeStart', function (event, next, current) {
				// redirect to login page if not logged in and trying to access a restricted page
				console.log($rootScope);
				
				var restrictedPage = ['/login', '/', '/logout'].indexOf($location.path()) === -1;
				if (restrictedPage) {
					$http.get('/user').then(function(success) {
						if (success.data === "") {
							$location.path('/login');
						} else {
							console.log("you are logged in");
						}
					}, function(failure) {
						console.log("ruh roh shaggy");
					});
				}
			});
		}]);


app.controller("searchController", function($scope, $http, $location) {
	$scope.user = false;

	$scope.results = [];
	$scope.newResult = {location_name: "", number: "", logo: "", address: "", url: ""};
	$scope.searchTerm = '';
	$scope.loc = "";
	$scope.search = function() {
        $scope.results = [];
		$scope.data = {search: $scope.searchTerm, loc: $scope.loc}
		$http.post('/search', $scope.data)
			.then(function success(data) {
				var restaurants = data.data;
				for (var i = 0; i < restaurants.length; i++) {
					var curr = $scope.eatStreetResult(restaurants[i]);
				}
				console.log($scope.results);
			}, function failure(data) {
				console.log("Error: Bad call to server");
			});
	
	};

	$scope.eatStreetResult = function( restaurant ) {
		$scope.results.push($scope.thisRestaurant);

		$scope.thisRestaurant = {location_name: restaurant.name, 
			number: restaurant.phone, 
			logo: restaurant.logoUrl, 
			address: restaurant.streetAddress + ", " + restaurant.city + ", " + restaurant.state + ".", url: restaurant.url
		};
	};


});

app.controller("restaurantController", function($scope,$routeParams, $http, $cookieStore, $location) {
	console.log($routeParams.restaurantId);
}
	
);

app.controller("profileController", function($scope, $http, $cookieStore) {
	$scope.name = "not set";
	$scope.loc = "not set";
	$scope.profilePic = "err";
	
	$http.get('/user').then(function(success) {
		$scope.name = success.data.name;
		$scope.loc = success.data.location;
		$scope.profilePic = success.data.profileUrl;
	}, function(failure) {
		console.log(failure);
	});
});
