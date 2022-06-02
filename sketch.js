const cellSize = 20;
const updatePerSec = 10;
const updateTime = 1000 / updatePerSec;

const grid = [];
let running = false;
let nextUpdate = updateTime;
let font;

function preload() {
    font = loadFont("assets/iosevka-ss14-bold.ttf");
}

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    // Disable right click pop up
    canvas.elt.oncontextmenu = e => {
        e.preventDefault();
        e.stopPropagation();
    };

    initGrid();
}

function draw() {
    handleInput();
    updateGrid();
    background(0);
    drawGrid();
    drawInfoText();
}

function keyPressed() {
    if (key !== " ") return;
    running = !running;
}

function handleInput() {
    if (!mouseIsPressed) return;

    const row = floor(mouseY / cellSize);
    const col = floor(mouseX / cellSize);
    grid[row][col] = mouseButton === LEFT;
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
    const fillColor = running ? color(0, 255, 0) : "white";

    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
            const x = c * cellSize;
            const y = r * cellSize;
            const drawCell = () => rect(x, y, cellSize, cellSize);

            if (!running) {
                stroke(color("gray"));
                strokeWeight(1);
                noFill();
                drawCell();
            }

            const live = grid[r][c];
            if (!live) continue;

            noStroke();
            fill(fillColor);
            drawCell();
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

function drawInfoText() {
    if (running) return;

    stroke(0);
    strokeWeight(3);
    fill(255);
    textFont(font);
    textSize(20);
    textAlign(LEFT, BOTTOM);
    text(
        `
Left mouse button -> activate a cell
right mouse button -> deactivate a cell
space keyboard key -> run or pause the game`,
        20,
        height - 20
    );
}
