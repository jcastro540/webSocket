const express = require('express');
let app = express();
let server = require('http').Server(app);
let io = require('socket.io')(server);
let mongoose = require('mongoose');
let Message = require('./models/message');

var messages;
var users;

getMessages();
getUsers();

app.use(express.static('public'));

app.get('/hola', (req, res)=>{
	return res.status(200).send('La ruta funciona');
});

io.on('connection', (socket)=>{
	console.log('Alguien se ha conectado');
	getMessages();
	getUsers();
	io.sockets.emit('messages', messages);
	io.sockets.emit('users', users);
	//console.log(messages);

	// Recibir y Guardar en la Base de Datos
	socket.on('new-message', (data)=>{
		var message = new Message();
		message.text = data.text;
		message.author = data.author;			

		message.save((err, messageStored)=>{
			if(err){
				console.log('error al guardar')
			}
			else{
				messages.push(messageStored);
				getMessages();
				//guardo los mensajes para porde enviarlos
				//sacar los usuarios
				var usuarios=[];
				//Sacar todos los usuarios de messages
				for (var i=0; i < messages.length; i++){
					usuarios.push(messages[i].author);
				}
				//console.log( usuarios);
				 // Obtener los usuarios y eliminar los repetidos

				Array.prototype.unique=function(a){
				  return function(){return this.filter(a)}}(function(a,b,c){return c.indexOf(a,b+1)<0
				});
				var userx = usuarios.unique();
					
				users = userx;
				//console.log(users);
				io.sockets.emit('messages', messages);
				io.sockets.emit('users', users);
			}
		});
	});

	socket.on('delete-message', (data)=>{
		var messageId = data._id;

		Message.findByIdAndRemove(messageId, (err, messageRemoved)=>{
			if(err){
				console.log(err);
			}else{
				console.log(messageRemoved);	
				getMessages();
				getUsers();
				io.sockets.emit('users', users);
				io.sockets.emit('messages', messages);
			}
		});
		
		// console.log(messages);
	});

});

// Imprimir los elementos

function getMessages(){

	Message.find({},(err, messageStored)=>{
		if (err) {
			console.log(err);
		}else{
			//guardo los mensajes para porde enviarlos
			messages = messageStored;
		}
	});
}

function getUsers(){
	Message.find({},(err, messageStored)=>{
		if (err) {
			console.log(err);
		}else{
			//guardo los mensajes para porde enviarlos
			messages = messageStored;
			//sacar los usuarios
			var usuarios=[];
			//Sacar todos los usuarios de messages
			for (var i=0; i < messages.length; i++){
				usuarios.push(messages[i].author);
			}
			 // Obtener los usuarios y eliminar los repetidos

			Array.prototype.unique=function(a){
			  return function(){return this.filter(a)}}(function(a,b,c){return c.indexOf(a,b+1)<0
			});
			  var userx = usuarios.unique();
				//console.log( usuarios);
			 users = userx;
			//console.log(users);
		}

	});
}

// Servidor

mongoose.connect('mongodb://localhost:27017/chat', (err, res)=>{
	if (err) {
		throw err;
	}else{
		console.log("Base de datos funcionando correctamente");
		server.listen(3000, ()=>{
			console.log(`Servidor corriendo`);
		});
	}
});

