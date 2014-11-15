var socket = io.connect('http://localhost:1337/');

angular.module('qbik', []).config(function($routeProvider) {
    $routeProvider
            .when('/', {
                templateUrl: 'public/views/index.html'
                , controller: 'home'})
            .when('/detalle/', {
                templateUrl: 'public/views/detalle.html'
                , controller: 'detalle'
            })
            .when('/add/', {
                templateUrl: 'public/views/new.html'
                , controller: 'nuevo'
            })
            .otherwise({redirectTo: '/'});
}).factory('appFactory', function($http, $rootScope) {

    var service = {};
    service.data = [];

    service.sendEvent = function(event) {
        $rootScope.$broadcast(event);
    }

    service.load = function() {
        $http.get('productos.json').success(function(data) {
            service.data = data;
            service.sendEvent('productos');
        })
    };

    return service;

}).controller('main', function($scope, $http) {

    $scope.estados = [];
    $scope.municipios = [];
    
    $http.get('/estados.json').success(function(data){
        $scope.estados = data;
    });
    
    $scope.getMunicipios = function(){
        $http.get('/municipios/'+$scope.estado.clave).success(function(data){
            $scope.municipios = data;
        });
    };

}).controller('home', function($scope, $rootScope, appFactory) {
    $scope.prods = [];
    appFactory.load();
    $scope.$on('productos', function() {
        $scope.prods = appFactory.data;
    });
    socket.on('updateProds', function(prod) {
        console.log(prod);
        $scope.prods.push(prod);
        $rootScope.$apply();
    });
}).controller('detalle', function($scope, appFactory) {
    $scope.prods = [];
    appFactory.load();
    $scope.$on('productos', function() {
        $scope.prods = appFactory.data;
    });
}).controller('nuevo', function($scope, $http) {
    $scope.send = function(dato) {
        $http.post('/add/prod', dato).success(function(data, status) {
            socket.emit('newProd', data);
            $scope.object = {};
        });
    };
});
