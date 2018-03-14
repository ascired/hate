window.Hate = {};
Hate.device = (function() {
  return {
    touch: Modernizr.touchevents,
    wide: matchMedia("(min-width: 1024px)").matches
  }
})();
Hate.Loader = function(loader) {
  var _this = this,
    loader = document.querySelector(loader),
    area = loader.querySelector('.loader__area'),
    areaHeight = loader.offsetHeight,
    areaWidth = loader.offsetWidth,
    delay = Hate.device.wide ? 400 : 500;
  this.stepTranslate = 0;
  this.steps = 4;
  this.step = 1;
  this.stepWidth = Math.floor(Hate.device.wide ? window.innerWidth / 13 : areaWidth / (this.steps - 1));
  this.deg = function() {
    var hyp = Math.sqrt(Math.pow(areaHeight, 2) + Math.pow(_this.stepWidth, 2));
    return 180 - 90 - Math.asin(areaHeight / hyp) * 180 / 3.14;
  };
  this.start = function() {
    document.body.classList.add('preloading');
    if (_this.step < _this.steps) {
      var flag = (_this.step - 1) % 2;
      Hate.device.wide
        ? _this.stepTranslate += _this.stepWidth * (flag ? 4 : 2)
        : flag ? _this.stepTranslate += _this.stepWidth * 2 : null;
      var expr = 'skew(' + (flag ? -_this.deg() : _this.deg()) + 'deg) translate3d(' + _this.stepTranslate + 'px, 0, 0)';
      area.style.transform = expr;
      _this.step++;
      setTimeout(_this.start, delay);
    } else if (_this.step === _this.steps) {
      // pre finish
      area.classList.add('is-finished')
      area.style.transform = '';
      _this.step++;
      setTimeout(_this.start, delay);
    } else {
      _this.hide();
    }
  };
  this.hide = function() {
    loader.classList.add('is-hidden');
    document.body.classList.remove('preloading');
    return this;
  };
  this.reset = function() {
    _this.step = 1;
    _this.stepTranslate = 0;
    area.classList.remove('is-finished');
    loader.classList.remove('is-hidden');
    return this;
  };
};

Hate.loader = new Hate.Loader('.loader');
