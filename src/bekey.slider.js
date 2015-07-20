/**
 * Slider responsive jquery
 *
 * @version 1.0
 * @author Biquet <anthony.papillaud@gmail.com>
 * @url www.biquet.fr
 */

(function ($){

    $.fn.bekeySlider = function(options){

        options = $.extend({
        	effect    : 'slide',
        	direction : 'right',
        	startItem : 0,
        	pauseTime : 3000,
        	animSpeed : 1000
        }, options);

        var $this = $(this);

        var $Slider = $this;
		var $SliderItem = $Slider.find('.Slider-item');
		var $SliderItems = $Slider.find('.Slider-items');
		var $SliderDotNav = $Slider.find('.SliderDotNav');

		var numberItem = $SliderItem.length;
		var i = j = 0;
		var positionSlider1 = {};
		var positionSlider2 = {};
		var positionSliderInit = {};
		var authorizeDirection = ['up', 'down', 'right', 'left'];

		//options.startItem = options.startItem - 1;

		//Parametres pour initialiser le slider
		if( options.effect === 'fade' ){

			$SliderItem.each( function(){
				$(this).css('display', 'none');
			})
			$Slider.find('.Slider-item:eq(' + options.startItem + ')').css('display', 'block').addClass('current');

		}else if( options.effect === 'slide' ){
			
			//Test si le mouvement du slider existe
			if( $.inArray( options.direction, authorizeDirection ) === -1 ){
				options.direction = 'right';
			}
			positionSlider(options.direction);

			$SliderItem.each( function(){
				$(this).css(positionSlider2).width( $Slider.width() );
			});
			$( window ).resize(function() {
				$SliderItem.width( $Slider.width() );
			});

			$Slider.find('.Slider-item:eq(' + options.startItem + ')').css(positionSliderInit).addClass('current');
			
		}

		//Calcule la hauteur du slider au chargement, en fonction de la hauteur du premier item
		sizeSlider( $Slider, $('.Slider-item:eq(' + options.startItem + ')') );

		//Défilement automatique du slider
		var sliderInterval = setInterval(function(){
			sliderAutoAnimate();
		}, options.pauseTime);

		//Mets en place la navigation par points
		dotNav();

		//Option pause/play du slider au hover du conteneur 
		$(document).on('mouseenter', '.Slider', function(e) {
			clearInterval(sliderInterval);
		});
		$(document).on('mouseleave', '.Slider', function(e) {
			sliderInterval = setInterval(function(){ sliderAutoAnimate(); }, options.pauseTime)
		});

		//Arrow navigation
		$(document).on('click', '.Slider-nav', function(e){

			var $currentItem, $NextItem;
			//Next / Right
			if( $(this).attr('data-nav') === 'next' ){

				if( i >= numberItem){ i = 0; }
				j = i + parseInt(1);
				if( j >= numberItem){ j = 0; }

				$CurrentItem = $Slider.find('.Slider-item:eq(' + i + ')');
				$NextItem = $Slider.find('.Slider-item:eq(' + j + ')');

				
				//Affiche le point correspondant à l'item actif
				currentDotNav(j);

				if( options.effect === 'fade' ){
					//Animation fadeInOut
					fadeInOut( $Slider, $NextItem );
				}else if( options.effect === 'slide' ){
					//Animation slide
					directionclick = 'right';
					slide( directionclick, $Slider, $CurrentItem, $NextItem );
				}

				i++;

			//Previous / Left
			}else if( $(this).attr('data-nav') === 'previous' ){
				
				if( i <= -1){ i = numberItem  - 1; }
				j = i - 1;
				if( j <= -1){ j = numberItem -1; }

				$CurrentItem = $Slider.find('.Slider-item:eq(' + i + ')');
				$previousItem = $Slider.find('.Slider-item:eq(' + j + ')');

				//Affiche le point correspondant à l'item actif
				currentDotNav(j);

				if( options.effect === 'fade' ){
					//Animation fadeInOut
					fadeInOut( $Slider, $previousItem );
				}else if( options.effect === 'slide' ){
					//Animation slide
					directionclick = 'left';
					slide( directionclick, $Slider, $CurrentItem, $previousItem );
				}

				i--;
				
			}

		})

		function sliderAutoAnimate(){

			if( i >= numberItem){ i = 0; }
			j = i + parseInt(1);
			if(j >= numberItem){ j = 0; }
			k = i -1;
			if( k <= -1){ k = numberItem -1; }

			var $CurrentItem = $Slider.find('.Slider-item:eq(' + i + ')');
			var $NextItem = $Slider.find('.Slider-item:eq(' + j + ')');
			var $PreviousItem = $Slider.find('.Slider-item:eq(' + k + ')');
			
			//Affiche le point correspondant à l'item actif
			currentDotNav(j);

			//Redimensionne dynamiquement le hauteur du slider
			sizeSlider( $Slider, $('.Slider-item:eq(' + j + ')') );

			if( options.effect === 'fade' ){
				//Animation fadeInOut
				fadeInOut( $Slider, $NextItem );
			}else if( options.effect === 'slide' ){
				//Animation slide
				slide( options.direction, $Slider, $CurrentItem, $NextItem );
			}
			
			i++;

		};

		function sizeSlider(content, item){
			content.height( content.find(item).height() );
			$( window ).resize(function() {
				content.height( content.find(item).height() );

				//Suprimer les attributs quand le slider est redimensionné
				$SliderItems.removeAttr('style');

			})
		}

		function dotNav(){
			for (var k = 0; k<numberItem; k++) {
				$SliderDotNav.append('<li class="SliderDotNav-item"></li>');
			}

			$(document).on('click', '.SliderDotNav-item', function(e) {

				//identifie la position de l'item 'dotNav" sélectionné
				var indexItem = $('.SliderDotNav-item').index( this );
				var positionCurrentItem = i;

				if( $('.SliderDotNav-item:eq(' + indexItem + ')').hasClass('SliderDotNav-item--current') !== true ){

					i = indexItem;

					//Masque l'item en cours et affiche l'item correpondant à l'item "dotNav" sélectionné
					if( options.effect === 'fade' ){
						//Animation fadeInOut
						fadeInOut($Slider, $Slider.find('.Slider-item:eq(' + indexItem + ')'))
					}else if( options.effect === 'slide' ){

						if(positionCurrentItem < indexItem){
							direction = 'right';
						}else if(positionCurrentItem > indexItem){
							direction = 'left';
						}

						//Animation slide
						slide( direction, $Slider, $Slider.find('.current'), $Slider.find('.Slider-item:eq(' + indexItem + ')') );
					}

					//Affiche le point correspondant à l'item actif
					currentDotNav(indexItem);

				}				

			});
		}

		function currentDotNav(index){
			$('.SliderDotNav-item').removeClass('SliderDotNav-item--current')
			$('.SliderDotNav-item:eq(' + index + ')').addClass('SliderDotNav-item--current');
		}

		function fadeInOut(content, next){
			content.find('.current').removeClass('current').css({ 'z-index' : '9999' }).fadeOut(options.animSpeed);
			next.addClass('current').css('display', 'block').css({ 'z-index' : '0' });
		}

		function slide(directionSlide, content, current, next){

			//Surcharge le css du conteneur "items" et des "item" avec la largeur du conteneur "slider"
			$SliderItems.removeAttr('style');
			$SliderItems.width( content.width() * 2 );
			if(directionSlide == 'right'){
				$SliderItem.css({'left' : 'auto'});
				$SliderItems.css({'marginLeft' : '-' + content.width() + 'px'});
			}else if(directionSlide == 'left'){
				$SliderItem.css({'right' : 'auto'});
				$SliderItems.css({'marginRight' : '-' + content.width() + 'px'});
			}
			$SliderItem.width( content.width() );

			positionSlider(directionSlide);

			$( window ).resize(function() {

				//Surcharge egalement le css quand la taille du navigateur change
				$SliderItems.width( content.width() * 2 );
				if(directionSlide == 'right'){
					$SliderItems.css({'marginLeft' : '-' + content.width() + 'px'});
				}else if(directionSlide == 'left'){
					$SliderItems.css({'marginRight' : '-' + content.width() + 'px'});
				}
				//Réinitialise la position des "item" en position masqué
				//et en position visible pour l'item couarant avant le changement de taille
				positionSlider();
				$SliderItem.width( content.width() ).css( positionSlider2 );
				$Slider.find('.current').css( positionSliderInit );
				
			})

			$SliderItem.width( content.width() ).css( positionSlider2 );
			content.find('.current').css( positionSliderInit );

			//Masque l'item qui était courant puis réinitialise sa position et affiche l'item suivant
			current.animate( positionSlider1 ,1000 , function(){
				$(this).css( positionSlider2 ).removeClass('current')
			});
			next.addClass('current').css({ 'display' : 'block' }).animate( positionSliderInit ,1000);

		}

		//Déplacement et positionnement des items
		function positionSlider(direction){

			//Réinitialite les directions
			positionSlider1 = {};
			positionSlider2 = {};
			positionSliderInit = {};

			positionSlider1[direction] = $Slider.width() + 'px';
			positionSlider2[direction] = '-' + $Slider.width() + 'px';
			positionSliderInit[direction] = '0px';

		}

        
    };

})(jQuery);