const cellSize = 20;

const grid = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    initGrid();
}

function draw() {
    handleInput();
    background(40);
    drawGrid();
}

function handleInput() {
    if (!mouseIsPressed) return;

    const row = floor(mouseY / cellSize);
    const col = floor(mouseX / cellSize);
    grid[row][col] = true;
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
