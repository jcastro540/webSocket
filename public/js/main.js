$(document).ready(function(){

	var api = "6a9106d88c445b26b4f1a0d2d6b6a2a9";
	
	$('#buscar').click(function(){
		$('#fila').html("");

		var idioma = $('#idioma').val();
		var url = 'https://api.themoviedb.org/3/tv/popular?api_key='+api+'&'+'language='+idioma+'&'+'page=1';

		console.log(url);

		$.ajax({
			url: url,
			dataType: "json",
			beforeSend: function(){
				$('#loader').css('visibility','visible');
			},
			complete: function(){
				$('#loader').css('visibility','hidden');
			},
			type: "GET"
		})
		.done(function(response){
			console.log(response);

			for(i in response.results){
				var template = `
					<article class="col-md-4">
						<div class="box">
							<header class="encabezado" style="background-image: url(https://image.tmdb.org/t/p/w500${response.results[i].poster_path});">
								<div class="titulo">
									<h3>${response.results[i].name}</h3>
								</div>
							</header>
							
							<div class="content">
								<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
								  <div class="panel panel-default">
								    <div class="panel-heading" role="tab" id="headingOne">
								      <h4 class="panel-title">
								        <a role="button" data-toggle="collapse" data-parent="#accordion" href="#${response.results[i].id}" aria-expanded="true" aria-controls="collapseOne">
								          Reseña
								        </a>
								      </h4>
								    </div>
								    <div id="${response.results[i].id}" class="panel-collapse collapse " role="tabpanel" aria-labelledby="headingOne">
								      <div class="panel-body">
								        ${response.results[i].overview}
								      </div>
								    </div>
								  </div>						  
							</div>
							
							<div class="body-box">
								<h4><b>Nombre Original:</b> ${response.results[i].original_name}</h4>
								<h4><b>Fecha de Lanzamiento:</b> ${response.results[i].first_air_date}</h4>
								<h4><b>Idioma Original:</b> ${response.results[i].original_language}</h4>
								<h4><i class="fa fa-thumbs-o-up"></i> ${response.results[i].vote_count}</h4>
							</div>					

						</div>
					</article>

				`;

				$("#fila").append(template);

			}

		});

	});



});