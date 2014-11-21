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
            socket.broadcast.emit("updateProds", publicacion);
            if (!error && response.statusCode === 200) {
                console.log(body);
            }
        });

    });

// 	socket.on("loginUser", function(username){

//         //si existe el nombre de usuario en el chat
//         var ban = false;

//         for (var i = usuariosOnline.length - 1; i >= 0; i--) {
//         	if(usuariosOnline[i].nombre === username){
//         		ban = true;
//         	}
//         };

//         if(ban){
//         	socket.emit("userInUse");
//         	return;
//         }
//         //Guardamos el nombre de usuario en la sesión del socket para este cliente
//         socket.username = username;
//         //añadimos al usuario a la lista global donde almacenamos usuarios
//         usuariosOnline.push({'nombre' : socket.username});
//         //mostramos al cliente como que se ha conectado
//         socket.emit("refreshChat", "Bienvenido " + socket.username + ", te has conectado correctamente.");
//         //mostramos de forma global a todos los usuarios que un usuario
//         //se acaba de conectar al chat
//         socket.broadcast.emit("refreshChat", "El usuario " + socket.username + " se ha conectado al chat.");
//         //actualizamos la lista de usuarios en el chat del lado del cliente
//         io.sockets.emit("updateSidebarUsers", usuariosOnline);
//     });

// socket.on("disconnect", function(){
// 	console.log("Disconect");
//         //si el usuario, por ejemplo, sin estar logueado refresca la
//         //página, el typeof del socket username es undefined, y el mensaje sería 
//         //El usuario undefined se ha desconectado del chat, con ésto lo evitamos
//         if(typeof(socket.username) == "undefined"){
//         	return;
//         }
//         //en otro caso, eliminamos al usuario
//         //si existe el nombre de usuario en el chat
//         var ban = false;
//         var tmp = [];
//         for (var i = usuariosOnline.length - 1; i >= 0; i--) {
//         	if(usuariosOnline[i].nombre !== socket.username){
//         		tmp[tmp.length] = usuariosOnline[i];
//         	}
//         };
//         usuariosOnline = tmp;
//         //actualizamos la lista de usuarios en el chat, zona cliente
//         io.sockets.emit("updateSidebarUsers", usuariosOnline);
//         //emitimos el mensaje global a todos los que están conectados con broadcasts
//         socket.broadcast.emit("refreshChat", "El usuario " + socket.username + " se ha desconectado del chat.");
//     });

// socket.on('msg', function(data){
// 	socket.broadcast.emit('newMsg', data);
// });
});

server.listen(1337);