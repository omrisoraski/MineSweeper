'use strict'


const MINE = '💣'
const FLAG = '🚩'
const EMPTY = ''
const NUMBR = ['', '1', '2', '3', '4', '5', '6', '7']

var gBoard
var gGame
var gLevel
var timerInterval = null
var startTime
var isTimerStarted = false


gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

gLevel = {
    SIZE: 4,
    MINES: 2
}

function onInit() {
    gBoard = buildBoard()
    renderBoard(gBoard)
    gGame.isOn = true
    hideModal()
    hideModal1()

}

function buildBoard() {
    const board = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        board.push([])
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = createCell()
        }
    }
    placeMines(board)
    setMinesNegsCount(board)
    return board
}

function renderBoard(board) {
    var strHTML = '<table border="0"><tbody>'
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j];
            var className = 'cell cell-' + i + '-' + j
            strHTML += '<td class="' + className + '" onclick="onCellClicked(this, ' + i + ', ' + j + ')" oncontextmenu="onCellMarked(this, event); return false;">'
            if (cell.isShown) {
                if (cell.isMine) {
                    strHTML += MINE
                } else {
                    strHTML += cell.minesAroundCount > 0 ? cell.minesAroundCount : EMPTY
                }
            }
            strHTML += '</td>'
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'
    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

function placeMines(board) {
    var minesPlaced = 0
    while (minesPlaced < gLevel.MINES) {
        var i = Math.floor(Math.random() * gLevel.SIZE)
        var j = Math.floor(Math.random() * gLevel.SIZE)
        if (!board[i][j].isMine) {
            board[i][j].isMine = true
            minesPlaced++
        }
    }
}

function setMinesNegsCount(board) {
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if (!board[i][j].isMine) {
                var minesCount = 0
                for (var di = -1; di <= 1; di++) {
                    for (var dj = -1; dj <= 1; dj++) {
                        if (di === 0 && dj === 0) continue
                        var ni = i + di
                        var nj = j + dj
                        if (ni >= 0 && ni < gLevel.SIZE && nj >= 0 && nj < gLevel.SIZE && board[ni][nj].isMine) {
                            minesCount++
                        }
                    }
                }
                board[i][j].minesAroundCount = minesCount
            }
        }
    }
}

function onCellClicked(elCell, i, j) {
    if (!gGame.isOn) return


    if (!isTimerStarted) {
        startTimer()
        isTimerStarted = true
    }

    const cell = gBoard[i][j]
    if (cell.isShown || cell.isMarked) return

    cell.isShown = true
    if (cell.isMine) {
        elCell.innerHTML = MINE

        stopTimer()
        gGame.isOn = false
        showModalLose()
        changeSmiley('😵')

    } else {
        elCell.innerHTML = cell.minesAroundCount > 0 ? cell.minesAroundCount : EMPTY
        if (cell.minesAroundCount === 0) {
            expandShown(gBoard, elCell, i, j)
        }
    }
    checkGameOver()
}

function onCellMarked(elCell, event) {
    event.preventDefault()

    const cellCoords = elCell.className.split(' ')[1].split('-')
    const i = +cellCoords[1]
    const j = +cellCoords[2]
    const cell = gBoard[i][j]

    if (cell.isShown) return

    cell.isMarked = !cell.isMarked
    elCell.innerHTML = cell.isMarked ? FLAG : EMPTY

    checkGameOver()
}

function checkGameOver() {
    var win = true
    var lose = false

    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            const cell = gBoard[i][j];
            if (cell.isMine && !cell.isMarked) {
                win = false
            } else if (!cell.isMine && !cell.isShown) {
                win = false
            }
            if (cell.isMine && cell.isShown) {
                lose = true
                break
            }
        }
        if (lose) break
    }

    if (win || lose) {
        gGame.isOn = false
        stopTimer()
        showModal()
    }
}

function expandShown(board, elCell, i, j) {
    for (var di = -1; di <= 1; di++) {
        for (var dj = -1; dj <= 1; dj++) {
            if (di === 0 && dj === 0) continue
            const ni = i + di
            const nj = j + dj
            board[i][j].isShown = true
            updateCellUI(i, j)
            if (ni >= 0 && ni < gLevel.SIZE && nj >= 0 && nj < gLevel.SIZE) {
                const neighbor = board[ni][nj]
                if (!neighbor.isMine && !neighbor.isShown) {
                    neighbor.isShown = true

                    const neighborEl = document.querySelector(`.cell-${ni}-${nj}`)
                    neighborEl.innerHTML = neighbor.minesAroundCount > 0 ? neighbor.minesAroundCount : EMPTY
                    neighborEl.classList.add('shown')
                    if (neighbor.minesAroundCount === 0) {
                        expandShown(board, neighborEl, ni, nj)
                    }
                }
            }
        }
    }
}

function updateCellUI(i, j) {
    const elCell = document.querySelector(`.cell-${i}-${j}`)
    elCell.style.backgroundColor = "white"
}

function createCell() {
    return {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false
    }
}

function startGame(level) {
    if (level === 'beginner') {
        gLevel.SIZE = 4
        gLevel.MINES = 2
    } else if (level === 'medium') {
        gLevel.SIZE = 8
        gLevel.MINES = 14
    } else if (level === 'expert') {
        gLevel.SIZE = 12
        gLevel.MINES = 32
    }
    onInit()
}

function restartGame() {
    stopTimer()
    gGame.isOn = false
    isTimerStarted = false
    hideModal()
    hideModal1()
    onInit()
}

function showModal() {
    const elModal = document.querySelector('.modal')
    elModal.classList.remove('hide')


}

function hideModal() {
    const elModal = document.querySelector('.modal')
    elModal.classList.add('hide')

}

function showModalLose() {
    const elModal1 = document.querySelector('.modal1')
    elModal1.classList.remove('hide1')


}

function hideModal1() {
    const elModal1 = document.querySelector('.modal1')
    elModal1.classList.add('hide1')

}

function startTimer() {
    if (timerInterval) {
        clearInterval(timerInterval)
    }
    startTime = Date.now()
    timerInterval = setInterval(updateTimer, 100)
}

function updateTimer() {
    var currentTime = Date.now()
    var timeElapsed = currentTime - startTime
    var seconds = Math.floor(timeElapsed / 1000)
    var milliseconds = timeElapsed % 1000


    var formattedTime = seconds + ':' + ('000' + milliseconds).slice(-3)

    document.querySelector('.timer').innerText = formattedTime
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval)
        timerInterval = null
    }
}

function changeSmiley() {
    const elSmiley = document.querySelector('.text')
    if (gGame.isOn) {
        elSmiley.innerHTML = '😎'
    } else {
        elSmiley.innerHTML = '😵'
    }
}