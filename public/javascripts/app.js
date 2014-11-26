var socket = io.connect('http://localhost:1337/');

angular.module('qbik', ['ngRoute', 'textAngular']).config(function ($routeProvider) {
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
}).factory('appFactory', function ($rootScope) {

    var service = {};
    service.publicaciones = [];


    service.sendEvent = function (event) {
        $rootScope.$broadcast(event);
    };

    service.addPublicacion = function (publicacion) {
        socket.emit('newPublicacion', publicacion);
    };

    service.getUsuario = function (id) {

        socket.emit('getUsuario', id);

        socket.on('takeUsuario', function (usuario) {
            console.log(usuario);
        });
    };

    return service;

}).controller('home', function ($scope, appFactory) {

}).controller('publicaciones', function ($scope, appFactory, $location) {

    $scope.publicaciones = [];
    $scope.mensaje = "hola mundo :D";

    $scope.add = function (p) {
        appFactory.addPublicacion(p);
    };

    socket.on('newProdSuccess', function (object) {
        console.log(object);
        $location.path("/publicaciones/" + object.isAsStr);
    });

    //Test
    $scope.click = function (arg) {
        alert('Clicked ' + arg);
    };
//    $scope.html = '<a ng-click="click(1)" href="#">Click me</a>';
    $scope.comentario = '';

}).directive('hashtag', function ($compile) {
    return {
        restrict: 'A',
        replace: true,
        link: function (scope, ele, attrs) {
            scope.$watch(attrs.hashtag, function (comentario) {
                var hashtags = [];
                var tmpHashtag = "";
                var hashFoundAt = -1;
                var hashtagLink = "/tags/";
                comentario = "";
                var concatHashtagLink = function (comentario, hashtagLink, tmpHashtag) {
                    return comentario
                            + '<a href="' + hashtagLink + tmpHashtag + '">'
                            + '#' + tmpHashtag
                            + '<a>';
                };
                for (var i = 0; i < scope.comentario.length; i++) {
                    if (scope.comentario[i] === "#") {
                        if (hashFoundAt === -1) {
                            //Se ha encontrado un #
                            hashFoundAt = i;
                            if (comentario.length === 0) {
                                comentario = scope.comentario.substring(0, i);
                            } else if (tmpHashtag.length > 0) {
                                comentario = concatHashtagLink(comentario, hashtagLink, tmpHashtag);
                                hashFoundAt = i;
                                hashtags.push(tmpHashtag);
                                tmpHashtag = "";
                            }
                        } else {
                            if (tmpHashtag.length > 0) {
                                comentario = concatHashtagLink(comentario, hashtagLink, tmpHashtag);
                                hashFoundAt = i;
                                hashtags.push(tmpHashtag);
                                tmpHashtag = "";
                            }
                        }
                    } else if (hashFoundAt !== -1) {
                        //Cualquier otra cosa que no sea #, despues de haber encontrado un #
                        if (/^[^a-z0-9]$/i.test(scope.comentario[i]) || i === scope.comentario.length - 1) {
                            if (/^[a-z0-9]$/i.test(scope.comentario[i])) {
                                //# con un solo caracter
                                tmpHashtag += scope.comentario[i];
                            }
                            //Un hashtag termina despues de encontrar algun caracter que no sea número o letra o al final del texto
                            if (tmpHashtag.length > 0) {
                                comentario = concatHashtagLink(comentario, hashtagLink, tmpHashtag);
                                hashFoundAt = -1;
                                hashtags.push(tmpHashtag);
                                tmpHashtag = "";
                                if (scope.comentario[i] !== "#" && !/^[a-z0-9]$/i.test(scope.comentario[i])) {
                                    //Si el caracter no es un # simplemente se agrega
                                    comentario += scope.comentario[i];
                                } else if (scope.comentario[i] === "#") {
                                    //Si es un #, entonces se comienza el proceso nuevamente
                                    hashFoundAt = i;
                                }
                            } else {
                                //???
                                //Todo: revisar otros tipos de espacio, como \t o \n, etc
                                comentario += scope.comentario[i];
                            }
                        } else {
                            //Se ha encontrado un caracter despues del # ([a-z0-9])
                            //Se agrega el caracter al hashtag temporal
                            tmpHashtag += scope.comentario[i];
                        }
                    } else {
                        //Si no es un #, y si no es una letra o numero despues de un #, entonces simplemente se agrega
                        comentario += scope.comentario[i];
                    }

                }
                //TODO: hacer algo cuando queda un # extra, actualmente se ignora
                ele.html(comentario);
                $compile(ele.contents())(scope);
            });
        }
    };
}).controller('usuarios', function ($routeParams, appFactory) {
    appFactory.getUsuario($routeParams.id);
});


angular.module('login', ['ngRoute']).config(function ($routeProvider) {
    $routeProvider
            .when('/', {
                templateUrl: '/public/views/Login/loginForm.html'
                , controller: 'login'})
            .when('/registro', {
                templateUrl: '/public/views/Login/registroForm.html'
                , controller: 'login'})
            .otherwise({redirectTo: '/'});
}).controller('login', function ($scope, $http) {

    $http.get('/estados/json').success(function (data) {
        $scope.estados = data;
    });

    $scope.getMunicipios = function (estado) {
        $http.get('/municipios/json/' + estado.idAsStr).success(function (data) {
            $scope.municipios = data;
        });
    };

});
