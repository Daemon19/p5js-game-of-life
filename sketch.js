const cellSize = 20;
const updatePerSec = 10;
const updateTime = 1000 / updatePerSec;

const grid = [];
let running = false;
let nextUpdate = updateTime;

function setup() {
    createCanvas(windowWidth, windowHeight);
    initGrid();
}

function draw() {
    handleInput();
    updateGrid();
    background(0);
    drawGrid();
}

function keyPressed() {
    if (key !== " ") return;
    running = !running;
}

function handleInput() {
    if (!mouseIsPressed) return;

    const row = floor(mouseY / cellSize);
    const col = floor(mouseX / cellSize);
    grid[row][col] = true;
}

function updateGrid() {
    if (!running || !isTimeToUpdate()) return;

    const original = grid.map(arr => arr.slice());

    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
            const live = grid[r][c];
            const neighbours = GetNeighbours(original, r, c);

            if (live) {
                if (neighbours < 2) grid[r][c] = false;
                else if (neighbours === 2 || neighbours === 3) continue;
                else grid[r][c] = false;
            } else if (neighbours === 3) {
                grid[r][c] = true;
            }
        }
    }
}

function isTimeToUpdate() {
    nextUpdate -= deltaTime;
    if (nextUpdate < 0) {
        nextUpdate = updateTime;
        return true;
    }
    return false;
}

function GetNeighbours(grid, row, col) {
    let neighbours = 0;

    for (let r = -1; r <= 1; r++) {
        const nrow = row + r;
        if (nrow < 0 || nrow >= grid.length) continue;

        for (let c = -1; c <= 1; c++) {
            const ncol = col + c;
            if (
                ncol < 0 ||
                ncol >= grid[row].length ||
                (r === 0 && c === 0) ||
                !grid[nrow][ncol]
            )
                continue;
            neighbours++;
        }
    }

    return neighbours;
}

function drawGrid() {
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
            const live = grid[r][c];
            if (!live) continue;

            const x = c * cellSize;
            const y = r * cellSize;
            noStroke();
            fill("limegreen");
            rect(x, y, cellSize, cellSize);
        }
    }
}

function initGrid() {
    for (let r = 0; r < windowHeight / cellSize; r++) {
        grid.push([]);

        for (let c = 0; c < windowWidth / cellSize; c++) {
            grid[r].push(false);
        }
    }
}
