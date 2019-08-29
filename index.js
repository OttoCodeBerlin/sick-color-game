const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
let externalStop = false
let startTimer
let game1Timer
let game2Timer
let game3Timer
let scoreResult
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
let introSound = new Audio("./audio/intro_001.mp3")
let playSound1 = new Audio("./audio/play_002.mp3")
let winSound = new Audio("./audio/win_001.mp3")
let failSound = new Audio("./audio/fail_001.mp3")
let levelSound = new Audio("./audio/level_end_001.mp3")
// Generate color to pick based on RGB ranges
let pickColors_one = generatePickColors(200, 255, 40, 255, 0, 255)
let pickColors_two = generatePickColors(100, 220, 0, 255, 0, 255)
let pickColors_three = generatePickColors(120, 200, 0, 255, 0, 255)

//Select RGB color ranges for play field pattern
let rnRangeMin = 0
let rnRangeMax = 50
let gnRangeMin = 0
let gnRangeMax = 255
let bnRangeMin = 0
let bnRangeMax = 255


//Random color function for color to be picked - Array of 10
function generatePickColors(rRangeMin, rRangeMax, gRangeMin, gRangeMax, bRangeMin, bRangeMax) {
  let pickColorArr = []
  for (i = 0; i < 10; i++) {
    let r = Math.floor(Math.random() * (rRangeMax - rRangeMin) + rRangeMin)
    let g = Math.floor(Math.random() * (bRangeMax - bRangeMin) + bRangeMin)
    let b = Math.floor(Math.random() * (gRangeMax - gRangeMin) + gRangeMin)
    let pickCol = ((r << 16) | (g << 8) | b).toString(16)
    if (pickCol.length === 3) {
      pickCol = '#000' + pickCol
    } else if (pickCol.length === 4) {
      pickCol = '#00' + pickCol
    } else if (pickCol.length === 5) {
      pickCol = '#0' + pickCol
    } else {
      pickCol = '#' + pickCol
    }
    pickColorArr.push(pickCol)
  }
  return pickColorArr
}

//Mouse click function including stage switch and color retrieving 
canvas.addEventListener('click', function (e) {

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

    case 'reload':
      window.location.reload();
      break

    case 'start':
      stage = 'play' //change here to 'ready' to include select screen
      // startCounter = 0
      ctx.restore()
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.save()
      generateStartScreen()
      break

    case 'ready':
      //User click on START GAME
      if (160 < x && x < 430 && 420 < y && y < 490) {
        ctx.restore()
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.save()
        generateSelectScreen()
      }
      break


    case 'play':
      if (160 < x && x < 430 && 420 < y && y < 490) { //User clicked "Start Game"
        ctx.restore()
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.save()
        drawLevelOne()
        animate2sFullscreen()
        setTimeout(function () {
          startGame1()
          stage = 'play_one'
        }, 1500);
      }
      if (150 < x && x < 400 && 535 < y && y < 590) { //User clicked "Instructions"
        ctx.restore()
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.save()
        animate1sFullscreen(true, '#FAB2F5')
        setTimeout(function () {
          showInstructions()
        }, 1000);
        stage = 'reload'
      }
      if (145 < x && x < 300 && 640 < y && y < 680) { //User clicked "Credits"
        ctx.restore()
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.save()
        animate1sFullscreen(true, '#B2FAE6')
        setTimeout(function () {
          showCredits()
        }, 1000);
        stage = 'reload'
      }
      break

    case 'play_one':
      if (playCounter_one === 0) {
        ctx.restore()
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.save()
        uniqueColorMode = false
        animate2sFullscreen(false, hex)
        stage = 'play_two'
        drawLevelFinished('ONE')
        playSound1.pause()
        playSound1.load()
        levelSound.play()
        break
      } else if (failsLeft_one <= 0 && (!pickColors_one.includes(hex))) {
        stage = 'reload'
        failSound.play()
        ctx.restore()
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.save()
        failScreenFinal()
      }
      if (stage != 'reload') {
        ctx.restore()
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.save()
        animate2sFullscreen(true, hex)
        uniqueColorMode = false
        game1Timer = Date.now()
        setTimeout(function () {
          startGame1()
          stage = 'play_one'
        }, 1500)

        if (pickColors_one.includes(hex)) {
          winSound.load()
          winSound.play()
          score_one++
          winScreen(hex)
        } else {
          failsLeft_one--
          failSound.load()
          failSound.play()
          failScreen()
        }
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
        animate2sFullscreen(false, hex)
        stage = 'play_three'
        drawLevelFinished('TWO')
        playSound1.pause()
        playSound1.load()
        levelSound.play()
        break
      } else if (failsLeft_two <= 0 && (!pickColors_two.includes(hex))) {
        stage = 'reload'
        failSound.play()
        ctx.restore()
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.save()
        failScreenFinal()
      }
      if (stage != 'reload') {
        ctx.restore()
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.save()
        animate2sFullscreen(true, hex)
        uniqueColorMode = false
        setTimeout(function () {
          startGame2()
          stage = 'play_two'
        }, 1500)
        if (playCounter_two < 10) {//?

          if (pickColors_two.includes(hex)) {
            winSound.load()
            winSound.play()
            score_two++
            winScreen(hex)
          } else {
            failsLeft_two--
            failSound.load()
            failSound.play()
            failScreen()
          }
        }
      }
      break




    case 'play_three':
      if (playCounter_three === 0) {
        ctx.restore()
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.save()
        uniqueColorMode = false
        animate2sFullscreen(false, hex)
        //drawLevelFinished('THREE')
        playSound1.pause()
        playSound1.load()
        levelSound.play()
        winScreenFinal()
        stage = 'reload'
        break
      } else if (failsLeft_three <= 0) {
        stage = 'reload'
        failSound.play()
        ctx.restore()
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.save()
        failScreenFinal()
      }
      if (stage != 'reload') {
        ctx.restore()
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.save()
        animate2sFullscreen(true, hex)
        uniqueColorMode = false
        setTimeout(function () {
          startGame3()
          stage = 'play_three'
        }, 1500)
        if (playCounter_three < 10) { //?
          if (pickColors_three.includes(hex)) {
            winSound.load()
            winSound.play()
            score_three++
            winScreen(hex)
          } else {
            failsLeft_three--
            failSound.load()
            failSound.play()
            failScreen()
          }
        }
      }
      break




  }
}, false)


//Timer


//Helper function for mouse position
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

//Convert RGB to hex
function rgbToHex(r, g, b) {
  return ((r << 16) | (g << 8) | b).toString(16);
}


//Show credits
function showCredits() {
  ctx.fillStyle = "black"
  ctx.font = "50px Rubik Mono One"
  ctx.fillText('Credits', 330, 72)
  ctx.font = "12px Rubik Mono One"
  ctx.fillText('"Tyrant" Kevin MacLeod (incompetech.com)', 40, 172)
  ctx.fillText('"Professor Umlaut" Kevin MacLeod (incompetech.com)', 40, 192)
  ctx.fillText('"Impact Intermezzo" Kevin MacLeod (incompetech.com)', 40, 212)
  ctx.fillText('Licensed under Creative Commons: By Attribution 4.0 License', 40, 232)
  ctx.fillText('http://creativecommons.org/licenses/by/4.0/', 40, 252)
  ctx.fillText('Explosion source code snippets: Heri Kurnianto https://codepen.io/pochielque/pen/XpwBLb', 40, 292)
  ctx.fillText('Rubik Mono One - This Font Software is licensed under the SIL Open Font License, Version 1.1.', 40, 342)
  ctx.fillText('https://scripts.sil.org/OFL_web', 40, 362)
  ctx.fillText('jQuery https://jquery.org/license/', 40, 402)

}


//Show instructions
function showInstructions() {
  ctx.fillStyle = "black"
  ctx.font = "50px Rubik Mono One"
  ctx.fillText('Instructions', 240, 72)
  ctx.font = "24px Rubik Mono One"
  ctx.fillText('Look for the color which does not fit...', 40, 172)
  ctx.fillText('in each board of 63 tiles.', 40, 222)
  ctx.fillText('CLICK or TOUCH the color.', 40, 272)
  ctx.fillText('The click color might be even in the corners!', 40, 322)
  ctx.fillText('There are three levels...', 40, 372)
  ctx.fillText('and you have 3 false attempts per level.', 40, 422)
  ctx.fillText('Be quick and accurate to maximize your score!', 40, 472)

}


//Win screen
function winScreen(hex) {
  ctx.fillStyle = "black"
  ctx.font = "50px Rubik Mono One"
  ctx.fillText('PERFECT!', 330, 72)
  ctx.fillStyle = hex
  ctx.fillText(' ' + hex + '  it is.', 175, 172)
  ctx.fillStyle = "black"
  ctx.font = "80px Rubik Mono One"
  ctx.fillText('SCORE:' + (score_one + score_two + score_three), 250, 672)
}

//Final screen
function winScreenFinal() {
  ctx.fillStyle = "#F36363"
  ctx.font = "50px Rubik Mono One"
  ctx.fillText('YOU MADE IT!', 250, 172)
  ctx.fillText('SCORE:' + (score_one + score_two + score_three), 340, 472)
  ctx.font = "80px Rubik Mono One"
  ctx.fillText('AWESOME', 285, 672)
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


//Final fail screen
function failScreenFinal() {
  ctx.fillStyle = "black"
  ctx.font = "80px Rubik Mono One"
  ctx.fillText('GAME OVERRRRR', 70, 172)
  ctx.font = "50px Rubik Mono One"
  ctx.fillText('CLICK TO START OVER', 100, 572)

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
  ctx.fillText('FINISHED LEVEL ' + levelText, 120, 372)
  ctx.font = "36px Rubik Mono One"
  ctx.fillText('CLICK TO CONTINUE', 240, 572)
}

//Intro screen before Level One
function drawLevelOne() {
  ctx.fillStyle = "black"
  ctx.font = "60px Rubik Mono One"
  ctx.fillText('STARTING LEVEL ONE', 50, 372)
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
    //select if color is external parameter or own property
    if (colorInput) {
      ctx.fillStyle = colorInput
    } else {
      ctx.fillStyle = this.color
    }
    //Draw rounded rectangles
    //ctx.fillRect(this.x, this.y, this.width, this.height)
    ctx.beginPath()
    ctx.moveTo(this.x + this.width, this.y + this.width)
    ctx.arcTo(this.x, this.y + this.width, this.x, this.y, 10)
    ctx.arcTo(this.x, this.y, this.x + this.width, this.y, 10)
    ctx.arcTo(this.x + this.width, this.y, this.x + this.width, this.y + this.width, 10)
    ctx.arcTo(this.x + this.width, this.y + this.width, this.x, this.y + this.width, 10)
    ctx.fill()
    ctx.closePath()
  }
}



//Generate rectangular pattern - play field
function generateTiles(xDisplacement, yDisplacement, pickActive) {

  for (let i = 0; i < 9; i++) {
    for (let k = 0; k < 7; k++) {
      eval('rect' + i + k + 'c = new Square(99, 99, generateRandomColorActiveNew(rnRangeMin, rnRangeMax, gnRangeMin, gnRangeMax, bnRangeMin, bnRangeMax), i * 100+xDisplacement, k * 100+yDisplacement)')
    }
  }
}

function generateTileStack(xDisplacement, yDisplacement, number) {
  for (let h = 0; h < number; h++) {
    for (let i = 0; i < 9; i++) {
      for (let k = 0; k < 7; k++) {
        eval('rect' + h + i + k + 'c = new Square(99, 99, generateRandomColorActiveNew(rnRangeMin, rnRangeMax, gnRangeMin, gnRangeMax, bnRangeMin, bnRangeMax), i * 100+xDisplacement, k * 100+yDisplacement)')
      }
    }
  }
}



//Random color function for main game board
function generateRandomColorActiveNew(rRangeMin, rRangeMax, gRangeMin, gRangeMax, bRangeMin, bRangeMax) {

  let r = Math.floor(Math.random() * (rRangeMax - rRangeMin) + rRangeMin)
  let g = Math.floor(Math.random() * (bRangeMax - bRangeMin) + bRangeMin)
  let b = Math.floor(Math.random() * (gRangeMax - gRangeMin) + gRangeMin)
  pickCol = ((r << 16) | (g << 8) | b).toString(16)
  if (pickCol.length === 3) {
    return '#000' + pickCol
  } else if (pickCol.length === 4) {
    return '#00' + pickCol
  } else if (pickCol.length === 5) {
    return '#0' + pickCol
  } else {
    return '#' + pickCol
  }
  return pickCol
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
  generateTileStack(55, 35, playCounter_one)
  let pickColorArrayI = []
  let pickColorArrayK = []
  for (let i = 0; i < playCounter_one; i++) {
    pickColorArrayI.push(Math.floor(Math.random() * 9))
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
  ctx.fillText('LEVEL', 862, 65)
  ctx.font = "50px Rubik Mono One"
  ctx.fillText('1', 882, 125)
  ctx.font = "20px Rubik Mono One"
  ctx.fillStyle = "#F36363"
  ctx.fillText('FAILS', 62, 660)
  ctx.fillText('LEFT', 70, 675)
  ctx.font = "50px Rubik Mono One"
  ctx.fillText(failsLeft_one, 82, 725)
  playCounter_one--
}



function startGame2() {
  playSound1.pause()
  playSound1.play()
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  generateTileStack(55, 35, playCounter_two)
  let pickColorArrayI = []
  let pickColorArrayK = []
  for (let i = 0; i < playCounter_two; i++) {
    pickColorArrayI.push(Math.floor(Math.random() * 9))
    pickColorArrayK.push(Math.floor(Math.random() * 7))
  }

  for (let timer = 0; timer < playCounter_two; timer++) {
    ctx.rotate(timer / 10 * Math.PI / 180)
    ctx.translate(4, -4.5)

    for (let i = 0; i < 9; i++) {
      for (let k = 0; k < 7; k++) {
        if (pickColorArrayI[timer] === i && pickColorArrayK[timer] === k) {
          eval('rect' + timer + i + k + 'c.draw("' + pickColors_two[i] + '")')
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
    ctx.fillText(score_one + score_two, 72, 125)
    ctx.font = "20px Rubik Mono One"
    ctx.fillText('LEVEL', 862, 65)
    ctx.font = "50px Rubik Mono One"
    ctx.fillText('2', 882, 125)
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
  playSound1.pause()
  playSound1.play()
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  generateTileStack(55, 35, playCounter_three)
  let pickColorArrayI = []
  let pickColorArrayK = []
  for (let i = 0; i < playCounter_three; i++) {
    pickColorArrayI.push(Math.floor(Math.random() * 9))
    pickColorArrayK.push(Math.floor(Math.random() * 7))
  }

  for (let timer = 0; timer < playCounter_three; timer++) {
    ctx.rotate(timer / 10 * Math.PI / 180)
    ctx.translate(4, -4.5)

    for (let i = 0; i < 9; i++) {
      for (let k = 0; k < 7; k++) {
        if (pickColorArrayI[timer] === i && pickColorArrayK[timer] === k) {
          eval('rect' + timer + i + k + 'c.draw("' + pickColors_three[i] + '")')
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
    ctx.fillText(score_one + score_two + score_three, 72, 125)
    ctx.font = "20px Rubik Mono One"
    ctx.fillText('LEVEL', 862, 65)
    ctx.font = "50px Rubik Mono One"
    ctx.fillText('3', 882, 125)
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
      ctx.fillStyle = generateRandomColorActiveNew(rnRangeMin, rnRangeMax, gnRangeMin, gnRangeMax, bnRangeMin, bnRangeMax)
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

//Short animation
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

//Long animation
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
