
'use strict'

const MINE = '💣';
const FLAG = '🚩';
const NUMBER = 'NUMBER';
const EMPTY = ''

const gLevel = {
    SIZE: 4,
    MINES: 2
};

const gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
};

let gBoard = []

function onInit () {
    gBoard = buildBoard(gLevel.SIZE)
    setMines(gLevel.MINES)
    setMinesNegsCount()
    renderBoard(gBoard)
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
            strHTML += `<td data-i="${i}" data-j="${j}" class="cell ${cell.isShown ? 'revealed' : ''}" onclick="cellClicked(this, ${i}, ${j})">${content}</td>`
        }
        strHTML += '</tr>'
    }
    elBoard.innerHTML = strHTML
}

function cellClicked(cellElement, row, col) {
    let cell = gBoard[row][col]
    if (!cell.isShown && !cell.isMarked) {
        cell.isShown = true;
       
        if (cell.minesAroundCount === 0) {
            openEmptyCells(row, col)
        }
        renderBoard(gBoard)
    }
}

function openEmptyCells(row, col) {
    
    const startRow = Math.max(row - 1, 0)
    const endRow = Math.min(row + 1, gLevel.SIZE - 1)
    const startCol = Math.max(col - 1, 0)
    const endCol = Math.min(col + 1, gLevel.SIZE - 1)

    
    for (let i = startRow; i <= endRow; i++) {
        for (let j = startCol; j <= endCol; j++) {
           
            if (!gBoard[i][j].isMine && !gBoard[i][j].isShown) {
                
                gBoard[i][j].isShown = true
                renderBoard(gBoard)
                openEmptyCells(i, j)
            }
        }
    }
}





