(function () {
  document.addEventListener('DOMContentLoaded', init, false);
  var clearButton = document.getElementsByClassName('clear-btn')[0];
  var downloadButton = document.getElementsByClassName('download')[0];
  var saveButton = document.getElementsByClassName('save-btn')[0];

  var canvas = document.getElementsByClassName('can')[0];
  var canvasWidth = null;
  var canvasHeight = null;
  var downloaded = false;
  var ctx;
  var flag = false;
  var prevX = 0;
  var currX = 0;
  var prevY = 0;
  var currY = 0;
  var dotFlag = false;
  var lineColour = 'black';
  var lineThickness = 2;
  var drawingsContainer = document.getElementsByClassName('drawings-container')[0];
  var loader = document.getElementsByClassName('loader')[0];

  if (clearButton) {
    clearButton.addEventListener('click', erase);
  }

  if (downloadButton) {
    downloadButton.addEventListener('click', downloadImg);
  }

  if (saveButton) {
    saveButton.addEventListener('click', saveImg);
  }

  (function () {
    if (!canvas) {
      getImages();
      return;
    }
    canvasWidth = canvas.offsetWidth;
    canvasHeight = canvas.offsetHeight;
  })();

  window.addEventListener('resize', function (event) {
    if (downloaded || !canvas) { return; }
    canvasWidth = canvas.offsetWidth;
    canvasHeight = canvas.offsetHeight;
    init();
  });

  function init () {
    if (!canvas) { return; }
    ctx = canvas.getContext('2d');

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    var events = ['mousemove', 'mousedown', 'mouseup', 'mouseout', 'touchmove',
      'touchstart', 'touchend', 'touchcancel'];

    events.forEach(function (eventType) {
      canvas.addEventListener(eventType, function (e) {
        e.preventDefault();
        var eventData = e.touches ? e.touches[0] : e;
        findxy(eventType, eventData);
      }, false);
    });
  }

  function draw () {
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = lineColour;
    ctx.lineWidth = lineThickness;
    ctx.stroke();
    ctx.closePath();
  }

  function erase () { ctx.clearRect(0, 0, canvasWidth, canvasHeight); }

  function findxy (res, e) {
    if (res === 'mousedown' || res === 'touchstart') {
      prevX = currX;
      prevY = currY;
      currX = e.clientX - canvas.offsetLeft;
      currY = e.clientY - canvas.offsetTop;

      flag = true;
      dotFlag = true;
      if (dotFlag) {
        ctx.beginPath();
        ctx.fillStyle = lineColour;
        ctx.fillRect(currX, currY, 2, 2);
        ctx.closePath();
        dotFlag = false;
      }
    }

    if (res === 'mouseup' || res === 'mouseout') { flag = false; }

    if (res === 'mousemove' || res === 'touchmove') {
      if (flag) {
        prevX = currX;
        prevY = currY;
        currX = e.clientX - canvas.offsetLeft;
        currY = e.clientY - canvas.offsetTop;
        draw();
      }
    }
  }

  var savedButtonPressed = false;
  function saveImg () {
    if (savedButtonPressed) { return; }
    savedButtonPressed = true;
    displayValidation();
    var payload = this.href = canvas.toDataURL('image/png');
    var http = new XMLHttpRequest();
    var url = '/post-drawing';
    http.open('POST', url, true);
    http.onreadystatechange = function () {
      if (!http.readyState === 4 && !http.status === 200) {
        console.log(http.responseText);
      }
    };
    http.send(payload);

    setTimeout(function () {
      savedButtonPressed = false;
    }, 4500);
  }

  function downloadImg () {
    downloaded = true;
    setTimeout(function () { downloaded = false; }, 500);
    this.href = canvas.toDataURL('image/png');
  }

  function getImages () {
    var http = new XMLHttpRequest();
    var url = '/get-drawings';

    http.onreadystatechange = function () {
      if (http.readyState === 4 && http.status === 200) {
        var drawings = JSON.parse(http.responseText);
        createElements(drawings.drawings);
        drawingsContainer.classList.remove('display-none');
        loader.classList.add('display-none');
      }
    };

    http.open('GET', url, true);
    http.send(null);
  }

  function createElements (drawings) {
    drawings.forEach(function (drawing) {
      var div = document.createElement('IMG');
      div.src = drawing.drawing;
      div.alt = 'Recent Drawing';
      div.classList.add('recent-drawings');
      div.classList.add('mySlides');
      div.style.display = 'none';
      drawingsContainer.appendChild(div);
    });
    drawingsContainer.firstChild.style = 'block';
  }

  var leftButton = document.getElementsByClassName('slideshow-left-button')[0];
  var rightButton = document.getElementsByClassName('slideshow-right-button')[0];

  if (leftButton && rightButton) {
    leftButton.addEventListener('click', function () { plusDivs(-1); });
    rightButton.addEventListener('click', function () { plusDivs(+1); });

    var slideIndex = 0;
    showDivs(slideIndex);
  }

  function plusDivs (n) {
    showDivs(slideIndex += n);
  }

  function showDivs (n) {
    var x = document.getElementsByClassName('mySlides');
    if (n > x.length - 1) { slideIndex = 0; }
    if (n < 0) { slideIndex = x.length - 1; }
    for (var i = 0; i < x.length; i++) {
      x[i].style.display = 'none';
    }
    if (x[slideIndex]) {
      x[slideIndex].style.display = 'block';
    }
  }

  function displayValidation () {
    var validationDiv = document.getElementsByClassName('button-validation')[0];
    var checkmark = document.getElementsByClassName('checkmark')[0];
    validationDiv.style.height = '105px';

    setTimeout(function () {
      animateCheckmark();
      setTimeout(function () {
        checkmark.style.display = 'inline';
      }, 50);
    }, 1000);

    setTimeout(function () {
      validationDiv.style.height = '0px';
      checkmark.style.display = 'none';
    }, 3000);
  }

  function animateCheckmark () {
    anime({
      targets: '#checkmark path',
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'easeInOutSine',
      opacity: {
        value: 1,
        duration: 100
      }
    });
  }
})();
