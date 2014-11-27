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
}).factory('appFactory', function($rootScope, $http) {

    var service = {};
    service.publicaciones = [];
    service.publicacion = {};
    service.user = {};

    service.sendEvent = function(event) {
        $rootScope.$broadcast(event);
    };

    service.addPublicacion = function(publicacion) {
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

    service.getConnectedUser = function() {
        $http.get('/connected/user').success(function(data) {
            service.user = data;
        });
    };
    
    service.search = function(query) {
        $http.get('/search/' + query).success(function(data) {
            window.location= '/#/search/' + query;
        });
1    };

    service.rate = function(id, rating, uid) {
        socket.emit('rate', id, rating, uid);
    };

    socket.on('updateRate', function(publicacion) {
        service.publicacion = publicacion;
        service.sendEvent('takeRate');
    });

    socket.on('takePublicacion', function(publicacion) {
        service.publicacion = publicacion;
        service.sendEvent('takePublicacion');
    });

    service.getConnectedUser();

    return service;


}).controller('home', function($scope, appFactory, $http) {

    $scope.pubs = [];

    $scope.topPubs = [];

    $http.get('/publicaciones/list').success(function(data) {
        $scope.pubs = data;
        $scope.topPubs = data;
    });

}).controller('busqueda', function($scope, appFactory) {
    $scope.search = function(query) {
        if (query.length > 0) {
//            console.log('query: ' + query);
            appFactory.search(query);
        }
    };
}).controller('publicaciones', function($scope, appFactory, $routeParams, $rootScope) {

    if (!appFactory.user.idAsStr && window.location.toString().indexOf('new') > -1) {
        window.location = "/";
    }

    if (!appFactory.user.idAsStr && window.location.toString().indexOf('show') > -1) {
        window.location = "/";
    }

    $scope.publicaciones = [];
    $scope.rating = -1;

    $scope.add = function(p) {
        p.usuario = appFactory.user.idAsStr;
        appFactory.addPublicacion(p);
    };

    $scope.rateFunction = function(rating) {
        if (appFactory.user.idAsStr) {
            appFactory.rate($routeParams.id, rating, appFactory.user.idAsStr);
        } else {
            $scope.rating = appFactory.publicacion.rating;
            $rootScope.$apply();
        }
    };

    socket.on('newProdSuccess', function(object) {
        window.location = "/#/publicaciones/" + object.idAsStr;
    });

    if ($routeParams.id) {

        appFactory.getPublicacion($routeParams.id);

        $scope.$on('takePublicacion', function() {
            $scope.object = appFactory.publicacion;
            $scope.rating = appFactory.publicacion.rating;
            $rootScope.$apply();
        });
    }

    $scope.$on('takeRate', function() {
        $scope.rating = appFactory.publicacion.rating;
        $rootScope.$apply();
    });

    //Test
    $scope.click = function(arg) {
        alert('Clicked ' + arg);
    };
//    $scope.html = '<a ng-click="click(1)" href="#">Click me</a>';
    $scope.comentario = '';

}).filter('hashtagFilter2', function() {
    return function(input) {
        var hashtagLink = "/tags/";
        if (null === input || undefined === input || input.length === 0) {
            return "";
        }
        return input.replace(/\#[a-zA-Z0-9]+/g, function(match, group1) {
            return '<a href="' + hashtagLink + match.substring(1, match.length) + '">'
                    + match
                    + '</a>';
        });
    };
}).directive("starRating", function() {
    return {
        restrict: "A",
        template: "<ul class='rating'>" +
                "  <li ng-repeat='star in stars' ng-class='star' ng-click='toggle($index)'>" +
                "    <i class='fa fa-star'></i>" + //&#9733
                "  </li>" +
                "</ul>",
        scope: {
            ratingValue: "=",
            max: "=",
            onRatingSelected: "&"
        },
        link: function(scope, elem, attrs) {
            var updateStars = function() {
                scope.stars = [];
                for (var i = 0; i < scope.max; i++) {
                    scope.stars.push({
                        filled: i < scope.ratingValue
                    });
                }
            };
            scope.toggle = function(index) {
                scope.ratingValue = index + 1;
                scope.onRatingSelected({
                    rating: index + 1
                });
            };
            scope.$watch("ratingValue", function(oldVal, newVal) {
                if (newVal) {
                    updateStars();
                }
            });
        }
    };
}).directive('hashtag', function() {
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
