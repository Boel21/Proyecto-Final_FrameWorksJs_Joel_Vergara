var contador = 0;
var controlT = 0;
var puntos = 0;
var play = 0;
var min=2;
var seg=0;
var tiempo = 0;
var reiniciando = 0;
var contador_Movimiento = 0;
var encontrado_vertical = 0;
var encontrado_horizontal = 0;
var control_refil = 0;
var x1,x2,y1,y2

//----------Función Inicio/Reinicio---------------------------------------------
$(function(){
  $('.btn-reinicio').click(function inicio() {
    $('.btn-reinicio').text('Reiniciar');
    $(".panel-score").css("width","25%");
	  $(".panel-tablero").show();
	  $(".time").show();
    $("#score-text").html("0");
	  $("#movimientos-text").html("0")
    clearInterval(play);
    setInterval(function(){iluminar_titulo($('.main-titulo'))},1000);
    clearInterval(tiempo);
    borrar_partida();
      min=2;
	    seg=0;
    tiempo = setInterval(function(){timer()},1000);
    setTimeout(function(){start_dulces()},300);
    play = setInterval(function(){playTheGame()},600);
  });
});
//----------Función para efectos en el logo Match Game--------------------------
function iluminar_titulo(titulo){
  $(titulo).animate(
    {
      color: '#F7F8E0'
    },100,)
  $(titulo).animate(
    {
      color: '#DCFF0E'
    },100,)
};
//----------Función para llenar la matriz de dulces-----------------------------
function start_dulces(){
    control_refil = 0;
    for (var x = 1; x <= 7; x++) {
      var a = getRandomInt(1,5);
      $('.col-'+ x).prepend('<img class="elemento" src="image/'+a+'.png" />').css("justify-content","flex-start");
      $(".elemento").draggable();
      if (x === 7) {
        timer_refil(contador);
      }
    }
    contador++;
    if (contador == 7) {
      reiniciando = 0;
      setTimeout(function(){matched(reiniciando)},600);
    }
};
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  };
  function timer_refil(contador){
  setTimeout(function(){
    if (contador < 5) {
      return start_dulces();
    }
  },250);
};
//-----------------------Cronometro---------------------------------------------
function timer(){
	if(seg!=0){
		seg=seg-1;}
	if(seg==0){
		if(min==0){
			clearInterval(play);
			clearInterval(tiempo);
			$(".panel-tablero").hide("drop","slow",time_Up);
			$(".time").hide();}
		seg=59;
		min=min-1;}
	$("#timer").html("0"+min+":"+seg);
};
//----------------------Play the Game-------------------------------------------
function playTheGame(){
	$(".elemento").draggable();
  var mover = $('.panel-tablero').find('img');
    mover.each(function(){
      $(this).draggable({
      containment: '.panel-tablero',
      revert: 'true',
      disabled:false,
      revertDuration:0,
      snap:'.elemento',
      snapMode:'inner',
      snapTolerance:20,
      start:function(event,ui){
        var verificador = 1
        coordenadas(this,verificador);
        contador_Movimiento = contador_Movimiento + 1;
        $("#movimientos-text").html(contador_Movimiento);},
      })
});
  var catchAll = $('.panel-tablero').find('img');
    catchAll.each(function() {
      $(this).droppable({
        drop:function(event,ui){
          var dulce_arrastrado=ui.draggable;
          var dulce_receptor=this;
          var verificador = 2
          coordenadas(this,verificador);
          intercambiar_dulces(dulce_arrastrado,dulce_receptor);
          controlT = 0
          controlQ = 0
        },
      })
    });
};
//----------Función para borrar-------------------------------------------------
function borrar_partida() {
  for (var i = 1; i < 8; i++) {
    $('.col-'+i).empty();
    }
  contID = 1;
  controlT = 0;
  contador = 0;
  control_refil = 0;
  encontrado_vertical = 0;
  encontrado_horizontal = 0;
  reiniciando = 1;
};
//----------Función para la busqueda vertical de dulces-------------------------
function buscar_Dulces_vertical(){
  $(".elemento").draggable({disabled:true});
  for (var i = 1; i <= 7 ; i++) {
    for (var x = 0; x <= 48; x++) {
      var a = $(".col-"+i+" :eq("+x+")");
      var b = $(".col-"+i+" :eq("+(x+1)+")");
      var c = $(".col-"+i+" :eq("+(x+2)+")");
      if((($(a).attr('src')) == ( $(b).attr('src'))) && (( $(b).attr('src')) == ( $(c).attr('src')))) {
        $(a).attr('class','elemento selected');
        $(b).attr('class','elemento selected');
        $(c).attr('class','elemento selected');
        encontrado_vertical = 1;
      }
    }
  }
};
//----------Función para la busqueda horizontal de dulces-----------------------
function seleccionar_horizontal(){
  $(".elemento").draggable({disabled:true});
  for (var i = 1; i <= 7 ; i++) {
    for (var x = 0; x <= 48; x++) {
      var a = $(".col-"+i+" :eq("+x+")");
      var b = $(".col-"+(i+1)+" :eq("+(x)+")");
      var c = $(".col-"+(i+2)+" :eq("+(x)+")");
      if((($(a).attr('src')) == ( $(b).attr('src'))) && (( $(b).attr('src')) == ( $(c).attr('src')))) {
        $(a).attr('class','elemento selected');
        $(b).attr('class','elemento selected');
        $(c).attr('class','elemento selected');
        encontrado_horizontal = 1;
      }
    }
  }
};
//-----------------Funcion para obtener coordenadas de los dulces---------------
function coordenadas(element,verificador) {
    element = $(element);
    var top = element.position().top;
    var left = element.position().left;
    if (verificador == 1) {
      y1 = top
      x1 = left
    }
    if (verificador == 2) {
      y2 = top
      x2 = left
    }
};
//-----------------Funcion para intercambiar dulces-----------------------------
function intercambiar_dulces(dulce_arrastrado,dulce_receptor){
  var arrastrado = $(dulce_arrastrado).attr('src');
  var receptor = $(dulce_receptor).attr('src');
  $(dulce_arrastrado).attr('src',receptor).offset({top:y1,left:x1});
  $(dulce_receptor).attr('src',arrastrado).offset({top:y2,left:x2});
};
//----------------Funcion ganadora----------------------------------------------
function matched(){
  if (reiniciando == 0) {
  clearInterval(play);
  buscar_Dulces_vertical();
  seleccionar_horizontal();
  if (encontrado_horizontal == 1|| encontrado_vertical ==1){
    puntos += $('.selected').length;
    $('#score-text').text(puntos);
    $(".elemento").draggable({disabled:true});
    for (var i = 0; i <= 5; i++) {
      $(".selected").fadeTo(100, .1)
                    .fadeTo(100, 1)
                    setTimeout(function(){
                      $('.selected').remove('img');
                    },900);
    }
    control_refil =1;
    setTimeout(function(){refil_dulces(control_refil)},1000)
  }
    play = setInterval(function(){playTheGame()},300);
  }
};
//------------------Funcion para rellenar dulces eliminados---------------------
function refil_dulces(){
  if(control_refil == 1) {
    for (var x = 1; x <=7; x++) {
        var p = ($('.col-'+x+'> img').length);
        if (p != 7 ) {
          for (var i = 1; i <= 7-p;i++) {
            var a = getRandomInt(1,5);
            $('.col-'+x).prepend('<img class="elemento" src="image/'+a+'.png" />').css("justify-content","flex-start");
            $(".elemento").draggable();
            }
          }
      }
    }
  setTimeout(function(){matched()},1000);
};

//-----------------Time_Up------------------------------------------------------
function time_Up(){
	$( ".panel-score" ).animate({width:'100%'},3000);
	$(".termino").css({"display":"block","text-align":"center"});
};
