let main = document.querySelector('.main')
const scoreElem = document.getElementById('score')
const levelElem = document.getElementById('level')
const nextTetroElem = document.getElementById('next-tetro')
const startBtn = document.getElementById('start')
const pauseBtn = document.getElementById('pause')
const gameOver = document.getElementById('game-over')

let playField = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]

let gameTimerID
let isPaused = true
let score = 0
let currentLevel = 1

/*described score and speed per level*/
let possibleLevels = {
  1: {
    scorePerLine: 10,
    speed: 400,
    nextLevelScore: 500,
  },
  2: {
    scorePerLine: 15,
    speed: 300,
    nextLevelScore: 1500,
  },
  3: {
    scorePerLine: 20,
    speed: 200,
    nextLevelScore: 2500,
  },
  4: {
    scorePerLine: 25,
    speed: 100,
    nextLevelScore: 3500,
  },
  5: {
    scorePerLine: 30,
    speed: 50,
    nextLevelScore: Infinity,
  },
}

/*all possible figures*/
let figures = {
  O: [
    [1, 1],
    [1, 1],
  ],
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  J: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  T: [
    [1, 1, 1],
    [0, 1, 0],
    [0, 0, 0],
  ],
}

let activeTetro = getNewTetro()
let nextTetro = getNewTetro()

/*display colored cells on the playfield*/
function draw() {
  let mainInnerHTML = ''
  for (let y = 0; y < playField.length; y++) {
    for (let x = 0; x < playField[y].length; x++) {
      if (playField[y][x] === 1) {
        mainInnerHTML += '<div class="cell movingCell"></div>'
      } else if (playField[y][x] === 2) {
        mainInnerHTML += '<div class="cell fixedCell"></div>'
      } else {
        mainInnerHTML += '<div class="cell"></div>'
      }
    }
  }
  main.innerHTML = mainInnerHTML
}

/*function for displaying what tetro will fall next*/
function drawNextTetro() {
  let nextTetroInnerHTML = ''
  for (let y = 0; y < nextTetro.shape.length; y++) {
    for (let x = 0; x < nextTetro.shape[y].length; x++) {
      if (nextTetro.shape[y][x] === 1) {
        nextTetroInnerHTML += '<div class="cell movingCell"></div>'
      } else {
        nextTetroInnerHTML += '<div class="cell"></div>'
      }
    }
    nextTetroInnerHTML += '<br/>'
  }
  nextTetroElem.innerHTML = nextTetroInnerHTML
}

function removePrevActiveTetro() {
  for (let y = 0; y < playField.length; y++) {
    for (let x = 0; x < playField[y].length; x++) {
      if (playField[y][x] === 1) {
        playField[y][x] = 0
      }
    }
  }
}

/*draw new tetro*/
function addActiveTetro() {
  removePrevActiveTetro()
  for (let y = 0; y < activeTetro.shape.length; y++) {
    for (let x = 0; x < activeTetro.shape[y].length; x++) {
      if (activeTetro.shape[y][x] === 1) {
        playField[activeTetro.y + y][activeTetro.x + x] = activeTetro.shape[y][x]
      }
    }
  }
}

/*rotate tetro when "ArrowUp" is pressed*/
function rotateTetro() {
  const prevTetroState = activeTetro.shape
  activeTetro.shape = activeTetro.shape[0].map((val, index) => activeTetro.shape.map((row) => row[index]).reverse())
  if (hasCollisions()) {
  }
}

/*check if the tetro can be moved apart*/
function hasCollisions() {
  for (let y = 0; y < activeTetro.shape.length; y++) {
    for (let x = 0; x < activeTetro.shape[y].length; x++) {
      if (activeTetro.shape[y][x] === 1 && (playField[activeTetro.y + y] === undefined || playField[activeTetro.y + y][activeTetro.x + x] === undefined || playField[activeTetro.y + y][activeTetro.x + x] === 2)) {
        return true
      }
    }
  }
  return false
}

/*romeve and after draw new line*/
function removeFullLines() {
  let canRemoveLine = true,
    filledLines = 0
  for (let y = 0; y < playField.length; y++) {
    for (let x = 0; x < playField[y].length; x++) {
      if (playField[y][x] !== 2) {
        canRemoveLine = false
        break
      }
    }
    if (canRemoveLine) {
      playField.splice(y, 1)
      playField.splice(0, 0, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
      filledLines += 1
    }
    canRemoveLine = true
  }
  switch (filledLines) {
    case 1:
      score += possibleLevels[currentLevel].scorePerLine
      break
    case 2:
      score += possibleLevels[currentLevel].scorePerLine * 3
      break
    case 3:
      score += possibleLevels[currentLevel].scorePerLine * 6
      break
    case 4:
      score += possibleLevels[currentLevel].scorePerLine * 12
      break
  }

  scoreElem.innerHTML = score
  if (score >= possibleLevels[currentLevel].nextLevelScore) {
    currentLevel++
    levelElem.innerHTML = currentLevel
  }
}

/*randomed spawn of tetros*/
function getNewTetro() {
  const possibleFigures = 'IOLJTSZ'
  const rand = Math.floor(Math.random() * 7)
  const newTetro = figures[possibleFigures[rand]]
  return {
    x: Math.floor((10 - newTetro[0].length) / 2),
    y: 0,
    shape: newTetro,
  }
}

/*change properties of tetros, from movingTetros to fixedTetros*/
function fixTetro() {
  for (let y = 0; y < playField.length; y++) {
    for (let x = 0; x < playField[y].length; x++) {
      if (playField[y][x] === 1) {
        playField[y][x] = 2
      }
    }
  }
}

/*move tetro down when 'ArrowDown' is pressed*/
function moveTetroDown() {
  activeTetro.y += 1
  if (hasCollisions()) {
    activeTetro.y -= 1
    fixTetro()
    removeFullLines()
    activeTetro = nextTetro
    if (hasCollisions()) {
      reset()
    }
    nextTetro = getNewTetro()
  }
}

/*drop tetro then event key ' ' (space) is pressed*/
function dropTetro() {
  for (let y = activeTetro.y; y < playField.length; y++) {
    activeTetro.y += 1
    if (hasCollisions()) {
      activeTetro.y -= 1
      break
    }
  }
}

function reset(manualReset = false) {
  playField = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]
  if (manualReset) {
    activeTetro = getNewTetro()
    nextTetro = getNewTetro()
    updateGameState()
  } else {
    clearInterval(gameTimerID)
    gameTimerID = undefined
    isPaused = true
    gameOver.style.display = 'block'
  }
}

/*list of keys*/
document.onkeydown = function (e) {
  if (!isPaused) {
    if (e.key === 'ArrowLeft') {
      activeTetro.x -= 1
      if (hasCollisions()) {
        activeTetro.x += 1
      }
    } else if (e.key === 'ArrowRight') {
      activeTetro.x += 1
      if (hasCollisions()) {
        activeTetro.x -= 1
      }
    } else if (e.key === 'ArrowDown') {
      moveTetroDown()
    } else if (e.key === 'ArrowUp') {
      rotateTetro()
    } else if (e.key === ' ') {
      dropTetro()
    }
    updateGameState()
  }
}

/*main condition of the game*/
function updateGameState() {
  addActiveTetro()
  draw()
  drawNextTetro()
}

pauseBtn.addEventListener('click', (e) => {
  if (e.target.innerHTML === 'Pause') {
    e.target.innerHTML = 'Continue'
    clearInterval(gameTimerID)
  } else {
    e.target.innerHTML = 'Pause'
    gameTimerID = setInterval(startGame, possibleLevels[currentLevel].speed)
  }
  isPaused = !isPaused
})

startBtn.addEventListener('click', (e) => {
  if (!gameTimerID) {
    isPaused = false
    e.target.innerHTML = 'restart'
    gameTimerID = setInterval(startGame, possibleLevels[currentLevel].speed)
    gameOver.style.display = 'none'
  } else {
    reset(true)
  }
})

scoreElem.innerHTML = score
levelElem.innerHTML = currentLevel

draw()

function startGame() {
  moveTetroDown()
  updateGameState()
}