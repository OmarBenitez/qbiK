var socket = io.connect('http://localhost:1337/');

angular.module('qbik', ['ngRoute', 'textAngular']).config(function ($routeProvider) {
    $routeProvider
            .when('/', {
                templateUrl: '/public/views/home.html'
                , controller: 'home'})
            .when('/publicaciones/new', {
                templateUrl: '/public/views/Publicaciones/blank.html'
                , controller: 'publicaciones'})
            .when('/publicaciones/hashtag', {
                templateUrl: '/public/views/Publicaciones/hashtag.html',
                controller: 'publicaciones'
            })
            .otherwise({redirectTo: '/'});
}).factory('appFactory', function ($rootScope) {

    var service = {};
    service.publicaciones = [];


    service.sendEvent = function (event) {
        $rootScope.$broadcast(event);
    };

    service.addPublicacion = function (publicacion) {
        socket.emit('newPublicacion', publicacion);
    };

    return service;

}).controller('home', function ($scope, appFactory) {

}).controller('publicaciones', function ($scope, appFactory) {

    $scope.publicaciones = [];

    $scope.add = function (p) {
        appFactory.addPublicacion(p);
    };


    //Test
    $scope.click = function (arg) {
        alert('Clicked ' + arg);
    };
//    $scope.html = '<a ng-click="click(1)" href="#">Click me</a>';
    $scope.comentario  = '<p>Hello</p>';

}).directive('hashtag', function ($compile) {
    return {
        restrict: 'A',
        replace: true,
        link: function (scope, ele, attrs) {
            scope.$watch(attrs.hashtag, function (comentario) {
                var hashtags = [];
                var tmpHashtag = "";
                var hashFoundAt = -1;
                for (var i = 0; i < comentario.length; i++) {
                    console.log('**********');
                    console.log('current: ' + comentario[i]);
                    if (hashFoundAt === -1) {
                        if (comentario[i] === "#") {
                            hashFoundAt = i;
                        };
                    } else {
                        if (comentario[i] === " " || i === comentario.length - 1) {
                            //Fin del hashtag, revisar si el tamaño es mas de 1
                            if (tmpHashtag.length > 0) {
                                comentario = comentario.substring(i) + '<a href="#">' + tmpHashtag + '</a>' + comentario.substring(i, comentario.length);
//                                for (var j = 0; j < hashtags.length; i++) {
//                                    
//                                    if (hashtags[j] === tmpHashtag) {
//                                        
//                                    }
//                                }
                            }
                        } else if (comentario[i] === "#") {
                            //ignorar lo anterior, este noob no sabe poner hashtags
                        } else {
                            tmpHashtag += comentario[i];
                        }
                    }
                    
                }
                ele.html(comentario);
                $compile(ele.contents())(scope);
            });
        }
    };
});
