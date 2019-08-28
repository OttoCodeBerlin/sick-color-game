const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
let startCounter = 0
let selectCounter = 0
let playCounter_one = 10
let playCounter_two = 10
let playCounter_three = 10
let score_one = 0
let score_two = 0
let score_three = 0
let failsLeft_one = 3
let failsLeft_two = 3
let failsLeft_three = 3
let selectInterval
let startInterval
let playInterval
let stage = 'start'
let introSound = new Audio("../audio/intro_001.mp3")
let playSound1 = new Audio("../audio/play_002.mp3")
let winSound = new Audio("../audio/win_001.mp3")
let failSound = new Audio("../audio/fail_001.mp3")
let levelSound = new Audio("../audio/level_end_001.mp3")
// Generate color to pick based on RGB ranges
let pickColors_one = generatePickColors(225, 255, 0, 200, 0, 200)
//let pickColors_two = generatePickColors(5592405, 1118481)

// Get color by mouseover function
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
//   console.log(mouseValues)
// })

//Mouse click function including stage switch and color retrieving 
canvas.addEventListener('click', function (e) {
  console.log(stage)

  let pos = findPos(this)
  let x = e.pageX - pos.x
  let y = e.pageY - pos.y
  let coord = "x=" + x + ", y=" + y
  let c = this.getContext('2d')
  let p = c.getImageData(x, y, 1, 1).data
  //returns HEX color of position where mouse clicked
  let hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6)
  $('#status').html(coord + "<br>" + hex)


  switch (stage) {

    case 'start':
      ctx.save()
      generateStartScreen()
      stage = 'play' //change here to 'ready' to include select screen
      break
    case 'ready':
      //User click on START GAME
      if (160 < x && x < 430 && 420 < y && y < 490) {
        ctx.restore()
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.save()
        generateSelectScreen()
      }
      //User click on INSTRUCTIONS
      //User click on CREDITS

      break
    case 'play':
      ctx.restore()
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.save()
      drawLevelOne()
      animate2sFullscreen()
      setTimeout(function () {
        startGame1()
        stage = 'play_one'
      }, 1500);

      break

    case 'play_one':
      if (playCounter_one === 0) {
        ctx.restore()
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.save()
        uniqueColorMode = false
        animate2sFullscreen()
        stage = 'play_two'
        drawLevelFinished('ONE')
        levelSound.play()
        break

      } else if (failsLeft_one <= 0) {
        stage = 'fail'

      }

      ctx.restore()
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.save()
      animate2sFullscreen(true, hex)
      uniqueColorMode = true
      setTimeout(function () {
        startGame1()
        stage = 'play_one'
      }, 1500)

      if (pickColors_one.includes(hex)) {
        winSound.play()
        score_one++
        winScreen(hex)
      } else {
        failsLeft_one--
        failSound.play()
        failScreen()
      }

      break

    case 'fail':
      uniqueColorMode = false
      animate2sFullscreen()
      break

    case 'play_two':

      if (playCounter_two === 0) {

        ctx.restore()
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.save()
        uniqueColorMode = false
        animate2sFullscreen()
        stage = 'play_three'
        drawLevelFinished('TWO')
        levelSound.play()

        break

      } else if (failsLeft_two <= 0) {
        stage = 'fail'
      }
      ctx.restore()
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.save()

      animate2sFullscreen(true, hex)
      uniqueColorMode = true
      setTimeout(function () {
        startGame2()
        stage = 'play_two'
      }, 1500)
      if (playCounter_two < 10) {
        if (pickColors_one.includes(hex)) {
          winSound.play()
          score_two++
          winScreen(hex)
        } else {
          failsLeft_two--
          failSound.play()
          failScreen()
        }
      }
      break


    case 'play_three':
      if (playCounter_three === 0) {
        uniqueColorMode = false
        stage = 'win'
        drawLevelFinished('THREE')
        levelSound.play()
        ctx.restore()
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.save()
        break

      } else if (failsLeft_three <= 0) {
        stage = 'fail'
      }
      ctx.restore()
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.save()

      animate2sFullscreen(true, hex)
      uniqueColorMode = true
      setTimeout(function () {
        startGame3()
        stage = 'play_three'
      }, 1500)
      if (playCounter_three < 10) {
        if (pickColors_one.includes(hex)) {
          winSound.play()
          score_three++
          winScreen(hex)
        } else {
          failsLeft_three--
          failSound.play()
          failScreen()
        }
      }
      break



  }
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
  return ((r << 16) | (g << 8) | b).toString(16);
}


//Win screen
function winScreen(hex) {
  ctx.fillStyle = "black"
  ctx.font = "50px Rubik Mono One"
  ctx.fillText('PERFECT!', 330, 72)
  ctx.fillStyle = hex
  ctx.fillText(' ' + hex + '  it is.', 185, 172)
  ctx.fillStyle = "black"
  ctx.font = "80px Rubik Mono One"
  ctx.fillText('SCORE:' + (score_one + score_two + score_three), 250, 672)
}


//Fail screen
function failScreen() {
  ctx.fillStyle = "black"
  ctx.font = "60px Rubik Mono One"
  ctx.fillText('THIS', 120, 272)
  ctx.fillText('WAS', 120, 372)
  ctx.fillText('NOT', 120, 472)
  ctx.fillText('A GOOD', 120, 572)
  ctx.fillText('IDEA!', 120, 672)
}

//Start screen on startup
window.onload = function () {
  ctx.fillStyle = "black"
  ctx.font = "50px Rubik Mono One"
  ctx.fillText('CLICK TO START', 200, 372)
}


//Inter-Level screen
function drawLevelFinished(levelText) {
  ctx.fillStyle = "black"
  ctx.font = "50px Rubik Mono One"
  ctx.fillText('FINISHED LEVEL ' + levelText, 200, 372)
  ctx.font = "36px Rubik Mono One"
  ctx.fillText('CLICK TO CONTINUE', 240, 572)
}

//Intro screen before Level One
function drawLevelOne() {
  ctx.fillStyle = "black"
  ctx.font = "60px Rubik Mono One"
  ctx.fillText('STARTING LEVEL ONE', 30, 372)
  ctx.font = "50px Rubik Mono One"
  ctx.fillText('HAVE FUN', 350, 572)
}


//Square class for play board on canvas
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



//Generate rectangular pattern - play field
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


//Color to be picked - Array of 10
//cutoffHex: range border for color range in decimal values (i.e. #555555 for current color tile scheme, max 16777215=#FFFFFF)
//rangeHex: width of color range in decimal values (e.g. 1118481 for #111111)
function generatePickColors(rRangeMin, rRangeMax, gRangeMin, gRangeMax, bRangeMin, bRangeMax) {
  let pickColorArr = []
  for (i = 0; i < 10; i++) {
    let r = Math.floor(Math.random() * (rRangeMax - rRangeMin) + rRangeMin)
    let g = Math.floor(Math.random() * (bRangeMax - bRangeMin) + bRangeMin)
    let b = Math.floor(Math.random() * (gRangeMax - gRangeMin) + gRangeMin)
    pickColorArr.push('#' + ((r << 16) | (g << 8) | b).toString(16))
  }
  return pickColorArr
}

//
function generateRandomColorActive() {
  let randomColor = Math.floor(Math.random() * 16777215 / 3).toString(16)
  if (randomColor.length === 3) {
    return '#000' + randomColor
  } else if (randomColor.length === 4) {
    return '#00' + randomColor
  } else if (randomColor.length === 5) {
    return '#0' + randomColor
  } else {
    return '#' + randomColor
  }
}

//Generate position of to-pick tile
function generatePickIndex(number) {
  //Create arrays of rows and columns with unique values
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
  //stage = 'ready'
  //introSound.play()
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
  //introSound.pause()
  //playSound1.play()
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  generateTileStack(55, 35, playCounter_one)
  let pickColorArrayI = []
  let pickColorArrayK = []
  for (let i = 0; i < playCounter_one; i++) {
    pickColorArrayI.push(Math.floor(Math.random() * 10))
    pickColorArrayK.push(Math.floor(Math.random() * 7))
  }

  for (let timer = 0; timer < playCounter_one; timer++) {
    ctx.rotate(timer / 10 * Math.PI / 180)
    ctx.translate(4, -4.5)

    for (let i = 0; i < 9; i++) {
      for (let k = 0; k < 7; k++) {
        if (pickColorArrayI[timer] === i && pickColorArrayK[timer] === k) {
          eval('rect' + timer + i + k + 'c.draw("' + pickColors_one[i] + '")')
        } else {
          eval('rect' + timer + i + k + 'c.draw()')
        }
      }
    }
  }
  ctx.fillStyle = "black"
  ctx.font = "20px Rubik Mono One"
  ctx.fillText('SCORE', 62, 65)
  ctx.font = "50px Rubik Mono One"
  ctx.fillText(score_one, 82, 125)
  ctx.font = "20px Rubik Mono One"
  ctx.fillStyle = "#F36363"
  ctx.fillText('FAILS', 62, 660)
  ctx.fillText('LEFT', 70, 675)
  ctx.font = "50px Rubik Mono One"
  ctx.fillText(failsLeft_one, 82, 725)
  playCounter_one--
}



function startGame2() {
  //introSound.pause()
  //playSound1.play()
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  generateTileStack(55, 35, playCounter_two)
  let pickColorArrayI = []
  let pickColorArrayK = []
  for (let i = 0; i < playCounter_two; i++) {
    pickColorArrayI.push(Math.floor(Math.random() * 10))
    pickColorArrayK.push(Math.floor(Math.random() * 7))
  }

  for (let timer = 0; timer < playCounter_two; timer++) {
    ctx.rotate(timer / 10 * Math.PI / 180)
    ctx.translate(4, -4.5)

    for (let i = 0; i < 9; i++) {
      for (let k = 0; k < 7; k++) {
        if (pickColorArrayI[timer] === i && pickColorArrayK[timer] === k) {
          eval('rect' + timer + i + k + 'c.draw("' + pickColors_one[i] + '")')
        } else {
          eval('rect' + timer + i + k + 'c.draw()')
        }
      }
    }
  }
  if (true) {
    ctx.fillStyle = "black"
    ctx.font = "20px Rubik Mono One"
    ctx.fillText('SCORE', 62, 65)
    ctx.font = "50px Rubik Mono One"
    ctx.fillText(score_two, 82, 125)
    ctx.font = "20px Rubik Mono One"
    ctx.fillStyle = "#F36363"
    ctx.fillText('FAILS', 62, 660)
    ctx.fillText('LEFT', 70, 675)
    ctx.font = "50px Rubik Mono One"
    ctx.fillText(failsLeft_two, 82, 725)
  }
  playCounter_two--
}



function startGame3() {
  //introSound.pause()
  //playSound1.play()
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  generateTileStack(55, 35, playCounter_three)
  let pickColorArrayI = []
  let pickColorArrayK = []
  for (let i = 0; i < playCounter_three; i++) {
    pickColorArrayI.push(Math.floor(Math.random() * 10))
    pickColorArrayK.push(Math.floor(Math.random() * 7))
  }

  for (let timer = 0; timer < playCounter_three; timer++) {
    ctx.rotate(timer / 10 * Math.PI / 180)
    ctx.translate(4, -4.5)

    for (let i = 0; i < 9; i++) {
      for (let k = 0; k < 7; k++) {
        if (pickColorArrayI[timer] === i && pickColorArrayK[timer] === k) {
          eval('rect' + timer + i + k + 'c.draw("' + pickColors_one[i] + '")')
        } else {
          eval('rect' + timer + i + k + 'c.draw()')
        }
      }
    }
  }
  if (true) {
    ctx.fillStyle = "black"
    ctx.font = "20px Rubik Mono One"
    ctx.fillText('SCORE', 62, 65)
    ctx.font = "50px Rubik Mono One"
    ctx.fillText(score_three, 82, 125)
    ctx.font = "20px Rubik Mono One"
    ctx.fillStyle = "#F36363"
    ctx.fillText('FAILS', 62, 660)
    ctx.fillText('LEFT', 70, 675)
    ctx.font = "50px Rubik Mono One"
    ctx.fillText(failsLeft_three, 82, 725)
  }
  playCounter_three--
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
  ctx.fillText('A VIDEO GAME BY OTTOCODEBERLIN', 114 + xOffset, 159 + yOffset)
  ctx.fillText('TOUCH ME BELOW OR USE YOUR MOUSE', 114 + xOffset, 259 + yOffset)
  ctx.fillStyle = "#F36363"
  ctx.fillText('START GAME', 114 + xOffset, 459 + yOffset)
  ctx.fillText('INSTRUCTIONS', 114 + xOffset, 559 + yOffset)
  ctx.fillText('CREDITS', 114 + xOffset, 659 + yOffset)
}

function getSelectText(xOffset, yOffset) {
  ctx.fillStyle = "white"
  ctx.font = "24px Rubik Mono One"
  ctx.fillText('SELECT GAME TO START', 114 + xOffset, 259 + yOffset)
  ctx.fillStyle = "#F36363"
  ctx.fillText('MODERATE', 114 + xOffset, 359 + yOffset)
  ctx.fillText('HARD', 114 + xOffset, 459 + yOffset)
  ctx.fillText('SICK MODE', 114 + xOffset, 659 + yOffset)
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

let cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame

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
  this.vx = -25 + Math.random() * 50;
  this.vy = -25 + Math.random() * 50;

  //Random colors
  // this.r = Math.round(Math.random()) * 255;
  // this.g = Math.round(Math.random()) * 255;
  // this.b = Math.round(Math.random()) * 255;
}

for (var i = 0; i < 500; i++) {
  circles.push(new create());
}

function drawExplosion(uniqueColorMode, hex) {

  ctx.globalCompositeOperation = "destination-over"
  // if (uniqueColorMode) {
  //   ctx.globalCompositeOperation = "destination-over"
  // }
  // else {
  //   ctx.globalCompositeOperation = "source-over"
  // }


  // ctx.fillStyle = "rgba(0,0,0,0.15)";
  //ctx.fillRect(0, 0, W, H);

  //Fill the canvas with circles
  for (var j = 0; j < circles.length; j++) {
    var c = circles[j];

    //Create the circles
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2, false);

    if (uniqueColorMode) {
      ctx.fillStyle = hex
    }
    else {
      ctx.fillStyle = generateRandomColorActive()
    }

    ctx.fill();

    c.x += c.vx;
    c.y += c.vy;
    c.radius -= .02;

    if (c.radius < 0)
      circles[j] = new create();
  }
  ctx.globalCompositeOperation = "source-over"
}


function animate1sFullscreen(uniqueColorMode, hex) {
  let start = Date.now()
  function loop() {
    if (Date.now() - start < 500) {
      requestAnimFrame(loop)
      drawExplosion(uniqueColorMode, hex)
    }
  }
  loop()
}

function animate2sFullscreen(uniqueColorMode, hex) {
  let start = Date.now()
  function loop() {
    if (Date.now() - start < 1500) {
      requestAnimFrame(loop)
      drawExplosion(uniqueColorMode, hex)
    }
  }
  loop()
}



//   document.onkeyup = e => {
//     car.speedX = 0
//     car.speedY = 0
//   }
// }

