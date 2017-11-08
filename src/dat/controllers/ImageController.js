import SuperGif from 'wsgif';
import Controller from './Controller';
import dom from '../dom/dom';
import getUserMedia from '../utils/getUserMedia';

class ImageController extends Controller {
  constructor(object, property, opts) {
    super(object, property);

    const defaultOptions = opts;

    this.__controlContainer = document.createElement('div');
    dom.addClass(this.__controlContainer, 'image-picker');
    this.__swatches = this.__controlContainer.appendChild(document.createElement('div'));
    dom.addClass(this.__swatches, 'image-swatches');

    this.__img = this.__controlContainer.appendChild(document.createElement('img'));
    this.__img.crossOrigin = 'anonymous';

    this.__video = this.__controlContainer.appendChild(document.createElement('video'));
    this.__input = this.__controlContainer.appendChild(document.createElement('input'));

    if (getUserMedia) {
      this.__camera = this.__swatches.appendChild(document.createElement('div'));
      this.__camera.innerHTML = '&nbsp';
      dom.addClass(this.__camera, 'camera-button swatch');
    }
    this.__plus = this.__swatches.appendChild(document.createElement('div'));
    dom.addClass(this.__plus, 'new-image-button swatch');
    this.__plus.innerHTML = '&nbsp';

    defaultOptions.forEach((option) => {
      this.addSwatch(option.src, option.videoSrc);
    });

    this.__video.className = this.__img.className = 'content';
    this.__video.crossOrigin = 'anonymous';
    // should this be //webkit-playsinline?
    // as of iOS10 you don't need the prefix
    this.__video.setAttribute('playsinline', true);
    this.__input.type = 'file';

    this.__glGif = new SuperGif({ gif: this.__img });

    this.initializeValue();

    dom.bind(this.__camera, 'click', onCameraClick);
    dom.bind(this.__plus, 'click', chooseImage);
    dom.bind(this.__input, 'change', inputChange);

    dom.bind(this.__img, 'dragover', onDragOver);
    dom.bind(this.__img, 'dragleave', onDragLeave);
    dom.bind(this.__img, 'drop', onDrop);
    dom.bind(this.__video, 'dragover', onDragOver);
    dom.bind(this.__video, 'dragleave', onDragLeave);
    dom.bind(this.__video, 'drop', onDrop);

    function chooseImage() {
      this.__input.click();
    }

    function inputChange(e) {
      const file = e.target.files[0];
      file.isSaved = false;
      this.parseFile(file);
    }

    function onDragOver(e) {
      e.preventDefault();
      e.target.classList.add('dragover');
    }

    function onDragLeave(e) {
      e.target.classList.remove('dragover');
    }

    function onDrop(e) {
      e.target.classList.remove('dragover');
      const file = e.originalEvent.dataTransfer.files[0];
      file.isSaved = false;
      this.parseFile(file);
    }

    function onCameraClick() {
      getUserMedia({ video: true }, videoStarted, videoError);
    }

    function videoStarted(localMediaStream) {
      this.setValue({
        type: 'video',
        value: URL.createObjectURL(localMediaStream),
        domElement: this.__video
      });
    }

    function videoError(error) {
      console.log(error); // eslint-disable-line
    }

    // at the end
    this.domElement.appendChild(this.__controlContainer);
  }

  initializeValue() {
    const asset = this.getValue();
    const isAnimated = asset.url.split('.').pop() === 'gif';
    if (asset.type === 'image' && isAnimated) {
      this.setValue({
        url: asset.url,
        type: asset.type,
        domElement: this.__glGif.get_canvas()
      });
    } else if (asset.type === 'image' && !isAnimated) {
      this.setValue({
        url: asset.url,
        type: asset.type,
        domElement: this.__img
      });
    } else if (asset.type === 'video') {
      this.setValue({
        url: asset.url,
        type: asset.type,
        domElement: this.__video
      });
    }
  }

  updateDisplay() {
    const asset = this.getValue();
    if (asset.type === 'image') {
      const isAnimated = asset.url.split('.').pop() === 'gif';
      this.setImage(asset.url, isAnimated);
    } else if (asset.type === 'video') {
      this.setVideo(asset.url);
    }
  }

  parseFile(file) {
    // is there a better way to get the mime type?
    const type = file.type.split('/')[0];
    if (this.__glGif) this._glGif.pause();
    if (type === 'image') {
      const url = file.urlOverride || URL.createObjectUrl(file);
      const isAnimated = file.type.split('/')[1] === 'gif' || file.animatedOverride;
      this.setValue({
        url: url,
        type: 'image',
        domElement: isAnimated ? this.__glGif.get_canvas() : this.__img
      });
      this.setImage(url, isAnimated);
    } else if (type === 'video') {
      this.setValue({
        url: url,
        type: 'video',
        domElement: this.__video
      });
      this.setVideo(URL.createObjectUrl(file));
    }
  }

  setImage(url, isAnimated) {
    this.__isVideo = false;
    this.__isAnimated = isAnimated;
    this.__img.src = url;
    this.__video.style.display = 'none';
    this.__video.src = '';
    this.__img.style.display = 'block';
    if (this.__isAnimated) {
      this.__glGif.load((err) => {
        if (!err) {
          this._glGif.play();
        }
      });
    }
  }

  setVideo(url) {
    this.__isVideo = true;
    this.__isAnimated = true;
    this.__video.src = url;
    this.__video.play();
    this.__video.loop = true;
    this.__video.volume = 0;
    this.__img.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=';
    this.__img.style.display = 'none';
    this.__video.style.display = 'block';
  }

  addSwatch(src, videoSrc) {
    const swatch = this.__swatches.appendChild(document.createElement('img'));
    swatch.src = src;
    swatch.videoSrc = videoSrc;
    swatch.className = 'swatch';

    dom.bind(swatch, 'click', () => {
      if (videoSrc) {
        this.setValue({
          url: videoSrc,
          type: 'video',
          domElement: this.__video
        });
        this.setVideo(videoSrc);
      } else {
        const isAnimated = src.split('.').pop() === 'gif';
        if (isAnimated) {
          this.setValue({
            url: src,
            type: 'image',
            domElement: this.__glGif.get_canvas()
          });
        } else {
          this.setValue({
            url: src,
            type: 'image',
            domElement: this.__img
          });
        }
      }
    });
  }
}

export default ImageController;
