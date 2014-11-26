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
    service.publicacion = {};


    service.sendEvent = function (event) {
        $rootScope.$broadcast(event);
    };

    service.addPublicacion = function (publicacion) {
        socket.emit('newPublicacion', publicacion);
    };

    service.getPublicacion = function(id) {
        socket.emit('getPublicacion', id);
    };

    service.getUsuario = function(id) {

        socket.emit('getUsuario', id);

        socket.on('takeUsuario', function(usuario) {
            console.log(usuario);
        });
    };

    socket.on('takePublicacion', function(publicacion) {
        service.publicacion = publicacion;
        service.sendEvent('takePublicacion');
    });

    return service;


}).controller('home', function($scope, appFactory, $http) {

    $scope.pubs = [];
    
    $scope.topPubs = [];
    
    $http.get('/publicaciones/list').success(function(data){
        $scope.pubs = data;
        $scope.topPubs = data;
    });

}).controller('publicaciones', function($scope, appFactory, $routeParams, $rootScope) {

    $scope.publicaciones = [];
    $scope.mensaje = "hola mundo :D";

    $scope.add = function (p) {
        appFactory.addPublicacion(p);
    };

    socket.on('newProdSuccess', function(object) {
        window.location = "/#/publicaciones/" + object.idAsStr;
    });

    if ($routeParams.id) {

        appFactory.getPublicacion($routeParams.id);

        $scope.$on('takePublicacion', function() {
            $scope.object = appFactory.publicacion;
            $rootScope.$apply();
        });
    }

    //Test
    $scope.click = function (arg) {
        alert('Clicked ' + arg);
    };
//    $scope.html = '<a ng-click="click(1)" href="#">Click me</a>';
    $scope.comentario = '';

}).filter('hashtagFilter2', function () {
    return function(input) {
        var hashtagLink = "/tags/";
        if (null === input || undefined === input || input.length === 0) {
            return "";
        }
        return input.replace(/\#[a-zA-Z0-9]+/g, function (match, group1) {
            return '<a href="' + hashtagLink + match.substring(1, match.length) + '">'
                    + match
                    + '</a>';
        });
    };
}).filter('hashtagFilter', function () {
    //@Deprecated
    return function(input) {
        if (null === input || undefined === input || input.length === 0) {
            return "";
        }
        var hashtags = [];
        var tmpHashtag = "";
        var hashFoundAt = -1;
        var hashtagLink = "/tags/";
        var publicacionWithLinks = "";
        var originalText = "" + input.substring(3, input.length - 4);
        var concatHashtagLink = function (publicacionWithLinks, hashtagLink, tmpHashtag) {
            return publicacionWithLinks
                    + '<a href="' + hashtagLink + tmpHashtag + '">'
                    + '#' + tmpHashtag
                    + '</a>';
        };
        for (var i = 0; i < originalText.length; i++) {
            if (originalText[i] === "#") {
                if (hashFoundAt === -1) {
                    //Se ha encontrado un #
                    hashFoundAt = i;
                    if (publicacionWithLinks.length === 0) {
                        publicacionWithLinks = originalText.substring(0, i);
                    } else if (tmpHashtag.length > 0) {
                        publicacionWithLinks = concatHashtagLink(publicacionWithLinks, hashtagLink, tmpHashtag);
                        hashFoundAt = i;
                        hashtags.push(tmpHashtag);
                        tmpHashtag = "";
                    }
                } else {
                    if (tmpHashtag.length > 0) {
                        publicacionWithLinks = concatHashtagLink(publicacionWithLinks, hashtagLink, tmpHashtag);
                        hashFoundAt = i;
                        hashtags.push(tmpHashtag);
                        tmpHashtag = "";
                    }
                }
            } else if (hashFoundAt !== -1) {
                //Cualquier otra cosa que no sea #, despues de haber encontrado un #
                if (/^[^a-z0-9]$/i.test(originalText[i]) || i === originalText.length - 1) {
                    if (/^[a-z0-9]$/i.test(originalText[i])) {
                        //# con un solo caracter
                        tmpHashtag += originalText[i];
                    }
                    //Un hashtag termina despues de encontrar algun caracter que no sea número o letra o al final del texto
                    if (tmpHashtag.length > 0) {
                        publicacionWithLinks = concatHashtagLink(publicacionWithLinks, hashtagLink, tmpHashtag);
                        hashFoundAt = -1;
                        hashtags.push(tmpHashtag);
                        tmpHashtag = "";
                        if (originalText[i] !== "#" && !/^[a-z0-9]$/i.test(originalText[i])) {
                            //Si el caracter no es un # simplemente se agrega
                            publicacionWithLinks += originalText[i];
                        } else if (originalText[i] === "#") {
                            //Si es un #, entonces se comienza el proceso nuevamente
                            hashFoundAt = i;
                        }
                    } else {
                        //???
                        //Todo: revisar otros tipos de espacio, como \t o \n, etc
                        publicacionWithLinks += originalText[i];
                    }
                } else {
                    //Se ha encontrado un caracter despues del # ([a-z0-9])
                    //Se agrega el caracter al hashtag temporal
                    tmpHashtag += originalText[i];
                }
            } else {
                //Si no es un #, y si no es una letra o numero despues de un #, entonces simplemente se agrega
                publicacionWithLinks += originalText[i];
            }
        }
        return publicacionWithLinks;
    };
}).directive('hashtag', function () {
    return {
        restrict: 'E',
        scope: {
            ngModel: "="
        },
        template:
                '<div class="contenido" ng-bind-html = "ngModel | hashtagFilter2"></div>'
    };
}).controller('usuarios', function($routeParams, appFactory) {
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
