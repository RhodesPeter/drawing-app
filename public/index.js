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
    if (downloaded) { return; }
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

  function saveImg () {
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
    drawings.slice(-10).forEach(function (drawing) {
      var div = document.createElement('IMG');
      div.src = drawing.drawing;
      div.alt = 'Recent Drawing';
      div.classList.add('recent-drawings');
      div.classList.add('mySlides');
      div.style.display = 'none';
      drawingsContainer.appendChild(div);
    });
    drawingsContainer.lastChild.style = 'inline-block';
  }
})();

var slideIndex = 1;
showDivs(slideIndex);

function plusDivs (n) {
  showDivs(slideIndex += n);
}

function showDivs (n) {
  var i;
  var x = document.getElementsByClassName('mySlides');
  if (n > x.length) { slideIndex = 1; }
  if (n < 1) { slideIndex = x.length; }
  for (i = 0; i < x.length; i++) {
    x[i].style.display = 'none';
  }
  x[slideIndex - 1].style.display = 'block';
}
