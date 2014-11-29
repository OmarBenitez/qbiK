String.prototype.contains = function (string) {
    return this.indexOf(string) > -1
};

var socket = io.connect('http://108.61.205.173:1337/');

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
            .when('/publicaciones/edit/:id', {
                templateUrl: '/public/views/Publicaciones/edit.html',
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
            .when('/usuarios/edit/:id', {
                templateUrl: '/public/views/Usuarios/edit.html',
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
            service.tmpCommentData = {};
            service.tmpPubData = {};
            service.tmpUserData = {};

            service.sendEvent = function (event) {
                $rootScope.$broadcast(event);
            };

            service.addPublicacion = function (publicacion) {
                socket.emit('newPublicacion', publicacion);
            };

            service.updatePublicacion = function (publicacion) {
                socket.emit('updatePublicacion', publicacion);
            };

            service.getPublicacion = function (id) {
                socket.emit('getPublicacion', id);
            };

            service.getUsuario = function (id) {

                socket.emit('getUsuario', id);

                socket.on('takeUsuario', function (usuario) {
                    service.tmpUserData = usuario;
                    service.sendEvent('takeUsuario');
                    $rootScope.$apply();
                });
            };

            service.getConnectedUser = function () {
                $http.get('/connected/user').success(function (data) {
                    service.user = data;
                });
            };

            service.updateUsuario = function (usuario) {
                socket.emit('updateUsuario', usuario);

                socket.emit('takeUsuario', usuario);
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

            service.comment = function (publicacionId, comentario) {
                socket.emit('newComentario', publicacionId, service.user.idAsStr, comentario);
            };

            service.deleteComment = function (publicacionId, comentario) {
                socket.emit('delComentario', publicacionId, comentario);
            };

            service.deletePost = function (publicacionId) {
                socket.emit('delPost', publicacionId);
            };

            socket.on('delPostSuccess', function (data) {
                window.location = '/#/';
            });

            socket.on('takePostDelete', function (data) {
                for (var i = 0; i < service.homePubs.length; i++) {
                    if (service.homePubs[i].idAsStr === data.publicacionId) {
                        service.homePubs.splice(i, 1);
                        break;
                    }
                }
                service.tmpPubData = data;
                service.sendEvent('takePostDelete');
                $rootScope.$apply();
            });

            socket.on('delCommentSuccess', function (data) {
                service.tmpCommentData = data;
                service.sendEvent('commentDeleted');
                $rootScope.$apply();
            });

            socket.on('takeHomePubs', function (publicaciones) {
                service.homePubs = publicaciones;
                service.sendEvent('takeHomePubs');
            });

            socket.on('takeNewHomePub', function (p) {
                service.homePubs = service.homePubs.reverse();
                service.homePubs.push(p);
                service.homePubs = service.homePubs.reverse();
                service.tmpPubData = p;
                service.sendEvent('newPub');
                $rootScope.$apply();
            });

            socket.on('takeUpHomePub', function (p) {
                for (var i = 0; i < service.homePubs.length; i++) {
                    if (service.homePubs[i].idAsStr === p.idAsStr) {
                        service.homePubs[i] = p;
                        break;
                    }
                }
                service.tmpPubData = p;
                service.sendEvent('upPub');
                $rootScope.$apply();
            });

            socket.on('takeUpUser', function (u) {
                if (service.user.idAsStr === u.idAsStr) {
                    service.user = u;
                }
                service.tmpUserData = u;
                service.sendEvent('upUser');
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

            socket.on('newCommentSuccess', function (data) {
                service.tmpCommentData = data;
                service.sendEvent('recieveComentario');
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

            $scope.pubs = [];

            if ($scope.pubs.length === 0) {
                appFactory.getHomePubs();
            }

            $scope.$on('takeHomePubs', function () {
                $scope.pubs = appFactory.homePubs;
                $rootScope.$apply();
            });

            $scope.$on('upPub', function () {
                var upPub = appFactory.tmpPubData;
                var foundAt = -1;
                for (var i = 0; i < $scope.pubs.length; i++) {
                    if ($scope.pubs[i].idAsStr === upPub.idAsStr) {
                        $scope.pubs[i] = upPub;
                        break;
                    }
                }
            });

            $scope.$on('upUser', function () {
                var upUser = appFactory.tmpUserData;

                for (var i = 0; i < $scope.pubs.length; i++) {
                    if ($scope.pubs[i].usuario.idAsStr === upUser.idAsStr) {
                        $scope.pubs[i].usuario = upUser;
                        break;
                    }
                }
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

                $scope.$on('newPub', function () {
                    var newpub = appFactory.tmpPubData;
                    if (checkContains(newpub, param, mode)) {
                        $scope.pubs = $scope.pubs.reverse();
                        $scope.pubs.push(newpub);
                        $scope.pubs = $scope.pubs.reverse();
                    }
                });

                $scope.$on('upPub', function () {
                    var upPub = appFactory.tmpPubData;
                    var foundAt = -1;

                    for (var i = 0; i < $scope.pubs.length; i++) {
                        if ($scope.pubs[i].idAsStr === upPub.idAsStr) {
                            foundAt = i;
                            break;
                        }
                    }

                    if (foundAt >= 0) {
                        if (checkContains(upPub, param, mode)) {
                            $scope.pubs[i] = upPub;
                        } else {
                            $scope.pubs.splice(i, 1);
                        }
                    } else {
                        if (checkContains(upPub, param, mode)) {
                            $scope.pubs = $scope.pubs.reverse();
                            $scope.pubs.push(upPub);
                            $scope.pubs = $scope.pubs.reverse();
                        }
                    }
                });

                $scope.$on('takePostDelete', function () {
                    console.log('takePostDelete');
                    var delPub = appFactory.tmpPubData;

                    for (var i = 0; i < $scope.pubs.length; i++) {
                        if ($scope.pubs[i].idAsStr === delPub.publicacionId) {
                            $scope.pubs.splice(i, 1);
                            break;
                        }
                    }
                });

                $scope.$on('upUser', function () {
                    var upUser = appFactory.tmpUserData;

                    for (var i = 0; i < $scope.pubs.length; i++) {
                        if ($scope.pubs[i].usuario.idAsStr === upUser.idAsStr) {
                            $scope.pubs[i].usuario = upUser;
                            break;
                        }
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
            $scope.object = {};

            $scope.add = function (p) {
                p.usuario = appFactory.user.idAsStr;
                appFactory.addPublicacion(p);
            };

            $scope.update = function (p) {
                appFactory.updatePublicacion(p);
            };

            $scope.rateFunction = function (rating) {
                if (appFactory.user.idAsStr) {
                    appFactory.rate($routeParams.id, rating, appFactory.user.idAsStr);
                } else {
                    $scope.rating = appFactory.publicacion.rating;
                    $rootScope.$apply();
                }
            };

            $scope.postComment = function (publicacionId, comentario) {
                if (comentario.length > 0) {
                    appFactory.comment(publicacionId, comentario);
                    $scope.comentario = '';
                }
            };

            socket.on('newProdSuccess', function (object) {
                window.location = "/#/publicaciones/" + object.idAsStr;
            });

            socket.on('upProdSuccess', function (object) {
                window.location = "/#/publicaciones/" + object.idAsStr;
            });

            if ($routeParams.id) {
                appFactory.getPublicacion($routeParams.id);

                $scope.$on('takePublicacion', function () {
                    $scope.object = appFactory.publicacion;
                    console.log($scope.object);
                    $scope.rating = appFactory.publicacion.rating;
                    $rootScope.$apply();
                });

                $scope.$on('recieveComentario', function () {
                    var data = appFactory.tmpCommentData;
                    if ($routeParams.id === data.publicacionId) {
                        $scope.object.comentarios.push(data.comentario);
                        $rootScope.$apply();
                    }
                });

                $scope.$on('upPub', function () {
                    var data = appFactory.tmpPubData;
                    if ($routeParams.id === data.idAsStr) {
                        $scope.object = data;
                        $rootScope.$apply();
                    }
                });

                $scope.$on('upUser', function () {
                    var upUser = appFactory.tmpUserData;

                    if ($scope.object.usuario.idAsStr === upUser.idAsStr) {
                        $scope.object.usuario = upUser;
                    }
                });

                $scope.$on('takePostDelete', function () {
                    console.log('takePostDelete1');
                    var delPub = appFactory.tmpPubData;
                    
                    console.log('$scope.object.idAsStr');
                    console.log($scope.object.idAsStr);
                    
                    console.log('delPub.publicacionId');
                    console.log(delPub.publicacionId);

                    if ($scope.object.idAsStr === delPub.publicacionId) {
                        window.location = "/#/";
                    }
                });

                if ($scope.object) {
                    $scope.isEditable = function () {
                        return $scope.object.usuario && $scope.object.usuario.idAsStr === appFactory.user.idAsStr;
//                                || ($scope.object.usuario.perfil && $scope.object.usuario.perfil === "ADMIN");
                    };

                    $scope.commentIsDeletable = function (comentario) {
                        return comentario.usuario.idAsStr === appFactory.user.idAsStr;
                    };

                    $scope.postIsDeletable = function () {
                        return $scope.object.usuario && $scope.object.usuario.idAsStr === appFactory.user.idAsStr;
                    };

                    $scope.deleteComment = function (comment) {
                        appFactory.deleteComment($scope.object.idAsStr, comment);
                    };

                    $scope.deletePost = function () {
                        appFactory.deletePost($scope.object.idAsStr);
                    };

                    $scope.$on('commentDeleted', function () {
                        var publicacionId = appFactory.tmpCommentData.publicacionId;
                        var comentarioId = appFactory.tmpCommentData.comentarioId;

                        if ($scope.object.idAsStr === publicacionId) {
                            for (var i = 0; i < $scope.object.comentarios.length; i++) {
                                if ($scope.object.comentarios[i].idAsStr === comentarioId) {
                                    $scope.object.comentarios.splice(i, 1);
                                }
                            }
                        }
                    });
                }

            } else {
                $scope.$on('takePostDelete', function () {
                    console.log('takePostDelete2');
                    var delPub = appFactory.tmpPubData;

                    for (var i = 0; i < $scope.pubs.length; i++) {
                        if ($scope.publicaciones[i].idAsStr === delPub.publicacionId) {
                            $scope.publicaciones.splice(i, 1);
                            break;
                        }
                    }
                });
            }

            $scope.$on('takeRate', function () {
                $scope.rating = appFactory.publicacion.rating;
                $rootScope.$apply();
            });

            $scope.$on('upUser', function () {
                var upUser = appFactory.tmpUserData;

                for (var i = 0; i < $scope.publicaciones.length; i++) {
                    if ($scope.publicaciones[i].usuario.idAsStr === upUser.idAsStr) {
                        $scope.publicaciones[i].usuario = upUser;
                        break;
                    }
                }
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
        .controller('usuarios', function ($scope, $routeParams, appFactory) {
            $scope.object = {};


            if ($routeParams.id) {
                appFactory.getUsuario($routeParams.id);

                $scope.$on('takeUsuario', function () {
                    $scope.object = appFactory.tmpUserData;
                });

                $scope.isEditable = function () {
                    return appFactory.user.idAsStr === $routeParams.id;
                };

                $scope.updateData = function (usuario) {
                    usuario.idAsStr = $routeParams.id;
                    appFactory.updateUsuario(usuario);
                };
            } else {
                window.location = '/#/';
            }


            socket.on('upUserSuccess', function (object) {
                window.location = "/#/usuarios/show/" + object.idAsStr;
            });
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
