const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const playerInfoDiv = document.getElementById('player-info');
const logDiv = document.getElementById('log');

const GRID_SIZE = 20;
const CELL_SIZE = canvas.width / GRID_SIZE;

let snake = [
    {x: 10, y: 10},
    {x: 9, y: 10},
    {x: 8, y: 10}
];
let direction = {x: 1, y: 0};
let nextDirection = {x: 1, y: 0};
let food = spawnFood();
let score = 0;
let alive = true;
let speed = 120;
let timer = null;

// 主角名字
const mainCharacter = "王鹏";

function spawnFood() {
    while (true) {
        let fx = Math.floor(Math.random() * GRID_SIZE);
        let fy = Math.floor(Math.random() * GRID_SIZE);
        if (!snake.some(seg => seg.x === fx && seg.y === fy)) {
            return {x: fx, y: fy};
        }
    }
}

function addLog(msg) {
    logDiv.innerText = msg + '\n' + logDiv.innerText;
}

function updatePlayerInfo() {
    playerInfoDiv.innerHTML = `
        <b>主角</b>：${mainCharacter}<br>
        <b>得分</b>：${score}<br>
        <b>长度</b>：${snake.length}
    `;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制食物
    ctx.fillStyle = "#ff4949";
    ctx.fillRect(food.x * CELL_SIZE, food.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

    // 绘制蛇
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "#4ef542" : "#42c6f5";
        ctx.fillRect(snake[i].x * CELL_SIZE, snake[i].y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        // 在蛇头写“王鹏”
        if (i === 0) {
            ctx.fillStyle = "#fff";
            ctx.font = `${CELL_SIZE * 0.7}px 微软雅黑`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(mainCharacter, snake[i].x * CELL_SIZE + CELL_SIZE/2, snake[i].y * CELL_SIZE + CELL_SIZE/2);
        }
    }
}

function step() {
    if (!alive) return;

    direction = nextDirection;

    // 计算新头部位置
    const newHead = {
        x: (snake[0].x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (snake[0].y + direction.y + GRID_SIZE) % GRID_SIZE
    };

    // 判断是否撞到自己
    if (snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
        alive = false;
        addLog("哎呀\n游戏结束！王鹏撞到了自己！");
        draw();
        return;
    }

    // 移动蛇
    snake.unshift(newHead);

    // 吃到食物
    if (newHead.x === food.x && newHead.y === food.y) {
        score += 1;
        food = spawnFood();
        addLog("王鹏吃到了食物，长度增加！");
        // 难度提升
        if (score % 5 === 0 && speed > 60) {
            speed -= 10;
            clearInterval(timer);
            timer = setInterval(step, speed);
            addLog("速度提升！");
        }
    } else {
        snake.pop();
    }

    draw();
    updatePlayerInfo();
}

window.addEventListener('keydown', e => {
    if (!alive) return;
    let key = e.key;
    if (key === 'ArrowUp' && direction.y !== 1) nextDirection = {x: 0, y: -1};
    else if (key === 'ArrowDown' && direction.y !== -1) nextDirection = {x: 0, y: 1};
    else if (key === 'ArrowLeft' && direction.x !== 1) nextDirection = {x: -1, y: 0};
    else if (key === 'ArrowRight' && direction.x !== -1) nextDirection = {x: 1, y: 0};
});

// 初始化
addLog("使用方向键控制王鹏移动，吃食物变长，撞到自己则游戏结束！");
updatePlayerInfo();
draw();
timer = setInterval(step, speed);
