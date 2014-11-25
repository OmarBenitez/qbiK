var express = require('express'),
        app = express(),
        server = require('http').createServer(app),
        io = require('socket.io').listen(server);
var request = require('request');

app.configure(function() {
    app.use(express.static(__dirname + '/public'))
});

var usuariosOnline = [];

io.sockets.on('connection', function(socket) {

    socket.on('newPublicacion', function(publicacion) {



        request.post(
                'http://localhost:9000/publicaciones/create',
                {
                    form:
                            {
                                'object.titulo': publicacion.titulo,
                                'object.contenido': publicacion.contenido,
                                'object.banner': publicacion.banner
                            }
                },
        function(error, response, body) {
            if (!error && response.statusCode === 200) {
                if(body.idAsStr){
                    socket.emit('newProdSuccess', body);
                    socket.broadcast.emit("updateProds", publicacion);
                } 
            }
        });

    });

});

server.listen(1337);