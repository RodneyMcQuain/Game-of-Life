document.addEventListener("DOMContentLoaded", e => {
    const BOARD_SIZE = 150;
    const UPDATE_TIME_IN_MS = 150;
    const ctx = canvas.getContext('2d');
    const canvasElement = document.getElementById("canvas");
    const generationCountElement = document.getElementById("generationCount");
    
    let board = getRandomGrid();
    let generationCount = 0;
    canvasElement.height = window.innerHeight * .9;
    canvasElement.width = window.innerWidth * .9;

    setInterval(() => {
        const width = canvasElement.width;
        const height = canvasElement.height;
        ctx.clearRect(0, 0, width, height);

        drawGrid(ctx, board);
        gameOfLife(board);
        generationCountElement.textContent = `Generation Count: ${++generationCount}`;
    }, UPDATE_TIME_IN_MS);

    function getRandomGrid() {
        const board = new Array(BOARD_SIZE);
        const isAlive = () => Math.random() > .6 ? true : false;

        for (let i = 0; i < board.length; i++) {
            board[i] = new Array(BOARD_SIZE);

            for (let j = 0; j < board.length; j++)
                board[i][j] = isAlive();
        }

        return board;
    }

    function drawGrid(ctx, board) {
        const CELL_SIZE = canvasElement.width / BOARD_SIZE;
        const ALIVE_COLOR = '#251ea9';
        const DEAD_COLOR = '#262626';
        const draw = (color, canvasArguments) => {
            ctx.fillStyle = color;
            ctx.strokeStyle = color;
            ctx.fillRect(...canvasArguments);
            ctx.strokeRect(...canvasArguments);
        };

        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[0].length; j++) {
                const isAlive = board[i][j];
                const canvasArguments = [
                    i * CELL_SIZE, 
                    j * CELL_SIZE, 
                    CELL_SIZE, 
                    CELL_SIZE
                ];
                
                if (isAlive)
                    draw(ALIVE_COLOR, canvasArguments);
                else
                    draw(DEAD_COLOR, canvasArguments);
            }
        }
    }

    function gameOfLife(board) {
        const clone2DArray = twoDArray => twoDArray.map(subArray => subArray.slice(0));
        let boardTemp = clone2DArray(board);
        
        const isLeft = row => row - 1 >= 0;
        const isRight = (row, rowLength) => row + 1 < rowLength;
        const isAbove = col => col - 1 >= 0;
        const isBelow = (col, colLength) => col + 1 < colLength;
        const isAlive = lifeValue => lifeValue;
        const shouldDie = neighborCount => neighborCount < 2 || neighborCount > 3;
        const shouldLive = neighborCount => neighborCount === 3;

        if (board) {
            for (let i = 0; i < boardTemp.length; i++) {
                const rowLength = boardTemp.length;

                for (let j = 0; j < boardTemp[0].length; j++) {
                    const colLength = boardTemp[0].length;
                    const current = boardTemp[i][j];
                
                    let neighborCount = 0; 
    
                    if (isLeft(i) && boardTemp[i - 1][j])
                        neighborCount++;
    
                    if (isAbove(j) && boardTemp[i][j - 1])
                        neighborCount++;

                    if (isRight(i, rowLength) && boardTemp[i + 1][j])
                        neighborCount++;

                    if (isBelow(j, colLength) && boardTemp[i][j + 1])
                        neighborCount++;
    
                    if (isLeft(i) && isAbove(j) && boardTemp[i - 1][j - 1])
                        neighborCount++;
    
                    if (isRight(i, rowLength) && isAbove(j) && boardTemp[i + 1][j - 1])
                        neighborCount++;
    
                    if (isLeft(i) && isBelow(j, colLength) && boardTemp[i - 1][j + 1])
                        neighborCount++;
    
                    if (isRight(i, rowLength) && isBelow(j, colLength) && boardTemp[i + 1][j + 1])
                        neighborCount++;
                
                    if (isAlive(current) && shouldDie(neighborCount))
                        board[i][j] = false;
                    else if (!isAlive(current) && shouldLive(neighborCount))
                        board[i][j] = true;
                }
            }
        }
    }
});