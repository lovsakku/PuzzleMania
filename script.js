class Game {
    static currentUser = null;

    static initialize() {
        document.getElementById("shuffle").addEventListener("click", () => {
            new Audio('sounds/click.mp3').play();
            Puzzle.reset();
        });

        document.getElementById("solve-button").addEventListener("click", () => {
            Puzzle.solve();
        });

        this.loadCurrentUser();
    }

    static loadCurrentUser() {
        this.currentUser = localStorage.getItem('currentUser');
    }

    static saveScore(user, time, moves) {
        let scores = JSON.parse(localStorage.getItem('scores')) || {};
        if (!scores[user]) {
            scores[user] = [];
        }
        scores[user].push({ time, moves });
        localStorage.setItem('scores', JSON.stringify(scores));
    }
}

class Puzzle {
    static tiles = [];
    static moves = 0;
    static timer = 0;
    static timerInterval = null;

    static initialize() {
        this.loadImages();
        this.shuffleTiles();
        this.render();
        this.startTimer();
    }

    static loadImages() {
        const imageSources = [
            'images/1.jpg', 'images/2.jpg', 'images/3.jpg',
            'images/4.jpg', 'images/5.jpg', 'images/6.jpg',
            'images/7.jpg', 'images/8.jpg', 'images/9.jpg'
        ];

        this.tiles = imageSources.map((src, index) => new Tile(index, src));
    }

    static shuffleTiles() {
        for (let i = this.tiles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.tiles[i], this.tiles[j]] = [this.tiles[j], this.tiles[i]];
        }
    }

    static solve() {
        this.tiles.sort((a, b) => a.index - b.index);
        this.render();
        clearInterval(this.timerInterval);
        document.getElementById("timer").textContent = `Time: ${this.timer}s`;
        document.getElementById("moves").textContent = `Moves: ${this.moves}`;
        setTimeout(() => {
            this.checkWin();
        }, 500); // Small delay to ensure the tiles are rendered before checking win
    }

    static swapTiles(fromIndex, toIndex) {
        [this.tiles[toIndex], this.tiles[fromIndex]] = [this.tiles[fromIndex], this.tiles[toIndex]];
    }

    static render() {
        const puzzleElement = document.getElementById("puzzle");
        puzzleElement.innerHTML = "";
        this.tiles.forEach(tile => {
            puzzleElement.appendChild(tile.element);
        });
    }

    static startTimer() {
        this.timer = 0;
        this.timerInterval = setInterval(() => {
            this.timer++;
            document.getElementById("timer").textContent = `Time: ${this.timer}s`;
        }, 1000);
    }

    static updateMoves() {
        this.moves++;
        document.getElementById("moves").textContent = `Moves: ${this.moves}`;
    }

    static checkWin() {
        if (this.tiles.every((tile, index) => tile.index === index)) {
            clearInterval(this.timerInterval);
            setTimeout(() => {
                alert(`Congratulations! You completed the puzzle in ${this.timer} seconds with ${this.moves} moves!`);
                const currentUser = localStorage.getItem('currentUser');
                if (currentUser) {
                    Game.saveScore(currentUser, this.timer, this.moves);
                }
            }, 500);
        }
    }

    static reset() {
        this.moves = 0;
        this.timer = 0;
        clearInterval(this.timerInterval);
        this.startTimer();
        this.shuffleTiles();
        this.render();
    }
}

class Tile {
    constructor(index, imageSrc) {
        this.index = index;
        this.imageSrc = imageSrc;
        this.element = document.createElement('div');
        this.element.className = 'tile';
        this.element.style.backgroundImage = `url(${imageSrc})`;
        this.element.draggable = true;
        this.element.addEventListener('dragstart', this.dragStart.bind(this));
        this.element.addEventListener('dragover', this.dragOver.bind(this));
        this.element.addEventListener('drop', this.drop.bind(this));
        this.element.addEventListener('dragend', this.dragEnd.bind(this));
    }

    dragStart(e) {
        e.dataTransfer.setData('text/plain', this.index);
        setTimeout(() => {
            this.element.classList.add('dragging');
        }, 0);
    }

    dragOver(e) {
        e.preventDefault();
        this.element.classList.add('over');
    }

    drop(e) {
        e.preventDefault();
        const fromIndex = e.dataTransfer.getData('text/plain');
        const toIndex = this.index;
        Puzzle.swapTiles(fromIndex, toIndex);
        Puzzle.updateMoves();
        Puzzle.render();
        Puzzle.checkWin();
    }

    dragEnd() {
        this.element.classList.remove('dragging');
        this.element.classList.remove('over');
    }
}

document.addEventListener("DOMContentLoaded", () => {
    Game.initialize();
    Puzzle.initialize();
});
