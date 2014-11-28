String.prototype.contains = function (string) {
    return this.indexOf(string) > -1
};

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
            .when('/search/:query', {
                templateUrl: '/public/views/Publicaciones/list.html',
                controller: 'busqueda'
            })
            .when('/tags/:tag', {
                templateUrl: '/public/views/Publicaciones/list.html',
                controller: 'busqueda'
            })
            .otherwise({redirectTo: '/'});
})
        /**
         * Fabrica de la aplicacion
         * 
         * @param {type} $rootScope
         * @param {type} $http
         * @returns {_L28.service}
         */
        .factory('appFactory', function ($rootScope, $http) {

            var service = {};
            service.homePubs = [];
            service.top10Pubs = [];
            service.publicacion = {};
            service.user = {};

            service.sendEvent = function (event) {
                $rootScope.$broadcast(event);
            };

            service.addPublicacion = function (publicacion) {
                socket.emit('newPublicacion', publicacion);
            };

            service.getPublicacion = function (id) {
                socket.emit('getPublicacion', id);
            };

            service.getUsuario = function (id) {

                socket.emit('getUsuario', id);

                socket.on('takeUsuario', function (usuario) {
                    console.log(usuario);
                });
            };

            service.getConnectedUser = function () {
                $http.get('/connected/user').success(function (data) {
                    service.user = data;
                });
            };

            service.search = function (query) {
                $http.get('/search/' + query).success(function (data) {
                    window.location = '/#/search/' + query;
                });
            };

            service.rate = function (id, rating, uid) {
                socket.emit('rate', id, rating, uid);
            };

            service.getHomePubs = function () {
                socket.emit('getHomePubs');
            };

            socket.on('takeHomePubs', function (publicaciones) {
                service.homePubs = publicaciones;
                service.sendEvent('takeHomePubs');
            });

            socket.on('takeNewHomePub', function (p) {
                service.homePubs = service.homePubs.reverse();
                service.homePubs.push(p);
                service.homePubs = service.homePubs.reverse();
                service.sendEvent('newPub', p);
                $rootScope.$apply();
            });

            socket.on('updateRate', function (publicacion) {
                service.publicacion = publicacion;
                service.sendEvent('takeRate');
            });

            socket.on('takePublicacion', function (publicacion) {
                service.publicacion = publicacion;
                service.sendEvent('takePublicacion');
            });

            service.getConnectedUser();

            return service;


        })

        /**
         * Controlador del inicio
         * @param {type} $scope
         * @param {type} appFactory
         * @param {type} $http
         * @returns {undefined}
         */
        .controller('home', function ($scope, appFactory, $rootScope) {

            if (!$scope.pubs) {
                appFactory.getHomePubs();
            }

            $scope.$on('takeHomePubs', function () {
                $scope.pubs = appFactory.homePubs;
                $rootScope.$apply();
            });

        })

        /**
         * Controlador de busqueda
         * 
         * @param {type} $scope
         * @param {type} appFactory
         * @param {type} $routeParams
         * @param {type} $http
         * @returns {undefined}
         */.controller('busqueda', function ($scope, appFactory, $routeParams, $http) {
            $scope.pubs = [];

            var mode = "";
            var param = "";
            var checkContains = function (pub, toCheck, mode) {
                if (pub && toCheck) {
                    var contained = false;
                    if (mode === "search") {
                        if (pub.titulo) {
                            contained = contained || pub.titulo.contains(toCheck);
                        }
                        if (pub.contenido) {
                            contained = contained || pub.contenido.contains(toCheck);
                        }
                        if (pub.hashtags && pub.hashtags.length > 0) {
                            for (var i = 0; i < pub.hashtags.length; i++) {
                                contained = contained || pub.hashtags[i].contains(toCheck);
                            }
                        }
                    } else if (mode === "tags") {
                        console.log('pub.hashtags: ' + pub.hashtags);
                        if (pub.hashtags && pub.hashtags.length > 0) {
                            for (var i = 0; i < pub.hashtags.length; i++) {
                                contained = contained || pub.hashtags[i].contains(toCheck);
                            }
                        }
                    }
                    return contained;
                } else {
                    return false;
                }
            };

            if ($routeParams.query) {
                mode = "search";
                param = $routeParams.query;
            } else if ($routeParams.tag) {
                mode = "tags";
                param = $routeParams.tag;
            }

            if (mode.length > 0 && param.length > 0) {
                $http.get('/' + mode + '/' + param).success(function (data) {
                    $scope.pubs = data;
                });

                $scope.$on('newPub', function (pub) {
                    console.log('pub.titulo: ' + pub.titulo);
                    console.log('param: ' + param);
                    console.log('checkContains(pub, param, mode): ' + checkContains(pub, param, mode));
                    if (checkContains(pub, param, mode)) {
                        $scope.pubs.push(pub);
                    }
                });
            }

            $scope.search = function (query) {
                if (query.length > 0) {
                    appFactory.search(query);
                }
            };
        })

        /**
         * Controlador de las publicaciones
         * 
         * @param {type} $scope
         * @param {type} appFactory
         * @param {type} $routeParams
         * @param {type} $rootScope
         * @returns {undefined}
         */
        .controller('publicaciones', function ($scope, appFactory, $routeParams, $rootScope) {

            if (!appFactory.user.idAsStr && window.location.toString().indexOf('new') > -1) {
                window.location = "/";
            }

            if (!appFactory.user.idAsStr && window.location.toString().indexOf('show') > -1) {
                window.location = "/";
            }

            $scope.publicaciones = [];
            $scope.rating = -1;

            $scope.add = function (p) {
                p.usuario = appFactory.user.idAsStr;
                appFactory.addPublicacion(p);
            };

            $scope.rateFunction = function (rating) {
                if (appFactory.user.idAsStr) {
                    appFactory.rate($routeParams.id, rating, appFactory.user.idAsStr);
                } else {
                    $scope.rating = appFactory.publicacion.rating;
                    $rootScope.$apply();
                }
            };

            socket.on('newProdSuccess', function (object) {
                window.location = "/#/publicaciones/" + object.idAsStr;
            });

            if ($routeParams.id) {

                appFactory.getPublicacion($routeParams.id);

                $scope.$on('takePublicacion', function () {
                    $scope.object = appFactory.publicacion;
                    $scope.rating = appFactory.publicacion.rating;
                    $rootScope.$apply();
                });
            }

            $scope.$on('takeRate', function () {
                $scope.rating = appFactory.publicacion.rating;
                $rootScope.$apply();
            });

            //Test
            $scope.click = function (arg) {
                alert('Clicked ' + arg);
            };
            $scope.comentario = '';

        })
        /**
         * Filtro para eliminar las etiquetas de html
         * @returns {Function}
         */
        .filter('htmlToPlaintext', function () {
            return function (text) {
                return String(text).replace(/<[^>]+>/gm, '');
            };
        })

        /**
         * Filtro para crear los hastags
         * @returns {Function}
         */
        .filter('hashtagFilter2', function () {
            return function (input) {
                var hashtagLink = "/#/tags/";
                if (null === input || undefined === input || input.length === 0) {
                    return "";
                }
                return input.replace(/\#[a-zA-Z0-9]+/g, function (match, group1) {
                    return '<a href="' + hashtagLink + match.substring(1, match.length) + '">'
                            + match
                            + '</a>';
                });
            };
        })

        /**
         * Directiva para el manejo de los ratings
         * @returns {_L202.Anonym$7}
         */
        .directive("starRating", function () {
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
                link: function (scope, elem, attrs) {
                    var updateStars = function () {
                        scope.stars = [];
                        for (var i = 0; i < scope.max; i++) {
                            scope.stars.push({
                                filled: i < scope.ratingValue
                            });
                        }
                    };
                    scope.toggle = function (index) {
                        scope.ratingValue = index + 1;
                        scope.onRatingSelected({
                            rating: index + 1
                        });
                    };
                    scope.$watch("ratingValue", function (oldVal, newVal) {
                        if (newVal) {
                            updateStars();
                        }
                    });
                }
            };
        })
        /**
         * Directiva para el manejo de los hashtags
         * @returns {_L254.Anonym$10}
         */
        .directive('hashtag', function () {
            return {
                restrict: 'E',
                scope: {
                    ngModel: "="
                },
                template:
                        '<div class="contenido" ng-bind-html = "ngModel | hashtagFilter2"></div>'
            };
        })

        /**
         * Controlador de usuarios
         * 
         * @param {type} $routeParams
         * @param {type} appFactory
         * @returns {undefined}
         */
        .controller('usuarios', function ($routeParams, appFactory) {
            appFactory.getUsuario($routeParams.id);
        });
/**
 * Modulo del login y registro
 * @param {type} param1
 * @param {type} param2
 */
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
