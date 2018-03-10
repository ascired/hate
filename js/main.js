(function() {
	var requestAnimationFrame = 
	window.requestAnimationFrame || 
	window.mozRequestAnimationFrame ||
	window.webkitRequestAnimationFrame || 
	window.msRequestAnimationFrame;

	window.requestAnimationFrame = requestAnimationFrame;

    function closest(el, selector) {
    	const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;

    	while (el) {
    		if (matchesSelector.call(el, selector)) {
    			return el;
    		} else {
    			el = el.parentElement;
    		}
    	}
    	return null;
    }

    var bodyElement = document.querySelector('.js-body');
    var wheelTiks = 1;
    var upTiks = wheelTiks;
    var downTiks = wheelTiks;

    var tilesWrap = document.querySelector('.js-slide-tiles');
    var tileWidth = 15;
    var tilesWrapWidth = window.outerWidth >= 750 ? window.outerWidth : 750;
    var tilesNumber = Math.ceil(tilesWrapWidth / tileWidth);

    var animationInProgress = false;

    function scrollInDirection(delta) {
        if (!animationInProgress) {
            if (delta < 0) {
                console.log("DOWN");
                downTiks = downTiks - 1;
                upTiks = wheelTiks;
                if (downTiks <= 0) {
                    if (!bodyElement.classList.contains('scroll-step-1')) {
                        requestAnimationFrame(function() {
                            fadeInTiles();
                            downTiks = wheelTiks;
                        });
                    }
                }
            } else if (delta > 0) {
                upTiks = upTiks - 1;
                downTiks = wheelTiks;
                if (upTiks <= 0) {
                    if (bodyElement.classList.contains('scroll-reverse')) {
                        requestAnimationFrame(function() {
                            fadeOutTiles();
                            upTiks = wheelTiks;
                        });
                    }
                }
            }
        }
    }

    function createTiles() {
        var tile = document.querySelector('.js-tile');
        for (var i = 1; i <= tilesNumber; i++) {
            var cl = tile.cloneNode(true);
            tilesWrap.appendChild(cl);
        }
        var tiles = document.querySelectorAll('.js-tile');
        tiles.forEach(function(elem, i) {
            elem.style.width = tileWidth + 'px';
            elem.style.left = i * tileWidth + 'px';
        });
    }

    function fadeInTiles() {
        animationInProgress = true;
        bodyElement.classList.add('scroll-step-1');
        var tiles = document.querySelectorAll('.js-tile');
        tiles.forEach(function(elem, i) {
            var e = .3 * Math.random();
            var t = .8 * Math.random();
            TweenLite.to(elem, e, {
                top: '0',
                delay: t,
                onComplete: function() {
                    if (i === tiles.length - 1) {
                        setTimeout(function() {
                            bodyElement.classList.remove('scroll-off');
                            bodyElement.classList.add('scroll-reverse');
                            animationInProgress = false;
                        }, 500);
                    }
                }
            });
        })
    }

    function fadeOutTiles() {
        animationInProgress = true;
        bodyElement.classList.remove('scroll-step-1');
        var tiles = document.querySelectorAll('.js-tile');
        tiles.forEach(function(elem, i) {
            elem.style.width = tileWidth + 'px';
            elem.style.left = i * tileWidth + 'px';
            var e = .3 * Math.random();
            var t = .8 * Math.random();
            TweenLite.to(elem, e, {
                top: '100%',
                delay: t,
                onComplete: function() {
                    if (i === tiles.length - 1) {
                        setTimeout(function() {
                            bodyElement.classList.remove('scroll-reverse');
                            bodyElement.classList.add('scroll-off');
                            animationInProgress = false;
                        }, 500);
                    }
                }
            });
        })
    }

    function touchWheelEvent(event) {
        var delta;

        if (event.wheelDelta){
            delta = event.wheelDelta;
        } else {
            delta = -1 * event.deltaY;
        }

        scrollInDirection(delta);
    }

    var ts;
    function touchStartEvent(event) {
        ts = event.touches[0].clientY;
    }
    function touchEndEvent(event) {
        var delta;
        var te = event.changedTouches[0].clientY;

        if (ts > te + 5) {
            delta = -1;
        } else if (ts < te - 5) {
            delta = 1;
        }
        
        scrollInDirection(delta);
    }
    var tm = 0;
     function touchMoveEvent() {
        var delta;
        var te = event.changedTouches[0].clientY;

        if (tm > te + 5) {
            delta = -1;
        } else if (tm < te - 5) {
            delta = 1;
        }
        
        scrollInDirection(delta);
     }

    function scrollEvent(event) {
        var ot = window.pageYOffset;
        var elemOffsetTop = document.querySelector('.js-slide-second').offsetTop;
        if (ot !== 0) {
            bodyElement.classList.remove('scroll-reverse');
        } else {
            bodyElement.classList.add('scroll-reverse');
        }
        if (animationInProgress) {
            event.preventDefault();
        }
    }

    function slideDown() {
        scrollInDirection(-1);
    }

    window.onload = function() {
        window.scrollTop = 0;
        bodyElement.classList.add('scroll-off');
        createTiles();

        var scrollDown = document.querySelector('.js-scroll-down');

        setTimeout(function() {
            window.addEventListener('wheel', touchWheelEvent);
            window.addEventListener('touchstart', touchStartEvent);
            window.addEventListener('touchend', touchEndEvent);
            window.addEventListener('touchmove', touchMoveEvent);
            window.addEventListener('scroll', scrollEvent);
            scrollDown.addEventListener('click', slideDown);
        }, 500);
    }


    // var popupOverlay = document.querySelector('.js-popup-holder');
    // popupOverlay.addEventListener("click", function(e) {
    // 	var target = closest(e.target, '.popup');
    // 	if (!target) {
    // 		popupOverlay.classList.remove('popup-visible');
    // 	}
    // });

})();