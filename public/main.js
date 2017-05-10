document.getElementsByClassName('clear-btn')[0].addEventListener("click", erase);

var canvasSize = document.getElementsByClassName('can')[0];
var canvasWidth = canvasSize.offsetWidth;
var canvasHeight = canvasSize.offsetHeight;

window.addEventListener('resize', function(event){
  canvasWidth = canvasSize.offsetWidth;
  canvasHeight = canvasSize.offsetHeight;
  init();
});

var canvas;
var ctx;
var flag = false;
var prevX = 0;
var currX = 0;
var prevY = 0;
var currY = 0;
var dot_flag = false;
var x = "black";
var y = 2;

function init() {
  canvas = document.getElementsByClassName('can')[0];
  ctx = canvas.getContext("2d");

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  w = canvasWidth;
  h = canvasHeight;

  canvas.addEventListener("mousemove", function (e) {
    findxy('move', e)
  }, false);

  canvas.addEventListener("mousedown", function (e) {
    findxy('down', e)
  }, false);

  canvas.addEventListener("mouseup", function (e) {
    findxy('up', e)
  }, false);

  canvas.addEventListener("mouseout", function (e) {
    findxy('out', e)
  }, false);
}

function draw() {
  ctx.beginPath();
  ctx.moveTo(prevX, prevY);
  ctx.lineTo(currX, currY);
  ctx.strokeStyle = x;
  ctx.lineWidth = y;
  ctx.stroke();
  ctx.closePath();
}

function erase() {
  ctx.clearRect(0, 0, w, h);
}

function findxy(res, e) {
  if (res === 'down') {
    prevX = currX;
    prevY = currY;
    currX = e.clientX - canvasSize.offsetLeft;
    currY = e.clientY - canvasSize.offsetTop;

    flag = true;
    dot_flag = true;
    if (dot_flag) {
      ctx.beginPath();
      ctx.fillStyle = x;
      ctx.fillRect(currX, currY, 2, 2);
      ctx.closePath();
      dot_flag = false;
    }
  }
  if (res === 'up' || res === "out") {
    flag = false;
  }
  if (res === 'move') {
    if (flag) {
      prevX = currX;
      prevY = currY;
      currX = e.clientX - canvasSize.offsetLeft;
      currY = e.clientY - canvasSize.offsetTop;
      draw();
    }
  }
}

document.getElementsByClassName('save')[0].addEventListener('click', saveImg);

function saveImg() {
  this.href = canvas.toDataURL('image/png');
};
