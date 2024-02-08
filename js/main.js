'use strict'


const MINE = '💣';
const FLAG = '🚩';
const EMPTY = '';
const NUMBR = ['', '1', '2', '3', '4', '5', '6', '7'];

var gBoard;
var gGame;
var gLevel;

gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
};

gLevel = {
    SIZE: 4,
    MINES: 2
};


function onInit() {
    gBoard = buildBoard()
    renderBoard(gBoard)
    gGame.isOn = true
    
}


function buildBoard() {
    const board = []
    for (let i = 0; i < gLevel.SIZE; i++) {
        board.push([])
        for (let j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = createCell();
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
            strHTML += '<td class="' + className + '" onclick="onCellClicked(this, ' + i + ', ' + j + ')" oncontextmenu="onCellMarked(this, event); return false;"> '
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
    let minesPlaced = 0
    while (minesPlaced < gLevel.MINES) {
        let i = Math.floor(Math.random() * gLevel.SIZE)
        let j = Math.floor(Math.random() * gLevel.SIZE)
        if (!board[i][j].isMine) {
            board[i][j].isMine = true
            minesPlaced++
        }
    }
}

function setMinesNegsCount(board) {
    for (let i = 0; i < gLevel.SIZE; i++) {
        for (let j = 0; j < gLevel.SIZE; j++) {
            if (!board[i][j].isMine) {
                let minesCount = 0
                for (let di = -1; di <= 1; di++) {
                    for (let dj = -1; dj <= 1; dj++) {
                        if (di === 0 && dj === 0) continue
                        let ni = i + di
                        let nj = j + dj
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

    const cell = gBoard[i][j]
    if (cell.isShown || cell.isMarked) return;

    cell.isShown = true
    if (cell.isMine) {
        elCell.innerHTML = MINE

        console.log('Game Over! Stepped on a mine!')
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
    let win = true
    let lose = false

    for (let i = 0; i < gLevel.SIZE; i++) {
        for (let j = 0; j < gLevel.SIZE; j++) {
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
        gGame.isOn = false;
        const message = win ? 'You Win!' : 'You Lose!'
        console.log(message)
    }
}


function expandShown(board, elCell, i, j) {
    for (let di = -1; di <= 1; di++) {
        for (let dj = -1; dj <= 1; dj++) {
            const ni = i + di
            const nj = j + dj
            if (ni >= 0 && ni < gLevel.SIZE && nj >= 0 && nj < gLevel.SIZE) {
                const nextCell = board[ni][nj]
                if (!nextCell.isMine && !nextCell.isShown) {
                    nextCell.isShown = true
                    const nextElCell = document.querySelector(`.cell-${ni}-${nj}`)
                    nextElCell.innerHTML = nextCell.minesAroundCount > 0 ? nextCell.minesAroundCount : EMPTY
                    if (nextCell.minesAroundCount === 0) {
                        expandShown(board, nextElCell, ni, nj)
                    }
                }
            }
        }
    }
}

function createCell() {
    return {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false
    };
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

