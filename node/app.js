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
                if (body.idAsStr) {
                    socket.emit('newProdSuccess', body);
                    socket.broadcast.emit("updateProds", publicacion);
                }
            }
        });

    });


    socket.on('getUsuario', function(id) {
        var route = 'http://localhost:9000/usuario/json/' + id;
        console.log(route);
        client.get("http://localhost:9000/usuario/json/5474cd31ccf2e2dc88c13fdc", function(data, response){
            
            socket.emit('takeUsuario', JSON.parse(data));
            
        });
        
    });



});

server.listen(1337);