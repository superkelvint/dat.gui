import NumberController from './NumberController';
import dom from '../dom/dom';

class NumberControllerAnimator extends NumberController {
  constructor(object, property, params) {
    super(object, property, params);

    const _this = this;

    dom.addClass(this.domElement, 'button-container');

    this.__animationMode = null;

    this.__sineButton = document.createElement('button');
    dom.addClass(this.__sineButton, 'sine-button');
    this.__sawButton = document.createElement('button');
    dom.addClass(this.__sawButton, 'saw-button');

    dom.bind(this.__sawButton, 'click', toggleSaw);
    dom.bind(this.__sineButton, 'click', toggleSine);

    function toggleSaw(e) {
      e.stopPropagation();
      e.preventDefault();
      if (_this.__animationMode === 'saw') {
        stopAnimating();
      } else {
        _this.__animationMode = 'saw';
        animate();
      }
    }

    function toggleSine(e) {
      e.stopPropagation();
      e.preventDefault();
      if (_this.__animationMode === 'sine') {
        stopAnimating();
      } else {
        _this.__animationMode = 'sine';
        animate();
      }
    }

    function animate() {
      if (_this.__animationMode === null) return;
      let percent;

      if (_this.__animationMode === 'sine') {
        percent = Math.sin(Date.now() / 1000) / 2 + 0.5;
      } else if (_this.__animationMode === 'saw') {
        percent = (Date.now() / 2000) % 1;
      }

      _this.setValue((_this.max - _this.min) * percent + _this.min);
      requestAnimationFrame(animate);
    }

    function stopAnimating() {
      _this.__animationMode = null;
    }

    this.updateDisplay();
    this.domElement.appendChild(this.__sawButton);
    this.domElement.appendChild(this.__sineButton);

  }
}

export default NumberControllerAnimator;
