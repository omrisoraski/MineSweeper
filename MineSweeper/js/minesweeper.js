
'use strict'

const MINE = '💣'
const FLAG = '🚩'
const NUMBER = 'NUMBER'
const EMPTY = ''

const gLevel = {
    SIZE: 4,
    MINES: 2
}

const gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
};

let gBoard = []

function onInit() {
    gBoard = buildBoard(gLevel.SIZE)
    setRandomMines(gLevel.MINES)
    setMinesNegsCount()
    renderBoard(gBoard)
    hideModal()

    document.addEventListener('contextmenu', function (event) {
        event.preventDefault();
    })
}

function buildBoard(size) {
    let board = []
    for (let i = 0; i < size; i++) {
        board.push([]);
        for (let j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            };
        }
    }
    return board
}

function setMines(minesCount) {
    let minesPlaced = 0
    while (minesPlaced < minesCount) {
        let row = Math.floor(Math.random() * gLevel.SIZE)
        let col = Math.floor(Math.random() * gLevel.SIZE)
        if (!gBoard[row][col].isMine) {
            gBoard[row][col].isMine = true
            minesPlaced++
        }
    }
}

function onCellMarked(ev, i, j) {
    ev.preventDefault()
    if (!gGame.ison) return
    if (!gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = true
        gGame.markedCount++
        renderCell({ i, j }, FLAG)

    } else {
        gBoard[i][j].isMarked = false
        gGame.markedCount--
        renderCell({ i, j },)
    }
}

function setMinesNegsCount() {
    for (let i = 0; i < gLevel.SIZE; i++) {
        for (let j = 0; j < gLevel.SIZE; j++) {
            if (!gBoard[i][j].isMine) {
                gBoard[i][j].minesAroundCount = countNeighborMines(i, j)
            }
        }
    }
}

function countNeighborMines(row, col) {
    let count = 0
    for (let i = row - 1; i <= row + 1; i++) {
        for (let j = col - 1; j <= col + 1; j++) {
            if (i >= 0 && i < gLevel.SIZE && j >= 0 && j < gLevel.SIZE && gBoard[i][j].isMine) {
                count++
            }
        }
    }
    return count
}

function renderBoard(board) {
    const elBoard = document.querySelector('.board tbody')
    let strHTML = ''
    for (let i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (let j = 0; j < board[i].length; j++) {
            const cell = board[i][j]
            let content = ''
            if (cell.isShown) {
                content = cell.isMine ? MINE : cell.minesAroundCount || EMPTY
            }
            const classFlagged = cell.isMarked ? FLAG : ''
            strHTML += `<td data-i="${i}" data-j="${j}" class="cell ${cell.isShown ? 'revealed' : ''} ${classFlagged}" onclick="cellClicked(this, ${i}, ${j})" oncontextmenu="handleFlag(event)">${content}</td>`
        }
        strHTML += '</tr>';
    }
    elBoard.innerHTML = strHTML
}

function cellClicked(cellElement, row, col) {
    let cell = gBoard[row][col]
    if (!cell.isMarked) {
        if (!cell.isShown) {
            cell.isShown = true
            if (cell.isMine) {
                gameOver()
            } else {
                openEmptyCells(row, col)
                checkVictory()
            }
            renderBoard(gBoard)
        }
    }
}

function openEmptyCells(row, col) {
    const startRow = Math.max(row - 1, 0)
    const endRow = Math.min(row + 1, gLevel.SIZE - 1)
    const startCol = Math.max(col - 1, 0)
    const endCol = Math.min(col + 1, gLevel.SIZE - 1)
    for (let i = startRow; i <= endRow; i++) {
        for (let j = startCol; j <= endCol; j++) {
            const cell = gBoard[i][j]
            if (!cell.isMine && !cell.isShown) {
                cell.isShown = true
                if (cell.minesAroundCount === 0) {
                    openEmptyCells(i, j)
                }
            }
        }
    }
}

function setRandomMines(minesCount) {
    let minesPlaced = 0
    while (minesPlaced < minesCount) {
        let row = Math.floor(Math.random() * gLevel.SIZE)
        let col = Math.floor(Math.random() * gLevel.SIZE)
        if (!gBoard[row][col].isMine) {
            gBoard[row][col].isMine = true
            minesPlaced++
        }
    }
}

function handleFlag(event) {
    event.preventDefault()
    const cell = findClickedCell(event.clientX, event.clientY)
    if (cell && !cell.isShown) {
        cell.isMarked = !cell.isMarked
        renderBoard(gBoard)
    }
}

function findClickedCell(clientX, clientY) {

    const rect = document.querySelector('.board').getBoundingClientRect()
    const offsetX = clientX - rect.left
    const offsetY = clientY - rect.top


    const cellSize = rect.width / gLevel.SIZE;
    const cellRow = Math.floor(offsetY / cellSize)
    const cellCol = Math.floor(offsetX / cellSize)


    if (cellRow >= 0 && cellRow < gLevel.SIZE && cellCol >= 0 && cellCol < gLevel.SIZE) {

        return gBoard[cellRow][cellCol]
    }

    return null
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

function hideModal() {
    const elModal = document.querySelector('.modal')
    elModal.classList.add('hide')

}

function showModal() {
    const elModal = document.querySelector('.modal')
    elModal.classList.remove('hide')

}

function checkVictory() {
    let unrevealedCells = 0

    for (let i = 0; i < gLevel.SIZE; i++) {
        for (let j = 0; j < gLevel.SIZE; j++) {
            if (!gBoard[i][j].isShown && !gBoard[i][j].isMine) {
                unrevealedCells++
            }
        }
    }

    if (unrevealedCells === 0) {
        showModal();
    }
}

function gameOver() {

    showModal()
}