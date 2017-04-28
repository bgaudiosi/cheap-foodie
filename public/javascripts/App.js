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
			
			.when('/profile', {
				controller: 'profileController',
				templateUrl: 'profile.html',
			})
			
			.otherwise({ redirectTo: '/' });
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
				console.log("changing page");
				/*
				var restrictedPage = ['/login'].indexOf($location.path()) === -1;
				var loggedIn = $rootScope.globals.currentUser;
				if (restrictedPage && !loggedIn) {
					console.log("in restricted page");
					$location.path('/login');
				}*/
			});
		}]);


app.controller("searchController", function($scope, $http, $location) {
	$scope.user = false;

	$scope.results = [];
	$scope.newResult = {location_name: "", number: "", logo: "", address: "", url: ""};
	$scope.searchTerm = '';
	$scope.loc = "";
	$scope.search = function() {
		if (!$scope.user) {
			
		}
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

app.controller("loginController", function($scope, $http, $cookieStore, $location) {
	
	/* Not yet implemented */
	$scope.auth = function() {
					  
		$rootScope.globals = {
			currentUser: {
			username: username,
			authdata: authdata
			}
		};
								  
		$http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
		$cookieStore.put('globals', $rootScope.globals);
	};
}
	
);
