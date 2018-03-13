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
            if (delta < 0) { //down
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
                    if (bodyElement.classList.contains('scroll-reverse', 'scroll-step-1')) {
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

        if (!bodyElement.classList.contains('side-visible')) {
            scrollInDirection(delta);
        }
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
        
        if (!bodyElement.classList.contains('side-visible')) {
            scrollInDirection(delta);
        }
    }

    var section = document.querySelectorAll(".js-scroll-spy");
    var sections = {};
    var i = 0;

    Array.prototype.forEach.call(section, function(e, i) {
        sections[i] = e.offsetTop;
    });

    function scrollEvent(event) {
        var ot = window.pageYOffset;
        var elem = document.querySelector('.js-slide-second');
        if (elem) {
            var elemOffsetTop = elem.offsetTop;
            if (ot !== 0) {
                bodyElement.classList.remove('scroll-reverse');
            } else if (bodyElement.classList.contains('scroll-step-1')) {
                bodyElement.classList.add('scroll-reverse');
            }
            if (animationInProgress || bodyElement.classList.contains('side-visible')) {
                event.preventDefault();
            }
        }

        var scrollPosition = window.scrollY + window.innerHeight * 2 / 3;

        for (i in sections) {
            if (sections[i] <= scrollPosition) {
                if (!section[i].classList.contains('in-view')) {
                    section[i].classList.add('in-view');
                }
            } else {
                section[i].classList.remove('in-view');
            }
        }
    }

    function slideDown(e) {
        e.preventDefault();
        if (!bodyElement.classList.contains('side-visible')) {
            scrollInDirection(-1);
        }
    }

    function showSidebar(e) {
        e.preventDefault();
        bodyElement.classList.add('side-visible');
        e.stopImmediatePropagation();
    }
    function hideSidebar(e) {
        e.preventDefault();
        bodyElement.classList.remove('side-visible');
    }



    window.onload = function() {
        if (document.querySelector('.loader')) {
            Hate.loader.start();
        }

        window.scrollTop = 0;

        var openSidebar = document.querySelector('.js-sidebar-open');
        var closeSidebar = document.querySelector('.js-sidebar-close');
        openSidebar.addEventListener('click', showSidebar);
        closeSidebar.addEventListener('click', hideSidebar);

        bodyElement.addEventListener('click', function(e) {
            if (this.classList.contains('side-visible')) {
                if (!closest(e.target, '.js-sidebar')) {
                    hideSidebar(e);
                }
            }
        });

        setTimeout(function() {
            window.addEventListener('scroll', scrollEvent);
        });

        if (!bodyElement.classList.contains('normal-scrolling')) {
            bodyElement.classList.add('scroll-off');
            var scrollDown = document.querySelector('.js-scroll-down');
            var tiles = document.querySelector('.js-slide-tiles');
            if (tiles) {
                createTiles();
            }
            setTimeout(function() {
                window.addEventListener('wheel', touchWheelEvent);
                window.addEventListener('touchstart', touchStartEvent);
                window.addEventListener('touchmove', touchEndEvent);

                if (scrollDown) {
                    scrollDown.addEventListener('click', slideDown);
                }
            }, 500);
        }


    }
    function n(t) {
        for (var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : document, i = e.querySelectorAll(t), n = 0; n < i.length; n++)
            s.push(i[n]);
        return i
    }
    function n(t) {
        return t * t * t
    }

    function r() {
        return {
            inSpeed: 300,
            outSpeed: 400,
            circle: null,
            path: null,
            totalLength: 565.486677646,
            isBig: !1,
            inHandle: null,
            inStart: null,
            inProgress: 0,
            outHandle: null,
            outStart: null,
            outProgress: 0,
            init: function(t) {
                var e = this;
                this.circle = t.querySelector('.js-ring'),
                this.path = t.querySelector('circle'),
                t.addEventListener("mouseenter", function() {
                    e.outHandle && cancelAnimationFrame(e.outHandle),
                    e.inHandle = requestAnimationFrame(function() {
                        return e.drawIn()
                    })
                }),
                t.addEventListener("mouseleave", function() {
                    e.inHandle && cancelAnimationFrame(e.inHandle),
                    e.outHandle = requestAnimationFrame(function() {
                        return e.drawOut()
                    })
                })
            },
            drawIn: function() {
                var t = this;
                this.inStart || (this.inStart = performance.now()),
                this.inProgress = (performance.now() - this.inStart) / this.inSpeed;
                var e = 0;
                return this.inProgress <= 1 && (e = n(1 - this.inProgress) * this.totalLength),
                this.path.style.strokeDashoffset = e,
                this.inProgress > .8 && !this.isBig && (this.isBig = !0,
                    this.circle.classList.add("state-big")),
                this.inProgress > 1 ? (this.inStart = null,
                    this.inProgress = 1,
                    void window.cancelAnimationFrame(this.inHandle)) : void (this.inHandle = requestAnimationFrame(function() {
                        return t.drawIn()
                    }))
                },
                drawOut: function() {
                    var t = this;
                    this.isBig && (this.isBig = !1,
                        this.circle.classList.remove("state-big")),
                    this.inStart = null,
                    this.outStart || (this.outStart = performance.now()),
                    this.outProgress = 1 - this.inProgress + (performance.now() - this.outStart) / this.outSpeed;
                    var e = this.totalLength;
                    return this.outProgress <= 1 && (e = n(this.outProgress) * this.totalLength),
                    this.path.style.strokeDashoffset = e,
                    this.outProgress > 1 ? (cancelAnimationFrame(this.outHandle),
                        void (this.outStart = null)) : void (this.outHandle = requestAnimationFrame(function() {
                            return t.drawOut()
                        }))
                    }
                }
            }

            var socialIcon = document.querySelectorAll('.js-social-icon');
            socialIcon.forEach(function(elem, i) {
                r().init(elem);
            });


    // var popupOverlay = document.querySelector('.js-popup-holder');
    // popupOverlay.addEventListener("click", function(e) {
    // 	var target = closest(e.target, '.popup');
    // 	if (!target) {
    // 		popupOverlay.classList.remove('popup-visible');
    // 	}
    // });

})();