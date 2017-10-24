/*  Snowfall jquery plugin 
	version 1.2, Dec 20 2009
	Developed by Jason Brown for any bugs or questions email me at loktar69@hotmail
	info on the plugin is located on Somethinghitme.com
	
	values for snow options are
	
	flakeCount,
	flakeColor,
	flakeIndex,
	minSize,
	maxSize,
	minSpeed,
	maxSpeed
	
	Example Usage :
	$(document).snowfall({flakeCount : 100, maxSpeed : 10});
	
	-or-
	
	$('#element').snowfall({flakeCount : 800, maxSpeed : 5, maxSize : 5});
	
	-or with defaults-
	
	$(document).snowfall();
*/

var TimeCounter = 0;

(function($) {
	$.fn.snowfall = function(options) {
		
        var element = this;

        var random = function random(min, max) {
			 return Math.round(min + Math.random() * (max - min));
		};
		
		
		var flakes = [],
			flakeId = 0,
			i = 0,
			elHeight = $(element).height(), 
			elWidth = $(element).width(),
			defaults = {
				flakeCount: 50, // 数
				flakeIndex: 6, // スタイルシートのz-indexの値
				maxSpeed: 30, // 最大速度
				minSpeed: 10, // 最小速度
				maxSpeed02: 8, // 最大速度
				minSpeed02: 5, // 最小速度
				maxSize: 60, // 最大サイズ
				minSize: 20, // 最小サイズ
				maxSize02: 10, // 最大サイズ
				minSize02: 10, // 最小サイズ
				image: [
					'./images/flower01_off.png',
					'./images/flower02_off.png',
					'./images/flower03_off.png'
				]
			},
			options = $.extend(defaults, options);	


       
		function randArray(_str) {
		
            var i = _str.length;
			
			while (i) {
				//Math.floor　＝ 切り捨て
				//y　＝ i のランダム値の整数
				var y = Math.floor(Math.random() * i);
				var t = _str[--i];
				_str[i] = _str[y];
				_str[y] = t;
			}
			return _str;
        }
		
		
      // snow flake class
        function Flake(_x, _y, _size, _speed) {
            // Flake properties
            this.id = flakeId;
            //this.x  = _x -_x/2;
            this.x = _x;
            this.y = _y;
            this.size = _size;
            this.speed = _speed;
            this.step = 0,
            this.stepSize = random(1, 10) / 100;

            //original
            //var flakeMarkup = "<div id='flake-" + this.id + "' style='width: " + this.size + "px; height: " + this.size + "px; background: " + options.flakeColor + "; position: absolute; top: " + this.y + "px; left:" + this.x + "px; font-size: 0px; z-index: " + options.flakeIndex + ";'></div>";

           
            var angle = Math.round(Math.random() * 360);
			//マークアップ
            var flakeMarkup = "<img src='" + randArray(options.image)[0] + "' id='flake-" + this.id;
            flakeMarkup += "' style='width: " + this.size + "px; height: " + this.size + "px;";
            flakeMarkup += "; position: absolute; top: " + this.y + "px; left:" + this.x + "px; font-size: 0px; z-index: " + options.flakeIndex;

            // CSS 3
            flakeMarkup += "; -moz-transform:rotate(" + angle + "deg);";
            flakeMarkup += "-webkit-transform:rotate(" + angle + "deg);";
            flakeMarkup += "transform:rotate(" + angle + "deg);";
            flakeMarkup += "' />";
            //
			
            if ($(element).get(0).tagName === $(document).get(0).tagName) {
                $('body').append(flakeMarkup);
            } else {
                $(element).append(flakeMarkup);
            }
			
            this.element = document.getElementById('flake-' + this.id);
			
			this.update = function() {
				
                this.y += this.speed;
			
                if (this.y > (elHeight) - 20) {
                    this.reset();
                }

                this.element.style.top = ($('#container').height()) - this.y + 'px';
                this.element.style.left = this.x + 'px';

                this.step += this.stepSize;
                this.x += Math.cos(this.step);
                
                this.x += this.speed;
				
                if(this.x > (elWidth) + 22 ){//|| this.x < 22 ){
                	this.reset();
                }

				//
				TimeCounter ++;
		

            };
			
			
            this.reset = function() {
				//yは0に戻す
				this.y = 100;
				this.x = random(-1500, elWidth);
				this.stepSize = random(1, 10) / 100;
				this.size = random((options.minSize02 * 100), (options.maxSize02 * 100)) / 100;
				this.speed = random(options.minSpeed, options.maxSpeed);
				
				
				if( TimeCounter >= 1000 * 3 ){
					
					this.y = 0;
					//this.y = $('#container').height() - $(window).height();
					//
					this.stepSize	=	0;
					this.size = random((options.minSize02 * 100), (options.maxSize02 * 100)) / 100;
					this.speed =  random(options.minSpeed02, options.maxSpeed02);	
					//this.size		=	10;
					//this.speed		=	5;
					$(this.element).fadeTo(0, 0);
								
				}
			};
		}
		

        $(window).bind("resize", function() {
            elHeight = $(element).height();
            elWidth = $(element).width();
        });


   
        for (i = 0; i < options.flakeCount; i += 1) {
            flakeId = i;
            flakes[i] = new Flake(random(-500, elWidth), random(0, elHeight), random((options.minSize * 100), (options.maxSize * 100)) / 100, random(options.minSpeed, options.maxSpeed));
        }
		
        // this controls flow of the updating snow
        function snow() {
			for (i = 0; i < options.flakeCount; i += 1) {
                flakes[i].update();
            }
			//30おきに更新
			setTimeout(function() {
				snow();
			}, 30);
		}
	snow();	
	
	};			
})(jQuery);

$(window).load(function() {
	$('#container').snowfall();
});

