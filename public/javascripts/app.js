var app = angular.module('app', ["userAuth"])

.controller('ResultsCtrl', function($scope, $http, auth, $location){
    
    $scope.businesses = [];
    
     $scope.$watch('area', function(){
        fetch();
    });
    
    $scope.area = 'New York';
    function fetch(){
        $http.get("/search/bars/" + $scope.area).then(function(res){
            angular.copy(res.data, $scope.businesses); 
        });
    }
    
    $scope.user = {};
    
    $scope.register = function(){
        auth.register($scope.user).then(function(){
            $location.path('/');
    });
  };
  
  $scope.login = function(){
    auth.login($scope.user).then(function(){
      $location.path('/');
    });
  };
    
})

.controller('NavCtrl', function($scope, auth){
    
    $scope.count = 0;
    
    $scope.isLoggedIn = auth.isLoggedIn;
    $scope.currentUser = auth.currentUser;
    $scope.logout = auth.logout;
    
    $scope.join = function(){
        if($scope.count === 0){
            $scope.count++;
        } else {
            $scope.count--;
        }
    };
    
    
});