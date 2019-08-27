const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
// let frames = 0
// let interval
let startCounter = 0
let selectCounter = 0
let playCounter = 0
let selectInterval
let startInterval
let playInterval
let stage = 'start'
let introSound = new Audio("../audio/intro_001.mp3")
let playSound1 = new Audio("../Audio/play_002.mp3")

//Get color by mouseover function
// $('canvas').mousemove(function (e) {
//   let pos = findPos(this)
//   let x = e.pageX - pos.x
//   let y = e.pageY - pos.y
//   let coord = "x=" + x + ", y=" + y
//   let c = this.getContext('2d')
//   let p = c.getImageData(x, y, 1, 1).data
//   let hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6)
//   $('#status').html(coord + "<br>" + hex)
//   let mouseValues = { x, y, hex }
//   return mouseValues
// })
canvas.addEventListener('click', function (e) {
  let pos = findPos(this)
  let x = e.pageX - pos.x
  let y = e.pageY - pos.y
  let coord = "x=" + x + ", y=" + y
  let c = this.getContext('2d')
  let p = c.getImageData(x, y, 1, 1).data
  let hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6)
  $('#status').html(coord + "<br>" + hex)
  processMouseclick(x, y, hex)
}, false);

function findPos(obj) {
  let curleft = 0, curtop = 0
  if (obj.offsetParent) {
    do {
      curleft += obj.offsetLeft
      curtop += obj.offsetTop
    } while (obj = obj.offsetParent)
    return { x: curleft, y: curtop }
  }
  return undefined
}

function rgbToHex(r, g, b) {
  // if (r > 255 || g > 255 || b > 255)
  //   throw "Invalid color component"
  return ((r << 16) | (g << 8) | b).toString(16);
}


//Mouseclick function for canvas

function processMouseclick(x, y, hex) {
  return { x, y, hex }
}

let mouseResult = processMouseclick
console.log(mouseResult)




// window.onload = function () {
//   document.getElementById("canvas").onclick = function () {
//     start()
//   }
// }

// console.log(mouseValues.x)
// console.log(mouseValues.y)
// console.log(mouseValues.hex)

class Square {
  constructor(width, height, color, x, y) {
    this.width = width
    this.height = height
    this.color = color
    this.x = x
    this.y = y
    this.speedX = 0
    this.speedY = 0
  }

  draw(colorInput) {

    if (colorInput) {
      ctx.fillStyle = colorInput
    } else {
      ctx.fillStyle = this.color
    }

    //ctx.fillRect(this.x, this.y, this.width, this.height)
    ctx.beginPath()
    ctx.moveTo(this.x + this.width, this.y + this.width);
    ctx.arcTo(this.x, this.y + this.width, this.x, this.y, 10);
    ctx.arcTo(this.x, this.y, this.x + this.width, this.y, 10);
    ctx.arcTo(this.x + this.width, this.y, this.x + this.width, this.y + this.width, 10);
    ctx.arcTo(this.x + this.width, this.y + this.width, this.x, this.y + this.width, 10);
    ctx.fill()
    ctx.closePath()
  }
}



//Generate rectangular pattern
function generateTiles(xDisplacement, yDisplacement, pickActive) {

  for (let i = 0; i < 9; i++) {
    for (let k = 0; k < 7; k++) {
      eval('rect' + i + k + 'c = new Square(99, 99, generateRandomColorActive(), i * 100+xDisplacement, k * 100+yDisplacement)')
    }
  }
}

function generateTileStack(xDisplacement, yDisplacement, number) {
  for (let h = 0; h < number; h++) {
    for (let i = 0; i < 9; i++) {
      for (let k = 0; k < 7; k++) {
        eval('rect' + h + i + k + 'c = new Square(99, 99, generateRandomColorActive(), i * 100+xDisplacement, k * 100+yDisplacement)')
      }
    }
  }
}


function generatePickColors(diffFactor) {
  let pickColorArr = []
  for (i = 0; i < 10; i++) {
    pickColorArr.push('#' + Math.floor(Math.random() * 16777215 / 3 + diffFactor).toString(16))
  }
  console.log(pickColorArr)
  return pickColorArr
}

function generateRandomColorActive() {
  return '#' + Math.floor(Math.random() * 16777215 / 3).toString(16)
}

function generatePickIndex(number) {
  //create array of rows and columns with unique values
  let randomIArray = []
  for (let i = 0; i < 9; ++i) {
    randomIArray[i] = i
  }
  let randomKArray = []
  for (let i = 0; i < 7; ++i) {
    randomKArray[i] = i
  }
  let randomHArray = []
  for (let i = 0; i < number; ++i) {
    randomHArray[i] = i
  }

  function shuffle(array) {
    var tmp, current, top = array.length;
    if (top) while (--top) {
      current = Math.floor(Math.random() * (top + 1));
      tmp = array[current];
      array[current] = array[top];
      array[top] = tmp;
    }
    return array;
  }

  randomIArray = shuffle(randomIArray)
  randomKArray = shuffle(randomKArray)
  randomHArray = shuffle(randomHArray)

  return { randomHArray, randomIArray, randomKArray }
}


// function generateRandomGrey() {
//   let brightness = 255
//   let oneColor = Math.round((Math.random() * 256 + brightness) / 2.0)
//   let hexString = "#" + ((1 << 24) + (oneColor << 16) + (oneColor << 8) + oneColor).toString(16).slice(1);
//   return hexString
//   //  // Six levels of brightness from 0 to 5, 0 being the darkest
//   //  var rgb = [Math.random() * 256, Math.random() * 256, Math.random() * 256];
//   //  var mix = [brightness*51, brightness*51, brightness*51]; //51 => 255/5
//   //  var mixedrgb = [rgb[0] + mix[0], rgb[1] + mix[1], rgb[2] + mix[2]].map(function(x){ return Math.round(x/2.0)})
//   //  return "rgb(" + mixedrgb.join(",") + ")";
// }



function generateStartScreen() {
  generateTiles(55, 35, false)
  //rotate Tile layout each time
  ctx.rotate(startCounter / 10 * Math.PI / 180)
  //move Tile layout each time
  ctx.translate(4, -4.5)
  //draw the layout
  for (let i = 0; i < 9; i++) {
    for (let k = 0; k < 7; k++) {
      eval('rect' + i + k + 'c.draw()')
    }
  }
  stage = 'ready'
  introSound.play()
  //draw it only 10 times
  startCounter++
  startInterval = setInterval(function () {
    if (startCounter > 10) {
      clearInterval(startInterval)
      return
    } else {
      generateStartScreen()
    }
  }, 340)
  //display start text on final slide
  if (startCounter == 11) {
    getStartText(55, 37)
  }
}




function generateSelectScreen() {
  generateTiles(55, 35, false)
  //rotate Tile layout each time
  ctx.rotate(selectCounter / 10 * Math.PI / 180)
  //move Tile layout each time
  ctx.translate(4, -4.5)
  //draw the layout
  for (let i = 0; i < 9; i++) {
    for (let k = 0; k < 7; k++) {
      eval('rect' + i + k + 'c.draw()')
    }
  }
  stage = 'play'
  //draw it only 10 times
  selectCounter++
  selectInterval = setInterval(function () {
    if (selectCounter > 10) {
      clearInterval(selectInterval)
      return
    } else {
      generateSelectScreen()
    }
  }, 200)
  //display select text on final slide
  if (selectCounter == 11) {
    getSelectText(55, 37)
  }
}



function startGame1() {
  introSound.pause()
  playSound1.play()
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  generateTileStack(55, 35, 10)
  let pickColorArrayI = []
  let pickColorArrayK = []
  for (let i = 0; i < 10; i++) {
    pickColorArrayI.push(Math.floor(Math.random() * 10))
    pickColorArrayK.push(Math.floor(Math.random() * 7))
  }

  for (let timer = 0; timer < 10; timer++) {
    ctx.rotate(timer / 10 * Math.PI / 180)
    ctx.translate(4, -4.5)
    for (let i = 0; i < 9; i++) {
      for (let k = 0; k < 7; k++) {
        if (pickColorArrayI[timer] === i && pickColorArrayK[timer] === k) {
          console.log("Jurz")
          eval('rect' + timer + i + k + 'c.draw("#FF28FF")')
        } else {
          eval('rect' + timer + i + k + 'c.draw()')
        }
      }
    }
  }
}


function getStartText(xOffset, yOffset) {
  ctx.fillStyle = "white"
  ctx.font = "50px Rubik Mono One"
  // ctx.fillText('SICK   COLO R', 114, 65)
  ctx.fillText('SI', 106 + xOffset, 65 + yOffset)
  ctx.fillText('CK', 206 + xOffset, 65 + yOffset)
  ctx.fillText('CO', 306 + xOffset, 65 + yOffset)
  ctx.fillText('LO', 405 + xOffset, 65 + yOffset)
  ctx.fillStyle = "#F36363"
  ctx.fillText('R', 505 + xOffset, 65 + yOffset)

  ctx.fillStyle = "white"
  ctx.font = "24px Rubik Mono One"
  ctx.fillText('A VIDEO GAME BY OTTOCODEBERLIN', 114 + xOffset, 259 + yOffset)

  ctx.fillText('INSTRUCTIONS: PRESS I', 114 + xOffset, 359 + yOffset)
  ctx.fillText('START GAME: PRESS S', 114 + xOffset, 459 + yOffset)
  ctx.fillText('CREDITS: PRESS C', 114 + xOffset, 659 + yOffset)
}

function getSelectText(xOffset, yOffset) {
  ctx.fillStyle = "white"
  ctx.font = "24px Rubik Mono One"
  ctx.fillText('SELECT GAME', 114 + xOffset, 259 + yOffset)

  ctx.fillText('MODERATE', 114 + xOffset, 359 + yOffset)
  ctx.fillText('HARD', 114 + xOffset, 459 + yOffset)
  ctx.fillText('SICK MODE', 114 + xOffset, 659 + yOffset)
}



document.onkeydown = e => {
  switch (e.keyCode) {
    case 83:
      switch (stage) {

        case 'start':
          ctx.save()
          generateStartScreen()
          stage = 'ready'
          break
        case 'ready':
          ctx.restore()

          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.save()
          generateSelectScreen()
          break
        case 'play':

          switch (e.keyCode) {
            case 83:
              ctx.restore()
              startGame1()
              animate()
              break
          }
          break
      }

    case 81:
      //stop()
      break
    default:
      break
  }
}



// Explosion code snippets - Source https://codepen.io/pochielque/pen/XpwBLb modified by OttoCodeBerlin


// shim layer with setTimeout fallback
window.requestAnimFrame = (function () {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    };
})();

// var canvas = document.getElementById("canvas"),
// 	ctx = canvas.getContext("2d"),
// let W = window.innerWidth,
//   H = window.innerHeight,
let circles = [];

let W = canvas.width
let H = canvas.height

//Random Circles creator
function create() {

  //Place the circles at the center

  this.x = W / 2;
  this.y = H / 2;


  //Random radius between 2 and 6
  this.radius = 2 + Math.random() * 3;

  //Random velocities
  this.vx = -5 + Math.random() * 10;
  this.vy = -5 + Math.random() * 10;

  //Random colors
  this.r = Math.round(Math.random()) * 255;
  this.g = Math.round(Math.random()) * 255;
  this.b = Math.round(Math.random()) * 255;
}

for (var i = 0; i < 500; i++) {
  circles.push(new create());
}

function drawExplosion() {

  
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  //ctx.fillRect(0, 0, W, H);

  //Fill the canvas with circles
  for (var j = 0; j < circles.length; j++) {
    var c = circles[j];

    //Create the circles
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = "rgba(" + c.r + ", " + c.g + ", " + c.b + ", 0.5)";
    ctx.fill();

    c.x += c.vx;
    c.y += c.vy;
    c.radius -= .02;

    if (c.radius < 0)
      circles[j] = new create();
  }
}

function animate() {
  requestAnimFrame(animate);
  drawExplosion();
}


//   document.onkeyup = e => {
//     car.speedX = 0
//     car.speedY = 0
//   }
// }

