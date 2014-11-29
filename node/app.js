var express = require('express'),
        app = express(),
        server = require('http').createServer(app),
        io = require('socket.io').listen(server);

var Client = require('node-rest-client').Client;

client = new Client();

app.configure(function () {
    app.use(express.static(__dirname + '/public'));
});

var usuariosOnline = [];
var baseUrl = "http://localhost:9000";

io.sockets.on('connection', function (socket) {

    socket.on('getHomePubs', function () {
        client.get(baseUrl + "/publicaciones/list", function (data, response) {
            data = JSON.parse(data);
            if (data[0]) {
                socket.emit('takeHomePubs', data);
            }
        });
    });

    socket.on('getPublicacion', function (id) {
        client.get(baseUrl + "/publicaciones/show/" + id, function (data, response) {
            data = JSON.parse(data);
            if (data.idAsStr) {
                socket.emit('takePublicacion', data);
            }
        });

    });

    socket.on('newPublicacion', function (publicacion) {

        var args = {
            data: {
                'titulo': publicacion.titulo,
                'contenido': publicacion.contenido,
                'banner': publicacion.banner,
                'user': publicacion.usuario
            },
            headers: {"Content-Type": "application/json"}
        };

        client.post(
                baseUrl + '/publicaciones/create',
                args
                ,
                function (data, response) {
                    data = JSON.parse(data);
                    if (data.idAsStr) {
                        socket.emit('newProdSuccess', data);
                        socket.broadcast.emit('takeNewHomePub', data);
                    }
                });

    });

    socket.on('updatePublicacion', function (publicacion) {
        var args = {
            data: {
                'publicacionId': publicacion.idAsStr,
                'titulo': publicacion.titulo,
                'contenido': publicacion.contenido,
                'banner': publicacion.banner
            },
            headers: {"Content-Type": "application/json"}
        };
        
        client.post(
                baseUrl + '/publicaciones/update',
                args
                ,
                function (data, response) {
                    data = JSON.parse(data);
                    if (data.idAsStr) {
                        socket.emit('upProdSuccess', data);
                        socket.broadcast.emit('takeUpHomePub', data);
                    }
                });
    });


    socket.on('getUsuario', function (id) {
        var route = baseUrl + '/usuario/json/' + id;
        var route2 = baseUrl + "/usuario/json/5474cd31ccf2e2dc88c13fdc";
        client.get(route, function (data, response) {

            socket.emit('takeUsuario', JSON.parse(data));

        });

    });
    
    socket.on('updateUsuario', function (usuario) {
        var args = {
            data: {
                'id': usuario.idAsStr,
                'nombre': usuario.nombre,
                'email': usuario.email
            },
            headers: {"Content-Type": "application/json"}
        };

        client.post(
                baseUrl + '/usuarios/update',
                args,
                function (data, response) {
                    data = JSON.parse(data);
                    if (data.idAsStr) {
                        socket.emit('upUserSuccess', data);
                        socket.broadcast.emit('takeUpUser', data);
                    }
                });
    });

    socket.on('rate', function (id, rating, userId) {

        client.get(baseUrl + '/publicacion/rate/'
                + id + '/' + rating + '/' + userId, function (data) {

                    console.log(JSON.parse(data).rating);

                    socket.emit('updateRate', JSON.parse(data));
                    socket.broadcast.emit('updatedPub', JSON.parse(data));

                });

    });

    socket.on('newComentario', function (publicacionId, usuarioId, comentario) {

        var args = {
            data: {
                'publicacionId': publicacionId,
                'usuarioId': usuarioId,
                'comentario': comentario
            },
            headers: {"Content-Type": "application/json"}
        };

        client.post(baseUrl + '/publicacion/comment',
                args,
                function (data, response) {
                    data = JSON.parse(data);
                    if (data.success) {
                        io.sockets.emit('newCommentSuccess', data);
                    }
                });
    });
    
    socket.on('delComentario', function (publicacionId, comentario) {
        var args = {
            data: {
                'publicacionId': publicacionId,
                'comentarioId': comentario.idAsStr
            },
            headers: {"Content-Type": "application/json"}
        };

        client.post(baseUrl + '/publicacion/delcomment',
                args,
                function (data, response) {
                    data = JSON.parse(data);
                    if (data.success) {
                        io.sockets.emit('delCommentSuccess', data);
                    }
                });
    });
    
    socket.on('delPost', function (publicacionId) {
        console.log('publicacionId');
        console.log(publicacionId);
        var args = {
            data: {
                'publicacionId': publicacionId
            },
            headers: {"Content-Type": "application/json"}
        };

        client.post(baseUrl + '/publicacion/delpost',
                args,
                function (data, response) {
                    data = JSON.parse(data);
                    if (data.success) {
                        socket.emit('delPostSuccess', data);
                        socket.broadcast.emit('takePostDelete', data);
                    }
                });
    });



});

server.listen(1337);