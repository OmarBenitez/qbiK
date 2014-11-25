var socket = io.connect('http://localhost:1337/');

angular.module('qbik', ['ngRoute', 'textAngular']).config(function($routeProvider) {
    $routeProvider
            .when('/', {
                templateUrl: '/public/views/home.html'
                , controller: 'home'})
            .when('/publicaciones/new', {
                templateUrl: '/public/views/Publicaciones/blank.html'
                , controller: 'publicaciones'})
            .when('/publicaciones/:id', {
                templateUrl: '/public/views/Publicaciones/show.html',
                controller: 'publicaciones'
            })
            .when('/publicaciones/hashtag', {
                templateUrl: '/public/views/Publicaciones/hashtag.html',
                controller: 'publicaciones'
            })
            .when('/usuarios/show/:id', {
                templateUrl: '/public/views/Usuarios/show.html',
                controller: 'usuarios'
            })
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
    
    service.getUsuario = function(id){
        
        socket.emit('getUsuario', id);
        
        socket.on('takeUsuario', function(usuario){
            console.log(usuario);
        });
    };

    return service;

}).controller('home', function($scope, appFactory) {

}).controller('publicaciones', function($scope, appFactory, $location) {

    $scope.publicaciones = [];

    $scope.add = function(p) {
        appFactory.addPublicacion(p);
    };

    socket.on('newProdSuccess', function(object) {
        console.log(object);
        $location.path("/publicaciones/" + object.isAsStr);
    });

    //Test
    $scope.click = function(arg) {
        alert('Clicked ' + arg);
    };
//    $scope.html = '<a ng-click="click(1)" href="#">Click me</a>';
    $scope.comentario = '<p>Hello</p>';

}).directive('hashtag', function($compile) {
    return {
        restrict: 'A',
        replace: true,
        link: function(scope, ele, attrs) {
            scope.$watch(attrs.hashtag, function(comentario) {
                var hashtags = [];
                var tmpHashtag = "";
                var hashFoundAt = -1;
                for (var i = 0; i < comentario.length; i++) {
                    console.log('**********');
                    console.log('current: ' + comentario[i]);
                    if (hashFoundAt === -1) {
                        if (comentario[i] === "#") {
                            hashFoundAt = i;
                        }
                        ;
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
}).controller('usuarios', function($routeParams, appFactory){
    appFactory.getUsuario($routeParams.id);
});


angular.module('login', ['ngRoute']).config(function($routeProvider) {
    $routeProvider
            .when('/', {
                templateUrl: '/public/views/Login/loginForm.html'
                , controller: 'login'})
            .when('/registro', {
                templateUrl: '/public/views/Login/registroForm.html'
                , controller: 'login'})
            .otherwise({redirectTo: '/'});
}).controller('login', function($scope, $http) {

    $http.get('/estados/json').success(function(data) {
        $scope.estados = data;
    });

    $scope.getMunicipios = function(estado) {
        $http.get('/municipios/json/' + estado.idAsStr).success(function(data) {
            $scope.municipios = data;
        });
    };

});
