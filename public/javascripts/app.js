
$(function() {
    $('a[href*=#]:not([href=#])').click(function() {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top
                }, 1000);
                return false;
            }
        }
    });

    var geocoder = new google.maps.Geocoder();

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
    }
//Get the latitude and the longitude;
    function successFunction(position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        codeLatLng(lat, lng)
    }

    function errorFunction() {
       
    }



    function codeLatLng(lat, lng) {

        var latlng = new google.maps.LatLng(lat, lng);
        geocoder.geocode({'latLng': latlng}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                    //formatted address
                    //find country name
                    for (var i = 0; i < results[0].address_components.length; i++) {
                        for (var b = 0; b < results[0].address_components[i].types.length; b++) {

                            //there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate
                            if (results[0].address_components[i].types[b] == "administrative_area_level_1") {
                                //this is the object you are looking for
                                city = results[0].address_components[i];
                                break;
                            }
                        }
                    }
                    //city data
                    var c = document.getElementById('city');
                    if (c)
                        c.innerText = city.long_name;

                } else {
                }
            } else {
            }
        });
    }
});

var app = angular.module('qbik', ['textAngular']);

app.controller('mainCtrl', function($scope, $http) {

    $scope.estados = [];
    $scope.municipios = [];
    $scope.estado = null;
    $scope.municipio = null;

    $http.get('/estados.json').success(function(data, status) {
        $scope.estados = data;
    });

    $scope.getMunicipios = function() {
        $scope.municipio = null;
        $http.get('/municipios/' + $scope.estado.clave).success(function(data, status) {
            $scope.municipios = data;
        });
    };

    $scope.go = function() {

        window.location = "/publicaciones/" + $scope.municipio.clave;

    };

});

app.controller('newPubCtrl', function($scope) {

});
