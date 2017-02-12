// var socket = io.connect('http://localhost:3000/',{forceNew: true});
var socket = io.connect('http://192.168.1.104:3000/',{forceNew: true});
//Contenedor de usuarios;
//var users = [];
socket.on('messages',function(data){
  console.log(data);
  render(data);
  PlaySound();
})


socket.on('users',function(data){
	console.log(data);
	renderUsers(data);	 
});
// console.log('Hola');

function render(data){
  var html = data.map(function(elem,index){
    return (`<div class="media">
			  <div class="media-left alert-dismissable">			   
			     <img class="media-object" src="./img/cara.png" alt="..." style="width: 55px;height: auto;">
			  </div>
			  <div class="media-body">
			    <h4 class="media-heading">${elem.author}</h4>
			    <p>${elem.text}</p>
			    <a href="#" class="close" data-dismiss="alert" aria-label="close" data-value="${elem._id}">&times;</a>
			  </div>
			</div>
				`);
  }).join("");

  document.getElementById('messages').innerHTML = html;
}

// Recorro los usuarios y los imprimo  
function renderUsers(data){
  var html = data.map(function(elem,index){
    return (`
		<li class="list-group-item">${elem}</li>
    `);
  }).join("");

	document.getElementById('user').innerHTML = html;
}

function addMessage(e){
	paylod = {
		author: document.getElementById('username').value,
		text: document.getElementById('texto').value
	}

	$('#user').html("");
	//console.log(users);
	socket.emit('new-message', paylod);
	document.getElementById('texto').value="";

	return false;
}

$(document).on('click', ".close", function(e){	
	 paylod = {
			_id: $(this).attr('data-value')
	};
	//Los seteo a nada
	//users = [];
	$('#user').html("");
	socket.emit('delete-message', paylod);
});


function PlaySound() {
  var sound = document.getElementById("audio");
  sound.play()
}