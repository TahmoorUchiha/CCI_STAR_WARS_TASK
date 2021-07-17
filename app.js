var app = angular.module('StarWarsVehicles', ['ngResource']);

app.controller('MainController', ['$scope', '$http', function($scope, $http){
  $scope.vehicles = [];
  $scope.count = 0;
  $scope.first = 1;
  $scope.last = 10;
  $scope.loading = false;
  $scope.nextPage = null;
  $scope.prevPage = null;

  var timer = null;

  $scope.init = function() {
    $scope.loading = true;
    getData('https://swapi.dev/api/vehicles/');
  };

  $scope.goToPreviousPage = function() {
    $scope.loading = true;
    if($scope.prevPage != null){
      getData($scope.prevPage);
    }
  };

  $scope.goToNextPage = function() {
    $scope.loading = true;
    if($scope.nextPage != null){
      getData($scope.nextPage);
    }
  };

  function search(searchWord) {
    $scope.loading = true;
    getData('https://swapi.dev/api/vehicles/?search=' + searchWord);
  }

  $scope.onTextChanged = function(searchWord) {
    if (timer !== null) {
        clearTimeout(timer);
    }
    timer = setTimeout(function() {
        search(searchWord);
    }, 500);
  }

  function setFirstAndLast($urlNext, $urlPrevious) {
    var pageNumber = 1;

    if($urlNext == null && $urlPrevious == null) {
        $scope.first = 1;
        $scope.last = $scope.count;
    }

    if($urlPrevious == null && $urlNext != null) {
        pageNumber = parseInt((new URL($urlNext)).searchParams.get('page')) - 1;
        $scope.first = pageNumber * 10 - 9;
        $scope.last = pageNumber * 10;
    }

    if($urlNext == null && $urlPrevious != null) {
        pageNumber = parseInt((new URL($urlPrevious)).searchParams.get('page')) + 1;
        $scope.first = pageNumber * 10 - 9;
        $scope.last = $scope.count;
    }

    if($urlNext != null && $urlPrevious != null) {
        pageNumber = parseInt((new URL($urlPrevious)).searchParams.get('page')) + 1;
        $scope.first = pageNumber * 10 - 9;
        $scope.last = pageNumber * 10;
    }

  }
  
  function getData($url) {
    $http.get($url).success(function success(data) {
      $scope.vehicles = data.results;
      $scope.nextPage = data.next;
      $scope.prevPage = data.previous;
      $scope.count = data.count;
      setFirstAndLast(data.next, data.previous);
      $scope.loading = false;
    }, function error(data) {
      console.log('error');
      $scope.loading = false;
    });
  }
  
}]);