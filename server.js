var io = require('socket.io').listen(5588);


io.sockets.on('connection', function(socket)
{
	socket.emit('monster',{x : 300, y : 20});
	socket.on('win',function(socket)
 {
 	console.log("Gagné");
 });


socket.on('loose',function(socket)
 {
 	console.log("Perdu");
 });
}
);
 
