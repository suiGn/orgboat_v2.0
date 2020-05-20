// JavaScript Document



$(document).ready(function(){
	
	$(window).resize(changeSize.init);
	$(window).load(changeSize.init);


	
 	function initSlider() {
	
	$('#layerslider').layerSlider({
					skinsPath : 'skins/',
					skin : 'fullwidth',
					thumbnailNavigation : 'hover',
					hoverPrevNext : false,
					responsive : false,
					responsiveUnder : 1200,
					sublayerContainer : 1000,
					autoStart : true,
					pauseOnHover : false,
					firstLayer : 1,
					animateFirstLayer : true,
				});
	}			


// Plugin que calcula el offset top de los elementos para poder animarlos al hacer scroll
     var wpOffset = 85;
     if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
        wpOffset = 100;
     }
     $.fn.waypoint.defaults = {
        context: window,
        continuous: true,
        enabled: true,
        horizontal: false,
        offset: 0,
        triggerOnce: false
     };
     $('.animated').waypoint(function(direction) {
        var elem = $(this);
        var animation = elem.data('animation');
        if ( !elem.hasClass('visible') ) {
            if ( elem.attr('data-animation-delay') !== undefined ) {
                var timeout = elem.data('animation-delay');

                setTimeout(function(){
                    elem.addClass( animation + " visible" );
                }, timeout);
            } else {
                elem.addClass( elem.data('animation') + " visible" );
            }
        }
     }, { offset: wpOffset+'%' });
	 
	 
	 
	 
	 });
	 
	 
	 // Funcion para arregar el alto de las imagenes en el Onload y Resize
	 
	 	
		var changeSize = {
			init:function() {
				
				
		var $window = $(window);

	
	
			if ($window.scrollTop() > 10) {
				
			$('#layerslider').removeClass('topload')	
			}
		  
		 		
			
		var anchoScreen = ($(window).width())/2;
		
		var anchoCirculo = $('.circle_down').width()/2;
		var ResultadoAncho =  anchoScreen -  anchoCirculo ;
		$('.circle_down').css({left:Math.round(ResultadoAncho)});
		
		
		var WindowHeight = $(window).height();
		
		
		$('#layerslider').height(WindowHeight)
		
		var WindowHeightDiv = $(window).height()/2;
		var anchoImg_1 =  $('.contImg1 > img').width()/2;
		var anchoImg_2 =  $('.contImg2 > img').width()/2;
		var anchoImg_3 =  $('.contImg3 > img').width()/2;
		var anchoImg_4 =  $('.contImg4 > img').width()/2;
		var anchoImg_5 =  $('.contImg5 > img').width()/2;
		
		
			
		$('.ls-bg').height(WindowHeight);
	
		// Igualo la altura del contenedor de las imagenes de cada feature con la imagen mas grande del contenedor para mantener espacio
		
		if ( $(window).width() >  1000  ) {
		var altoImagenThird = $('.contanimations_third img.baseheigh').height();
		$('.contanimations_third').height(altoImagenThird);
		
		}else {
		
		var altoImagenThird2 = $('.contanimations_third img.baseheightwo').height();
		$('.contanimations_third').height(altoImagenThird2);
		}
		
		if ( $(window).width() <  1511  ) {
		
		var altoImagen = $('.contanimations img.img-responsive').height();
		$('.contanimations').height(altoImagen);
		
		var altoImagenSecond = $('.contanimations_second img.baseheighstaff').height();
		$('.contanimations_second').height(altoImagenSecond);
		
		
		
		var altoImagenFourth = $('.contanimations_fourth img.img-responsive').height();
		$('.contanimations_fourth').height(altoImagenFourth);
		
		
		var altoImagenFive = $('.contanimations_five img.img-responsive').height();
		$('.contanimations_five').height(altoImagenFive);
		
		
		}
		
		
		
	// Hago aparecer los elemetos que se animan cuando hago scroll de pantalla
	
	
	$('#mesure').waypoint(function() {
		excLight();
	}, { offset:200 });
	
	
		$('.rotated').waypoint(function() {
		 TweenLite.to($('.rotated '), 0.5, {css:{opacity:1}, ease:Power1.easeIn})
	}, { offset:280 });
	
	
		$('.rotated').waypoint(function() {
		 TweenLite.to($('.rotated '), 0.5, {css:{opacity:1}, ease:Power1.easeOut})
	}, { offset:320 });
	
	
	
		$('.opacitylayer').waypoint(function() {
		 TweenLite.to($('.opacitylayer '), 0.5, {css:{visibility:'visible'}, ease:Power1.easeOut})
	}, { offset:280 });
	
		$('.opacitylayerfirst').waypoint(function() {
		 TweenLite.to($('.opacitylayerfirst '), 0.5, {css:{visibility:'visible'}, ease:Power1.easeOut})
	}, { offset:350 });
	
	
	
		
	
		function excLight() {
			
			var tl3 = new TimelineLite({delay:0.3,onComplete:myFunction});
		
				var anime9 = $('.light');
				function myFunction() {
					tl3.restart();
				}
				tl3.to(anime9, 1, {css:{opacity:1,},ease:Power2.easeIn});
				tl3.to(anime9, 1.6, {css:{opacity:0 },ease:Power2.easeIn});
				tl3.to(anime9, 1, {css:{opacity:1,},ease:Power2.easeIn});
				tl3.to(anime9, 1.6, {css:{opacity:0},ease:Power2.easeIn});
				tl3.to(anime9, 1, {css:{opacity:1},ease:Power2.easeIn});
				tl3.to(anime9, 1.6, {css:{opacity:0},ease:Power2.easeIn});
			
			}
		
				
		}};
		
		
				
		