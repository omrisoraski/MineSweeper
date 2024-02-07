// 'use strict'


// const MINE = 'MINE'
// const NUMBER = 'NUMBER'
// const EMPTY = ''




// var gBoard
// console.table(gBoard)



// function onInit() {
//     gBoard = buildBoard()
//     renderBoard(gBoard)
// }

// function buildBoard() {
//     var board = []
//     for (var i = 0; i < 4; i++) {
//         board.push([])
//         for (var j = 0; j < 4; j++) {
//             board[i][j] = (Math.random() > 0.8) ? MINE : ''
//         }
//     }
//     return board
// }


// function renderBoard(board) {
//     console.table(gBoard)
// }

// function setMinesNegsCount(board) {
//     const newBoard = copyMat(board)
//     for (var i = 0; i < board.length; i++) {
//         for (var j = 0; j < board[0].length; j++) {
//             const numOfNeighbors = countNeighbors(i, j, board)
//             const currCell = board[i][j]
//             if ((numOfNeighbors > 1) && (numOfNeighbors < 8)) {
//                 if (currCell === EMPTY) newBoard[i][j] = MINE
//             }
//             else if (currCell === NUMBER) newBoard[i][j] = EMPTY
//         }
//     }
//     return newBoard

// }

// function countNeighbors(cellI, cellJ, mat) {
//     var neighborsCount = 0
//     for (var i = cellI - 1; i <= cellI + 1; i++) {
//         if (i < 0 || i >= mat.length) continue
//         for (var j = cellJ - 1; j <= cellJ + 1; j++) {
//             if (i === cellI && j === cellJ) continue
//             if (j < 0 || j >= mat[i].length) continue
//             if (mat[i][j] === NUMBER || mat[i][j] === MINE) neighborsCount++
//         }
//     }
//     return neighborsCount
// }

// 'use strict'

// const MINE = '💥'
// const NUMBER = 'NUMBER'
// const EMPTY = ''
// const FLAG = 'FLAG'

// const MINE_IMG = '<img src="img/mine.jpg">'
// const FLAG_IMG = '<img src="img/flag.png">'

// let gBoard

// function onInit() {
//     gBoard = buildBoard()
//     setMinesNegsCount(gBoard)
//     renderBoard(gBoard)
// }

// function buildBoard() {
//     const board = [];
//     for (let i = 0; i < 4; i++) {
//         board.push([])
//         for (let j = 0; j < 4; j++) {
//             board[i][j] = { type: EMPTY, revealed: false }
//         }
//     }
//     placeMines(board, 2)
//     return board
// }

// function placeMines(board, numMines) {
//     let minesPlaced = 0;
//     while (minesPlaced < numMines) {
//         const randRow = Math.floor(Math.random() * 4)
//         const randCol = Math.floor(Math.random() * 4)
//         if (board[randRow][randCol].type !== MINE) {
//             board[randRow][randCol].type = MINE
//             minesPlaced++;
//         }
//     }
// }

// function renderBoard(board) {
//     const elBoard = document.querySelector('.board tbody')
//     let strHTML = ''
//     for (let i = 0; i < board.length; i++) {
//         strHTML += '<tr>'
//         for (let j = 0; j < board[i].length; j++) {
//             const cell = board[i][j];
//             strHTML += `<td data-i="${i}" data-j="${j}" class="cell ${cell.revealed ? 'revealed' : ''}" onclick="cellClicked(this, ${i}, ${j})"></td>`
//         }
//         strHTML += '</tr>'
//     }
//     elBoard.innerHTML = strHTML;
// }


// function cellClicked(elCell, row, col) {
//     const cell = gBoard[row][col]
//     if (!cell.revealed) {
//         cell.revealed = true
//         if (cell.type === MINE) {
//             elCell.classList.add('mine')
//             // Game over logic
//         } else if (cell.type === EMPTY) {
//             // Reveal empty cell logic
//         } else {
//             elCell.textContent = cell.type
//             // Reveal number logic
//         }
//     }
// }

// function blowUpNeighs(cellI, cellJ) {
//     for (var i = cellI - 1; i <= cellI + 1; i++) {
//         if (i < 0 || i >= gBoard.length) continue
//         for (var j = cellJ - 1; j <= cellJ + 1; j++) {
//             if (i === cellI && j === cellJ) continue
//             if (j < 0 || j >= gBoard[i].length) continue

//             // Model
//             gBoard[i][j] = EMPTY

//             // DOM
//             const elCell = renderCell(i, j, EMPTY)
//             elCell.classList.remove('occupied')
//         }
//     }
// }

// function hideMine(cellI, cellJ) {
//     if (gBoard[cellI][cellJ].type === MINE) {
//         gBoard[cellI][cellJ].type = EMPTY
//         const elCell = document.querySelector(`[data-i="${cellI}"][data-j="${cellJ}"]`)
//         elCell.innerText = EMPTY
//     }
// }

// function renderCell(cellI, cellJ, val) {
//     const elCell = document.querySelector(`[data-i="${cellI}"][data-j="${cellJ}"]`)
//     elCell.innerText = val
//     return elCell;
// }

// function setMinesNegsCount(board) {
//     for (let i = 0; i < board.length; i++) {
//         for (let j = 0; j < board[i].length; j++) {
//             if (board[i][j].type !== MINE) {
//                 let minesCount = countMinesAround(i, j, board)
//                 board[i][j].type = minesCount > 0 ? minesCount : EMPTY
//             }
//         }
//     }
// }

// function countMinesAround(cellI, cellJ, board) {
//     let minesCount = 0
//     for (let i = Math.max(0, cellI - 1); i <= Math.min(cellI + 1, board.length - 1); i++) {
//         for (let j = Math.max(0, cellJ - 1); j <= Math.min(cellJ + 1, board[i].length - 1); j++) {
//             if (!(i === cellI && j === cellJ) && board[i][j].type === MINE) {
//                 minesCount++;
//             }
//         }
//     }
//     return minesCount
// }
