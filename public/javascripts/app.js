var socket = io.connect('http://localhost:1337/');

angular.module('qbik', ['ngRoute', 'textAngular']).config(function($routeProvider) {
    $routeProvider
            .when('/', {
                templateUrl: '/public/views/home.html'
                , controller: 'home'})
            .when('/productos/new', {
                templateUrl: '/public/views/Publicaciones/blank.html'
                , controller: 'productos'})
            .otherwise({redirectTo: '/'});
}).factory('appFactory', function($rootScope) {

    var service = {};
    service.publicaciones = [];


    service.sendEvent = function(event) {
        $rootScope.$broadcast(event);
    };

    service.addPublicacion = function(publicacion) {
        socket.emit('newPublicacion', publicacion);
    };

    return service;

}).controller('productos', function($scope, appFactory) {

    $scope.productos = [];

    $scope.add = function(p) {
        appFactory.addPublicacion(p);
    };

});
