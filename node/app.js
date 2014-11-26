var express = require('express'),
        app = express(),
        server = require('http').createServer(app),
        io = require('socket.io').listen(server);

var Client = require('node-rest-client').Client;

client = new Client();

app.configure(function() {
    app.use(express.static(__dirname + '/public'))
});

var usuariosOnline = [];

io.sockets.on('connection', function(socket) {
    
    socket.on('getPublicacion', function(id) {
        client.get("http://localhost:9000/publicaciones/show/" + id, function(data, response) {
            data = JSON.parse(data);
            if (data.idAsStr) {
                socket.emit('takePublicacion', data);
            }
        });

    });

    socket.on('newPublicacion', function(publicacion) {

        var args = {
            data: {
                'titulo': publicacion.titulo,
                'contenido': publicacion.contenido,
                'banner': publicacion.banner
            },
            headers: {"Content-Type": "application/json"}
        };

        client.post(
                'http://localhost:9000/publicaciones/create',
                args
                ,
                function(data, response) {
                    data = JSON.parse(data);
                    if (data.idAsStr) {
                        socket.emit('newProdSuccess', data);
                        socket.broadcast.emit("updateProds", publicacion);
                    }
                });

    });


    socket.on('getUsuario', function(id) {
        var route = 'http://localhost:9000/usuario/json/' + id;
        console.log(route);
        client.get("http://localhost:9000/usuario/json/5474cd31ccf2e2dc88c13fdc", function(data, response) {

            socket.emit('takeUsuario', JSON.parse(data));

        });

    });



});

server.listen(1337);